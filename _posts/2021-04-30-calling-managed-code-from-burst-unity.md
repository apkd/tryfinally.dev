---
layout: post
title: Calling managed code from Burst
excerpt: find out how to call Mono code from Burst-compiled jobs and functions
thumbtext: "Burst ➟ Mono"
image: assets/img-min/cover/xDsaGQJumBY.webp
categories: []
tags: [unity, csharp, dots]
author: apkd
series: false
featured: false
hidden: false
license: cc-by
contributors: []
---

Here's a useful trick for when you're way too deep in the Burst rabbit hole.

* chapter 1
* chapter 2
* chapter 3
{:toc}

Unless you have the luxury of taking the time to (re)write your entire project with the Job System and Burst in mind, you might end up stuck in a Burst context, but needing to call a managed method. **Yes, you're reading correctly. I'm talking about calling Mono code from Burst, not the other way around.**

Maybe you have some managed code that you can't easily rewrite for some reason.
Maybe it's part of a plugin that you'd rather not touch, or stuck in some cursed `.dll`.
Or it could be a Unity function that doesn't support Burst at all.

Thankfully, a lot of the `UnityEngine.Physics`{:.language-cs .highlight} API methods work with Burst out-of-the-box.
Unfortunately, there's a few exceptions that require workarounds.
In the example below, we'll use `Physics.ComputePenetration`{:.language-cs .highlight} which is extremely useful when working with PhysX colliders.

The method signature looks like this:

```cs
public static bool ComputePenetration(
    Collider colliderA, // ono a collider
    Vector3 positionA,
    Quaternion rotationA,
    Collider colliderB, // onooo another one
    Vector3 positionB,
    Quaternion rotationB,
    out Vector3 direction,
    out float distance
);
```

As you can see, it takes managed colliders as arguments, so it definitely won't work directly with Burst.
We can, however, create a function pointer to a wrapper method, and use a workaround for passing the collider arguments.
It's kinda like the opposite of [Burst-compiled function pointers](https://docs.unity3d.com/Packages/com.unity.burst@1.7/manual/docs/AdvancedUsages.html#function-pointers).

> Note that we'll only be able to get this example to work with Burst-compiled functions, not the Job System.[^0]
> Jobs are limited to using only thread-safe Unity APIs, of which there's very few.

# Referencing `UnityEngine.Object`{:.language-cs .highlight}s in a Burst context

Unfortunately, there is no way to use Unity objects[^1] with Burst directly.
As a workaround, I suggest using InstanceIDs. These are non-deterministic, so definitely don't store them anywhere, but they're sufficient for
indirectly identifying a specific object (of any type inheriting from `UnityEngine.Object`{:.language-cs .highlight}) for the duration of its lifetime.

Getting an object's InstanceID is easy:

`int id = collider.GetInstanceID();`{:.language-cs .highlight .h5}

However, for some reason, there's no built-in way to get the object back based on its InstanceID in the *public* Unity API - instead, I'm using reflection to expose an internal `UnityEngine.Object`{:.language-cs .highlight} method. 
A more stable/responsive/responsible implementation could map objects to IDs using a dictionary, or something.

```cs
static class UnityEngineObjectUtility
{
    /// delegate based on an internal method in UnityEngine.Object: <see cref="UnityEngine.Object.FindObjectFromInstanceID"/>
    static readonly Func<int, UnityEngine.Object> findObjectFromInstanceId
        = (Func<int, UnityEngine.Object>)
        typeof(UnityEngine.Object)
            .GetMethod("FindObjectFromInstanceID", BindingFlags.NonPublic | BindingFlags.Static)
            .CreateDelegate(typeof(Func<int, UnityEngine.Object>));

    /// <summary> Get object instance based on its instance ID. See also: <see cref="UnityEngine.Object.GetInstanceID"/> </summary>
    public static TObject FindObjectFromInstanceID<TObject>(int instanceId) where TObject : UnityEngine.Object
        => findObjectFromInstanceId.Invoke(instanceId) as TObject;
}
```

# Behold, boilerplate

```cs
sealed class ComputePenetrationBurstCompatible
{
    // the function pointer
    // this is where the pointer to the managed function is stored in a way accessible to burst.
    static readonly SharedStatic<FunctionPointer<ComputePenetrationDelegate>> SharedStaticFunctionPointer
        = SharedStatic<FunctionPointer<ComputePenetrationDelegate>>.GetOrCreate<ComputePenetrationBurstCompatible>();

    // delegate type of the function pointer
    // can't use System.Func/Action
    delegate void ComputePenetrationDelegate(
        int colliderA,
        int colliderB,
        in Vector3 positionA,
        in Vector3 positionB,
        in Quaternion rotationA,
        in Quaternion rotationB,
        out Vector3 direction,
        out float distance
    );

    /// <summary>
    /// Burst-compatible wrapper for <see cref="Physics.ComputePenetration"/>.
    /// Computes the minimal translation required to separate the given colliders apart at specified poses.
    /// </summary>
    public static void ComputePenetration(
        int colliderA,
        int colliderB,
        in Vector3 positionA,
        in Vector3 positionB,
        in Quaternion rotationA,
        in Quaternion rotationB,
        out Vector3 direction,
        out float distance)
        => SharedStaticFunctionPointer.Data
            .Invoke(colliderA, colliderB, positionA, positionB, rotationA, rotationB, out direction, out distance);

    // initialization method that sets up the function pointer
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterAssembliesLoaded)]
    static void AfterAssembliesLoaded()
        => SharedStaticFunctionPointer.Data
            = new FunctionPointer<ComputePenetrationDelegate>(
                ptr: Marshal.GetFunctionPointerForDelegate((ComputePenetrationDelegate) ComputePenetrationManagedImpl)
            );

    // the managed method we're invoking through the function pointer
    // you can use all managed C# features here
    [AOT.MonoPInvokeCallback(typeof(ComputePenetrationDelegate))]
    static void ComputePenetrationManagedImpl(
        int colliderA,
        int colliderB,
        in Vector3 positionA,
        in Vector3 positionB,
        in Quaternion rotationA,
        in Quaternion rotationB,
        out Vector3 direction,
        out float distance)
        => Physics.ComputePenetration(
            colliderA: UnityEngineObjectUtility.FindObjectFromInstanceID<Collider>(colliderA),
            colliderB: UnityEngineObjectUtility.FindObjectFromInstanceID<Collider>(colliderB),
            positionA: positionA,
            positionB: positionB,
            rotationA: rotationA,
            rotationB: rotationB,
            direction: out direction,
            distance: out distance
        );
}
```
# Putting it all together

```cs
using System;
using System.Reflection;
using System.Runtime.InteropServices;
using Unity.Burst;
using UnityEngine;

static class UnityEngineObjectUtility
{
    /// delegate based on an internal method in UnityEngine.Object: <see cref="UnityEngine.Object.FindObjectFromInstanceID"/>
    static readonly Func<int, UnityEngine.Object> findObjectFromInstanceId
        = (Func<int, UnityEngine.Object>)
        typeof(UnityEngine.Object)
            .GetMethod("FindObjectFromInstanceID", BindingFlags.NonPublic | BindingFlags.Static)
            .CreateDelegate(typeof(Func<int, UnityEngine.Object>));

    /// <summary> Get object instance based on its instance ID. See also: <see cref="UnityEngine.Object.GetInstanceID"/> </summary>
    public static TObject FindObjectFromInstanceID<TObject>(int instanceId) where TObject : UnityEngine.Object
        => findObjectFromInstanceId.Invoke(instanceId) as TObject;
}

sealed class ComputePenetrationBurstCompatible
{
    // the function pointer
    static readonly SharedStatic<FunctionPointer<ComputePenetrationDelegate>> SharedStaticFunctionPointer
        = SharedStatic<FunctionPointer<ComputePenetrationDelegate>>.GetOrCreate<ComputePenetrationBurstCompatible>();

    // delegate type of the function pointer
    delegate void ComputePenetrationDelegate(
        int colliderA,
        int colliderB,
        in Vector3 positionA,
        in Vector3 positionB,
        in Quaternion rotationA,
        in Quaternion rotationB,
        out Vector3 direction,
        out float distance
    );

    /// <summary>
    /// Burst-compatible wrapper for <see cref="Physics.ComputePenetration"/>.
    /// Computes the minimal translation required to separate the given colliders apart at specified poses.
    /// </summary>
    /// <param name="colliderA">Instance ID of the first collider.</param>
    /// <param name="colliderB">Instance ID of the second collider.</param>
    /// <param name="positionA">Position of the first collider.</param>
    /// <param name="positionB">Position of the second collider.</param>
    /// <param name="rotationA">Rotation of the first collider</param>
    /// <param name="rotationB">Rotation of the second collider.</param>
    /// <param name="direction">Direction along which the translation required to separate the colliders apart is minimal.</param>
    /// <param name="distance">The distance along direction that is required to separate the colliders apart.</param>
    public static void ComputePenetration(
        int colliderA,
        int colliderB,
        in Vector3 positionA,
        in Vector3 positionB,
        in Quaternion rotationA,
        in Quaternion rotationB,
        out Vector3 direction,
        out float distance)
        => SharedStaticFunctionPointer.Data
            .Invoke(colliderA, colliderB, positionA, positionB, rotationA, rotationB, out direction, out distance);

    // initialization method that sets up the function pointer
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterAssembliesLoaded)]
    static void AfterAssembliesLoaded()
        => SharedStaticFunctionPointer.Data
            = new FunctionPointer<ComputePenetrationDelegate>(
                ptr: Marshal.GetFunctionPointerForDelegate((ComputePenetrationDelegate) ComputePenetrationManagedImpl)
            );

    // the managed method we're invoking through the function pointer
    // (you can use good old C# here)
    [AOT.MonoPInvokeCallback(typeof(ComputePenetrationDelegate))]
    static void ComputePenetrationManagedImpl(
        int colliderA,
        int colliderB,
        in Vector3 positionA,
        in Vector3 positionB,
        in Quaternion rotationA,
        in Quaternion rotationB,
        out Vector3 direction,
        out float distance)
        => Physics.ComputePenetration(
            colliderA: UnityEngineObjectUtility.FindObjectFromInstanceID<Collider>(colliderA),
            colliderB: UnityEngineObjectUtility.FindObjectFromInstanceID<Collider>(colliderB),
            positionA: positionA,
            positionB: positionB,
            rotationA: rotationA,
            rotationB: rotationB,
            direction: out direction,
            distance: out distance
        );
}

[BurstCompile]
sealed class UsingManagedFunctionsInBurstCompiledCodeExample : MonoBehaviour
{
    public Collider ColliderA;
    public Collider ColliderB;

    public Vector3 Direction;
    public float Distance;

    void Update()
    {
        // call the example burst-compiled method
        ComputePenetrationUsageExample(
            colliderA: ColliderA.GetInstanceID(),
            colliderB: ColliderB.GetInstanceID(),
            positionA: ColliderA.transform.position,
            positionB: ColliderB.transform.position,
            rotationA: ColliderA.transform.rotation,
            rotationB: ColliderB.transform.rotation,
            direction: out Direction,
            distance: out Distance
        );
    }

    [BurstCompile]
    static void ComputePenetrationUsageExample(int colliderA,
        int colliderB,
        in Vector3 positionA,
        in Vector3 positionB,
        in Quaternion rotationA,
        in Quaternion rotationB,
        out Vector3 direction,
        out float distance)
    {
        // this method is compiled by burst
        // normally we wouldn't be able to use managed code here, but this wrapped method works:
        ComputePenetrationBurstCompatible
            .ComputePenetration(colliderA, colliderB, positionA, positionB, rotationA, rotationB, out direction, out distance);
    }
}
```

[^0]: Unfortunately, jobs running on the main thread (eg. using `job.Run()`{:.language-cs .highlight}) are also excluded from using Unity APIs, just like a worker thread would be.
[^1]: GameObjects, MonoBehaviours, ScriptableObjects, built-in components... anything that inherits from `UnityEngine.Object`{:.language-cs .highlight} is incompatible with Burst (at least without a workaround).
