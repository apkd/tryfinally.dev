---
layout: post
title: "Detours: redirecting C# methods at runtime"
thumbtext: "Detours"
author: apkd
categories: [ unity-protips ]
tags: [ unity, csharp ]
series: true
featured: false
license: cc-by
image: assets/img/social/R79qkPYvrcM.webp
---

**Detours are a way to replace the implementation of a C# method.**
Basically, you take a method (typically from some assembly you don't have the source for) and overwrite it with a `jmp` to your own implementation.

***At runtime.***

![package illustration](assets/img/posts/detours-exorcismo.gif){:.pixel-perfect}


* chapter 1
* chapter 2
* chapter 3
{:toc}

# Use cases

What could possibly justify such sacrilege?

- **Modding.** The code [originates in the CommunityCoreLibrary](https://github.com/RimWorldCCLTeam/CommunityCoreLibrary/blob/master/DLL_Project/Classes/Static/Detours.cs), which was created for use by RimWorld modders. Detours give the ability to augment/replace certain hard-coded functions in the game code, even if the game developers didn't anticipate the need to make it overridable.
- **Unity Editor workarounds.** Thanks to [UPM packages](/unity-package-cheatsheet) and [Assembly Definitions/References](https://docs.unity3d.com/Manual/class-AssemblyDefinitionReferenceImporter.html), Unity has recently become significantly much more open to modification, but a lot of the engine code still isn't extendable. Detours open the door to all kinds of editor bugfixes and tools (and bugs and demons) that wouldn't be possible otherwise.
- **Unity Engine runtime workarounds.** I wouldn't be very comfortable actually shipping a game with detours, but sometimes *you gotta do what you gotta do*.
- **In general, patching code from referenced assemblies when you have no source access.**

***Here be dragons.***\
Be prepared for crashes, freezes, data corruption, dazzling fireworks, and breakage in future runtime/engine versions.\
\
When using *cursed hacks* like this one, make absolutely sure what you're getting into.
If you ask me, detours are better than modding engine DLLs, or rewriting swaths of engine code just to change the behaviour of one function...\
\
But still, try looking for a more legitimate workaround before you resort to this.
{:.callout .callout-danger}

# Caveats
## "Supported" platforms

So where exactly can we use this?

| Unity (Editor, Win) | Unity (Mono Player, Win x86/x64) | Unity (IL2CPP)                  |
|---------------------|----------------------------------|---------------------------------|
| **Works!** [^0]     | **Works!** [^0]                  | **Nope :<**{:.text-danger} [^1] |

IL2CPP doesn't work. Either way, you probably shouldn't be shipping your PlayStation games with hacks like this...

And as for usage outside Unity:

| Mono 6.13 (x86/x64) | .NET 6 (x86/x64)                    |
|---------------------|-------------------------------------|
| **Works!** [^0]     | **Unreliable**{:.text-warning} [^2] |

[^0]: Your mileage may vary.

[^1]: Throws: `NotSupportedException: runtimemethodhandle.cpp(16) : Unsupported internal call for IL2CPP:RuntimeMethodHandle::GetFunctionPointer - "This icall is not supported by il2cpp. Use Marshal.GetFunctionPointerForDelegate instead."` I'm not sure whether a workaround is possible, but it seems unlikely given the AOT-compiled nature of IL2CPP.

[^2]: Some (but not all) of the detours that work on Mono seem to crash/freeze the executable.

## Other issues

* Playing with private APIs is a recipe for disaster.
  * They are prone to breaking changes, so your hacks are likely to blow up in your face when you update Unity.
  * Sometimes you'll have to replicate a lot of internal code.
  * If the method receives/returns arguments of private types, it's workarounds on top of workarounds (you need to use base types and reflection).
* Watch out for recursion. Detours obfuscate flow of control. You can very easily end up with a `StackOverflowException` by trying to use the `src` method from the `dst` method.
  * Unfortunately, there is currently no way to call the original method after you've patched it. You need to reimplement it from scratch.
* Once a detour is applied, the effects are permanent for the loaded assembly.
  * In the Unity editor, you can reload the script assemblies. This makes `[InitializeOnLoad]` a good place for detour initialization.
* Detours for some functions will refuse to work no matter how hard you try.
  * For example due to JIT inlining. Methods with a small instruction count are bad candidates for detours. `[MethodImpl(MethodImplOptions.NoInlining)]`{{site.code.cs}} helps, but the whole point of Detours is to avoid having to modify the DLL... I do suppose that's still easier than replacing the entire method body using [dnSpy](https://github.com/dnSpy/dnSpy) or [Mono.Cecil](https://www.mono-project.com/docs/tools+libraries/libraries/Mono.Cecil/).

# ✝ Let's do it ✝

The `DetourUtility`{{site.code.cs}} class is where the magic happens.

```csharp
using System;
using System.Linq.Expressions;
using System.Reflection;
using UnityEngine;

public static class DetourUtility
{
    /// <summary> Returns the get accessor MethodInfo obtained from a method call expression. </summary>
    public static MethodInfo MethodInfoForMethodCall(Expression<Action> methodCallExpression)
        => methodCallExpression.Body is MethodCallExpression { Method: var methodInfo }
            ? methodInfo
            : throw new($"Couldn't obtain MethodInfo for the method call expression: {methodCallExpression}");

    /// <summary> Returns the get accessor MethodInfo obtained from a property expression. </summary>
    public static MethodInfo MethodInfoForGetter<T>(Expression<Func<T>> propertyExpression)
        => propertyExpression.Body is MemberExpression { Member: PropertyInfo { GetMethod: var methodInfo } }
            ? methodInfo
            : throw new($"Couldn't obtain MethodInfo for the property get accessor expression: {propertyExpression}");

    /// <summary> Returns the set accessor MethodInfo obtained from a property expression. </summary>
    public static MethodInfo MethodInfoForSetter<T>(Expression<Func<T>> propertyExpression)
        => propertyExpression.Body is MemberExpression { Member: PropertyInfo { SetMethod: var methodInfo } }
            ? methodInfo
            : throw new($"Couldn't obtain MethodInfo for the property set accessor expression: {propertyExpression}");

    // this is based on an interesting technique from the RimWorld ComunityCoreLibrary project, originally credited to RawCode:
    // https://github.com/RimWorldCCLTeam/CommunityCoreLibrary/blob/master/DLL_Project/Classes/Static/Detours.cs
    // licensed under The Unlicense:
    // https://github.com/RimWorldCCLTeam/CommunityCoreLibrary/blob/master/LICENSE
    public static unsafe void TryDetourFromTo(MethodInfo src, MethodInfo dst)
    {
        try
        {
            if (IntPtr.Size == sizeof(Int64))
            {
                // 64-bit systems use 64-bit absolute address and jumps
                // 12 byte destructive

                // Get function pointers
                long srcBase = src.MethodHandle.GetFunctionPointer().ToInt64();
                long dstBase = dst.MethodHandle.GetFunctionPointer().ToInt64();

                // Native source address
                byte* pointerRawSource = (byte*)srcBase;

                // Pointer to insert jump address into native code
                long* pointerRawAddress = (long*)(pointerRawSource + 0x02);

                // Insert 64-bit absolute jump into native code (address in rax)
                // mov rax, immediate64
                // jmp [rax]
                *(pointerRawSource + 0x00) = 0x48;
                *(pointerRawSource + 0x01) = 0xB8;
                *pointerRawAddress = dstBase; // ( pointerRawSource + 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09 )
                *(pointerRawSource + 0x0A) = 0xFF;
                *(pointerRawSource + 0x0B) = 0xE0;
            }
            else
            {
                // 32-bit systems use 32-bit relative offset and jump
                // 5 byte destructive

                // Get function pointers
                int srcBase = src.MethodHandle.GetFunctionPointer().ToInt32();
                int dstBase = dst.MethodHandle.GetFunctionPointer().ToInt32();

                // Native source address
                byte* pointerRawSource = (byte*)srcBase;

                // Pointer to insert jump address into native code
                int* pointerRawAddress = (int*)(pointerRawSource + 1);

                // Jump offset (less instruction size)
                int offset = dstBase - srcBase - 5;

                // Insert 32-bit relative jump into native code
                *pointerRawSource = 0xE9;
                *pointerRawAddress = offset;
            }
        }
        catch (Exception ex)
        {
            Debug.LogError($"Unable to detour: {src?.Name ?? "null src"} -> {dst?.Name ?? "null dst"}\n{ex}");
            throw;
        }
    }
}
```

To use detours, simply call `DetourUtility.TryDetourFromTo`{{site.code.cs}} with two `MethodInfo`{{site.code.cs}} arguments.
The first one is the `MethodInfo`{{site.code.cs}} for the method that we're redirecting.
The second one is the `MethodInfo`{{site.code.cs}} for the method with our new implementation.

Both methods need to have *roughly* compatible signatures.
  * You can redirect an instance method to a static method by declaring the `this`{{site.code.cs}} parameter explicitly as the first argument.
    * This is similar to [creating open instance method delegates via reflection](https://docs.microsoft.com/en-us/dotnet/api/system.delegate.createdelegate?view=net-6.0#code-try-6).
  * You can substitute `class`{{site.code.cs}} parameters for their base types (all the way up to `object`{{site.code.cs}} - useful if you don't have access to the derived type, but the base is `public`{{site.code.cs}}).
  * You can replace value types with your own structs, as long as they are memory-compatible.
    * So basically, you are free to replace a `Vector3`{{site.code.cs}} with a `float3`{{site.code.cs}} (or even an `int3`{{site.code.cs}} - just make sure the structs have the same size in memory).
    * Works the same as [`System.Runtime.CompilerServices.Unsafe.As<TFrom, TTo>`{{site.code.cs}}](https://docs.microsoft.com/en-us/dotnet/api/system.runtime.compilerservices.unsafe.as?view=net-6.0) and [`reinterpret_cast`{{site.code.cs}}](https://en.cppreference.com/w/cpp/language/reinterpret_cast). Dangerously, that is.

To obtain the `MethodInfo`{{site.code.cs}}s, you can [use reflection](https://docs.microsoft.com/en-us/dotnet/api/system.type.getmethod?view=net-6.0) or the provided `DetourUtility.MethodInfoFor*`{{site.code.cs}} utilities.

## Patching static methods

Static methods are simple to handle. To make things interesting, let's completely ruin the implementation of `GameObject.FindGameObjectsWithTag`{{site.code.cs}}.

(Please, don't actually do this to your co-workers. This seemed like a good idea at the time, but it ended up breaking GameObject inspectors. You really can't underestimate the consequences.)

```csharp
/// <summary> Our replacement for the <see cref="GameObject.FindGameObjectsWithTag"/> method. </summary>
static GameObject[] ReplacementFindGameObjectsWithTag(string tag)
{
#if DEBUG
    Debug.LogError($"Using {nameof(GameObject.FindGameObjectsWithTag)} is forbidden because it allocates memory.");
#endif
    return Array.Empty<GameObject>();
}

static void PatchStaticMethod()
{
    // get the MethodInfo for the method we're trying to patch 
    // (when the API is public you can use the Expression-based helper; else, try reflection)
    var srcMethod
        = DetourUtility.MethodInfoForMethodCall(() => GameObject.FindGameObjectsWithTag(default));

    // get the MethodInfo for the replacement method
    var dstMethod
        = DetourUtility.MethodInfoForMethodCall(() => ReplacementFindGameObjectsWithTag(default));

    // patch the method function pointer
    DetourUtility.TryDetourFromTo(
        src: srcMethod,
        dst: dstMethod
    );

    // assert that the FindObjectsWithTag method now returns our fake value
    _ = new GameObject { tag = "test" };
    Assert.AreEqual(
        expected: Array.Empty<GameObject>(),
        actual: GameObject.FindGameObjectsWithTag("test")
    );
}
```

## Patching instance methods

To redirect the implementation of an instance method, you need to "pretend" it's a static method by declaring the `this`{{site.code.cs}} parameter explicitly as the first argument. The remaining parameters (if any) go afterwards.

For demonstration purposes, let's replace the `OnInspectorGUI()`{{site.code.cs}} method of the `Animator`{{site.code.cs}} component. 

```csharp
/// <summary>
/// Replacement for UnityEditor.AnimatorInspector.OnInspectorGUI().
/// </summary>
/// <remarks>
/// Note that we can use the base Editor class instead of the derived AnimatorInspector, since the class
/// is private and we don't have access to it here.
/// (You'll need to use reflection to access AnimatorInspector members, as well as private/protected members.)
/// The extension method syntax isn't strictly necessary here, but I think it somewhat helps with readability.
/// </remarks>
static void ReplacementAnimatorInspectorOnInspectorGUI(this UnityEditor.Editor editor)
{
    UnityEditor.EditorGUILayout.LabelField("IT LIVES!", UnityEditor.EditorStyles.boldLabel);
    UnityEditor.EditorGUILayout.LabelField($"Editor type: {editor.GetType().FullName}");
    UnityEditor.EditorGUILayout.LabelField($"Editor target: {editor.target.name}");
}

static void PatchInstanceMethod()
{
    // get the MethodInfo for the method we're trying to patch
    // (it is private, so we need to dig around w/ reflection)
    var srcMethod
        = Type.GetType("UnityEditor.AnimatorInspector,UnityEditor") // format: Namespace.Class+NestedClass,Assembly
            .GetMethod("OnInspectorGUI", Public | Instance); // make sure you use correct binding flags!

    // get the MethodInfo for the replacement method (set accessor)
    var dstMethod
        = DetourUtility.MethodInfoForMethodCall(() => ReplacementAnimatorInspectorOnInspectorGUI(null));

    // patch the method function pointer
    DetourUtility.TryDetourFromTo(
        src: srcMethod,
        dst: dstMethod
    );
    
    // now take a look at the Animator inspector...
}
```

![Screenshot of a patched Animator component inspector](assets/img/posts/detours-patched-animator.gif){:.pixel-perfect}

## Patching static property getters

To redirect the implementation of a get accessor, we need to obtain its `MethodInfo`{{site.code.cs}}. Via reflection, you'd need to go through the `PropertyInfo`{{site.code.cs}} first. The `DetourUtility.MethodInfoForGetter`{{site.code.cs}} utility makes things easier.

For example, we can redirect `Camera.main`{{site.code.cs}} to point at any camera we want.

```csharp
static Camera myFavoriteCamera;

/// <summary> Replacement for the <see cref="Camera.main"/> get accessor. </summary>
static Camera ReplacementCameraGetter()
    => myFavoriteCamera;

static void PatchGetter()
{
    // patch the method function pointer
    DetourUtility.TryDetourFromTo(
        src: DetourUtility.MethodInfoForGetter(() => Camera.main),
        dst: DetourUtility.MethodInfoForMethodCall(() => ReplacementCameraGetter())
    );

    // assert that the Camera.main getter now returns our fake value
    myFavoriteCamera = new GameObject("Nice").AddComponent<Camera>();
    Assert.AreEqual(
        expected: Camera.main,
        actual: myFavoriteCamera
    );

    // congrats! you broke unity!
    var actualMainCamera = GameObject.FindWithTag("MainCamera").GetComponent<Camera>();
    Debug.Log($"{Camera.main.name} == {myFavoriteCamera.name} != {actualMainCamera.name}"); 
}
```

![Screenshot of patched getter](assets/img/posts/detours-maincamera.gif){:.pixel-perfect}

## Patching static property setters

Patching set accessors works similarly.
You need to create a `void`{{site.code.cs}} method with a single parameter.

```csharp
static int setterBackingField;

/// <summary> Replacement for the <see cref="Time.captureFramerate"/> set accessor. </summary>
static void ReplacementSetter(int value)
    => setterBackingField = value;

static void PatchSetter()
{
    // patch the method function pointer
    DetourUtility.TryDetourFromTo(
        src: DetourUtility.MethodInfoForSetter(() => Time.captureFramerate),
        dst: DetourUtility.MethodInfoForMethodCall(() => ReplacementSetter(default))
    );

    // assert that the captureFramerate setter now writes to our backing field
    Time.captureFramerate = int.MinValue;
    Debug.Log($"{setterBackingField} == {int.MinValue}");
    Assert.AreEqual(
        expected: int.MinValue,
        actual: setterBackingField
    );
    
    Time.captureFramerate = 666;
    Debug.Log($"{setterBackingField} == {666}");
    Assert.AreEqual(
        expected: 666,
        actual: setterBackingField
    );
}
```

![Screenshot of patched setter](assets/img/posts/detours-propset.gif){:.pixel-perfect}

## Patching instance property accessors

This is done analogically to the [static properties](#patching-static-property-getters) and the [patching instance methods](#patching-instance-methods) examples - you need to provide the `this`{{site.code.cs}} parameter explicitly by adding it at the front of the parameter list.

```csharp
/// <summary> Our replacement for the <see cref="GameObject.tag"/> getter. </summary>
static string GetGameObjectTag(this GameObject gameObject)
    => throw new("Accessing gameObject.tag is forbidden because it allocates memory. Use CompareTag instead.");

/// <summary> Our replacement for the <see cref="GameObject.tag"/> setter. </summary>
static void SetGameObjectTag(this GameObject gameObject, string tag)
    => Debug.Log(tag);

public static void PatchInstanceProperties()
{
    DetourUtility.TryDetourFromTo(
        src: DetourUtility.MethodInfoForGetter(() => default(GameObject).tag),
        dst: DetourUtility.MethodInfoForMethodCall(() => GetGameObjectTag(default))
    );

    DetourUtility.TryDetourFromTo(
        src: DetourUtility.MethodInfoForSetter(() => default(GameObject).tag),
        dst: DetourUtility.MethodInfoForMethodCall(() => SetGameObjectTag(default, default))
    );

    var gameObject = new GameObject();

    // should log "nice" to console instead of tagging
    gameObject.tag = "nice";

    try
    {
        // should throw
        Debug.Log(gameObject.tag);
    }
    catch (Exception ex)
    {
        Debug.LogException(ex);
    }
}
```

![Screenshot of patched GameObject.tag method](assets/img/posts/detours-tags.gif){:.pixel-perfect}

## Patching extern methods/properties

Patching `extern`{{site.code.cs}} methods works just fine and is done analogically to [regular static methods](#patching-static-methods).

```csharp
/// <summary> Our replacement for <see cref="GameObject.Find"/>. </summary>
static GameObject CreateGameObject(string name) => new(name);

public static void PatchExternMethod()
{
    DetourUtility.TryDetourFromTo(
        src: DetourUtility.MethodInfoForMethodCall(() => GameObject.Find(default)),
        dst: DetourUtility.MethodInfoForMethodCall(() => CreateGameObject(default))
    );

    // GameObject.Find now creates a new GameObject.
    // i'm going to hell, ain't i?
    var gameObject = GameObject.Find("nice");
}
```

## Patching generic methods

Oh boy, we're in trouble territory now.

While technically this works, it looks like patching generic methods overwrites the implementation for *all* generic type arguments.
This is usually not what you want, so be extra careful.

```csharp
static MeshCollider CreateMeshCollider(this GameObject gameObject)
    => gameObject.AddComponent<MeshCollider>();

public static void PatchGenericMethod()
{
    // try redirecting GetComponent to our CreateMeshCollider method
    DetourUtility.TryDetourFromTo(
        src: DetourUtility.MethodInfoForMethodCall(() => default(GameObject).GetComponent<MeshCollider>()),
        dst: DetourUtility.MethodInfoForMethodCall(() => CreateMeshCollider(default))
    );

    var gameObject = new GameObject();

    // this works just fine...
    Debug.Log(gameObject.GetComponent<MeshCollider>());
    
    // ...except all of these methods got redirected as well!
    Debug.Log(gameObject.GetComponent<Collider>());
    Debug.Log(gameObject.GetComponent<SphereCollider>());
    Debug.Log(gameObject.GetComponent<Component>());
    Debug.Log(gameObject.GetComponent<Transform>());
}
```

![Screenshot of patched GetComponent method being funny](assets/img/posts/detours-ohno.gif "Oh god what have I done"){:.pixel-perfect}

# Todo
{:.no_toc.h4}

* Test `DetourUtility`{{site.code.cs}} on various platforms (Windows, Linux, Mac, Android, etc), both in Unity Editor and in build.
* Can we replace a method but maintain the ability to still call the original? (eg. to "wrap" it instead of patching it)
* Find more edge cases.