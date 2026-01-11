---
layout: post
title: "Pump Up The Volume: Writing custom Volume Components in Unity"
excerpt: "You can create custom Volume Components to find a blended set of parameters determined by the camera's position within the scene."
thumbtext: "VolumeComponent"
image: assets/img/social/zYD_XzNyRyo.webp
categories: [unity-protips]
tags: [unity, csharp, hdrp, urp]
author: apkd
series: true
featured: true
hidden: false
license: cc-by
contributors: []
---

# What are Volume Components?
{:.no_toc}

Volume Components are a way to extend the functionality of Unity's Volume Framework. They can be used with both the High Definition Render Pipeline (HDRP) and the Universal Render Pipeline (URP), as well as in custom Scriptable Render Pipelines (SRP).

* [HDRP documentation](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@16.0/manual/Volumes.html)
* [URP documentation](https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@16.0/manual/Volumes.html)

You can create custom Volume Components to find a blended set of parameters determined by the camera's position within the scene.
They're great for post-effects but can sometimes be useful for other purposes - even game mechanics.

* chapter 1
* chapter 2
* chapter 3
{:toc}

# Creating a Volume Component

## 1. Create a new script

### Inheriting from `VolumeComponent`{{site.code.cs}}

Start by creating a new script that inherits from the `VolumeComponent`{{site.code.cs}} class, which provides the necessary functionality to integrate with the volume framework.

```csharp
[VolumeComponentMenu("tryfinally.dev/" + nameof(MyPostProcessVolumeComponent))]
public sealed class MyVolumeComponent : VolumeComponent
{
    // your volume parameters go here
}
```

### Inheriting from `CustomPostProcessVolumeComponent`{{site.code.cs}} (HDRP)

In HDRP, you can instead inherit from `CustomPostProcessVolumeComponent`{{site.code.cs}} if you want to create a post-processing effect. This base class requires you to implement the `void Render`{{site.code.cs}} method, which is called by the volume framework when the volume is rendered. This lets us easily write a post-processing effect in a single class.

Implementing the `IPostProcessComponent`{{site.code.cs}} interface is *not* optional for some reason, so don't skip it. It lets you control whether the post process should be rendered or not via the `bool IPostProcessComponent.IsActive()`{{site.code.cs}} method.

Read more about this workflow in the [Creating a Custom Post-Process Effect](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@16.0/manual/Custom-Post-Process.html) docs page.

```csharp
[VolumeComponentMenu("tryfinally.dev/" + nameof(MyPostProcessVolumeComponent))]
public sealed class MyPostProcessVolumeComponent : CustomPostProcessVolumeComponent, IPostProcessComponent
{
    // your volume parameters go here

    /// <summary> Injection point of the custom post process in HDRP. </summary>
    public override CustomPostProcessInjectionPoint injectionPoint
        => CustomPostProcessInjectionPoint.AfterPostProcess;

    /// <summary> Tells if the post process needs to be rendered or not. </summary>
    bool IPostProcessComponent.IsActive() => true; // you can use volume parameters to control this

    /// <summary> Setup function, called once before render is called. </summary>
    public override void Setup() { }

    /// <summary> Cleanup function, called when the render pipeline is disposed. </summary>
    public override void Cleanup() { }

    /// <summary>
    /// Called every frame for each camera when the post process needs to be rendered.
    /// </summary>
    /// <param name="cmd">Command Buffer used to issue your commands</param>
    /// <param name="camera">Current Camera</param>
    /// <param name="source">Source Render Target, it contains the camera color buffer in it's current state</param>
    /// <param name="destination">Destination Render Target</param>
    public override void Render(CommandBuffer cmd, HDCamera camera, RTHandle source, RTHandle destination, RTHandle depthTexture)
        => cmd.Blit(source, destination); // (copy source to destination without any changes - your post process implementation goes here)
}
```

## 2. Add parameter fields

The volume framework offers a set of built-in parameter types for use in the editor. These give you a nice editor UI for your parameters and lets you use the volume framework's interpolation/override system.

> Make sure to always initialize the parameters using `new()`{{site.code.cs}}.
Do not rely on the serialization system to do this for you - Unity creates volume profile instances at runtime, and your fields will be `null`{{site.code.cs}} unless you explicitly initialize. (You'll want to do this to define the default value and the allowed value range anyway.)

```csharp
// floats
public FloatParameter MyFloat = new(value: 0f);
public ClampedFloatParameter MyClampedFloat = new(value: 0, min: -1, max: +1);
public MinFloatParameter MyMinFloat = new(value: 0, min: 0);
public MaxFloatParameter MyMaxFloat = new(value: 0, max: 0);

// ints
public IntParameter MyInt = new(value: 0);
public ClampedIntParameter MyClampedInt = new(value: 0, min: -1, max: +1);
public MinIntParameter MyMinInt = new(value: 0, min: 0);
public MaxIntParameter MyMaxInt = new(value: 0, max: 0);

// other common primitives/structs
public BoolParameter MyBool = new(value: false);
public Vector2Parameter MyVector2 = new(value: Vector2.zero);
public Vector3Parameter MyVector3 = new(value: Vector3.zero);
public Vector4Parameter MyVector4 = new(value: Vector4.zero);
public ColorParameter MyColor = new(value: Color.white);
public LayerMaskParameter MyLayerMask = new(value: 0);
public AnimationCurveParameter MyAnimationCurve = new(value: null);

// nointerp variants - these simply take the value from the volume with highest weight instead of interpolating
// (roughly equivalent to using VolumeParameter<T> directly)
public NoInterpFloatParameter MyNoInterpFloat = new(value: 0f);
public NoInterpClampedFloatParameter MyNoInterpClampedFloat = new(value: 0, min: -1, max: +1);
public NoInterpMinFloatParameter MyNoInterpMinFloat = new(value: 0, min: 0);
public NoInterpMaxFloatParameter MyNoInterpMaxFloat = new(value: 0, max: 0);
public NoInterpIntParameter MyNoInterpInt = new(value: 0);
public NoInterpClampedIntParameter MyNoInterpClampedInt = new(value: 0, min: -1, max: +1);
public NoInterpMinIntParameter MyNoInterpMinInt = new(value: 0, min: 0);
public NoInterpMaxIntParameter MyNoInterpMaxInt = new(value: 0, max: 0);
public NoInterpVector2Parameter MyNoInterpVector2 = new(value: Vector2.zero);
public NoInterpVector3Parameter MyNoInterpVector3 = new(value: Vector3.zero);
public NoInterpVector4Parameter MyNoInterpVector4 = new(value: Vector4.zero);
public NoInterpColorParameter MyNoInterpColor = new(value: Color.white);

// unity objects. these don't support interpolation
// (currently, at least - judging by the TODOs in code, this may change in the future)
public TextureParameter MyTexture = new(value: null);
public Texture2DParameter MyTexture2D = new(value: null);
public Texture3DParameter MyTexture3D = new(value: null);
public RenderTextureParameter MyRenderTexture = new(value: null);
public CubemapParameter MyCubemap = new(value: null);
```

You can easily make your own reusable parameter types by inheriting from the `VolumeParameter<T>`{{site.code.cs}} class.

```csharp
[Serializable, VolumeComponentMenu("tryfinally.dev/" + nameof(float3))]
public sealed class Float3Parameter : VolumeParameter<float3>
{
    public Float3Parameter(float3 value, bool overrideState = false)
        : base(value, overrideState) { }

    /// <summary> Defines the interpolation function to use when blending between values. </summary>
    /// <param name="from">The value to interpolate from.</param>
    /// <param name="to">The value to interpolate to.</param>
    /// <param name="t">The interpolation factor.</param>
    public override void Interp(float3 from, float3 to, float t)
        => math.lerp(from, to, t);
}
```

However, if you just to define a quick non-interpolated parameter for some simple type, you can use the `VolumeParameter<T>`{{site.code.cs}} class directly:

```csharp
public VolumeParameter<LightLayerEnum> LightLayers
    = new() { value = LightLayerEnum.LightLayerDefault };
```

## 3. Use the volume component

To use volume components, you need to set up a volume profile and add it to your scene.
You can do this by creating a new volume profile asset, and adding it to your scene via the `Volume`{{site.code.cs}} component.
Some volume components are convenient to set up globally, while others are more useful when they affect only a specific area of the scene.

In either case, the volume framework calculates a single interpolated volume component for each camera in the scene.

### Based on `VolumeComponent`{{site.code.cs}}

#### HDRP

The simplest option is to grab the volume component from the camera and use your parameters in another script like so:

```csharp
// get the volume component for main camera
// (this returns a runtime instance of the volume component that already contains interpolated values)
var component = HDCamera
    .GetOrCreate(Camera.main)
    .volumeStack
    .GetComponent<MyVolumeComponent>();

// do something with the parameter values
Debug.Log(component.MyFloat.value);
```

#### URP

The Universal Render Pipeline has a slightly different API for accessing the volume stack:

```csharp
var component = camera
    .GetComponent<UniversalAdditionalCameraData>()
    .volumeStack
    .GetComponent<MyVolumeComponent>();
```

### Based on `VolumeComponent`{{site.code.cs}} with a custom updater script

The above option is moderately convenient in the long run, so I wrote a quick helper script that updates all volume components. All you have to do is implement the convenient `IUpdatableVolumeComponent`{{site.code.cs}} interface. Subsequent examples will use this approach for brevity.

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Rendering;
using static System.Reflection.BindingFlags;

/// <summary> An interface for volume components that can be updated. </summary>
interface IUpdatableVolumeComponent
{
    /// <summary> Called every frame to update the volume component. </summary>
    void Update();
    
    /// <summary> Indicates whether the component should be updated in edit mode. </summary>
    bool ExecuteInEditMode => true;
}

/// <summary>
/// Updates volume components that implement <see cref="IUpdatableVolumeComponent"/>.
/// Make sure there's a single instance of this component somewhere in the scene, eg. on the main camera.
/// </summary>
[ExecuteAlways]
public sealed class VolumeComponentUpdater : MonoBehaviour
{
    VolumeStack previousStack;
    Dictionary<Type, VolumeComponent> cachedVolumeStackComponents;

    void LateUpdate() // executes after gameplay/animation update, but before rendering
    {
        // this is fast now!
        // https://blog.unity.com/technology/new-performance-improvements-in-unity-2020-2
        var camera = Camera.main;

        if (!camera)
            return;

        // in HDRP, get the VolumeStack from the HDCamera associated with the main camera
        var stack = UnityEngine.Rendering.HighDefinition.HDCamera
            .GetOrCreate(camera)
            .volumeStack;
            
        // in URP, obtain the VolumeStack from the UniversalAdditionalCameraData instead
        /*
        var stack = camera
            .GetComponent<UnityEngine.Rendering.Universal.UniversalAdditionalCameraData>()
            .volumeStack;
        */

        if (stack == null)
            return;

        // invalidate cache if stack changed
        if (stack != previousStack)
            cachedVolumeStackComponents = null;

        previousStack = stack;

        // get components from the VolumeStack using reflection because the API is private :(
        // we cache the result to avoid doing this every frame
        // (note: this is not future-proof and is likely to break in future versions of Unity)
        cachedVolumeStackComponents ??= typeof(VolumeStack)
            .GetField("components", NonPublic | Instance)
            .GetValue(stack) as Dictionary<Type, VolumeComponent>;

        // update components that implement IUpdatableVolumeComponent
        foreach (var component in cachedVolumeStackComponents.Values)
            if (component is IUpdatableVolumeComponent updatable)
                if (updatable.ExecuteInEditMode || Application.isPlaying)
                    updatable.Update();
    }
}
```

### Based on `CustomPostProcessVolumeComponent`{{site.code.cs}} (HDRP)

If you're using the `CustomPostProcessVolumeComponent`{{site.code.cs}} base class, you just [set it up in your HDRP Global Settings](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@16.0/manual/Custom-Post-Process.html), configure your volume, and your effect should be rendered automatically.
However, this is not very performant if you're not actually doing any post-process rendering, because the `void Render`{{site.code.cs}} method requires you to at least copy the `source`{{site.code.cs}} texture to the `destination`{{site.code.cs}}.

# Usage ideas

***Although post-processing effects are awesome, they merely scratch the surface of what's possible with volume components.***
I've found that in practice, in many projects it can be very convenient to control some (global or per-camera) runtime values based on the camera position. Here's some examples.

## Global shader properties

This is probably the most common use case.
You can use a volume component to set global shader property values.
For example, you can use it to set wind direction and strength for your vegetation shaders.
Or you could use volumes to create biomes and use a volume component to locally set the shader property values for each biome (vegetation color, wind strength, weather settings, etc).
You easily can change/animate the values at runtime by adjusting volume weights.

> **This is super convenient for escaping material hell!!**
> You can use the same shader and material for all your objects, and tweak their look in each scene separately via global volumes.

```csharp
/// <summary> A volume component for setting global shader properties. </summary>
[VolumeComponentMenu("tryfinally.dev/" + nameof(GlobalShaderPropertiesVolumeComponent))]
public sealed class GlobalShaderPropertiesVolumeComponent : VolumeComponent, IUpdatableVolumeComponent
{
    public ColorParameter VegetationColor = new(value: Color.green);
    public ClampedFloatParameter RainStrength = new(value: 0f, min: 0f, max: 1f);
    public ClampedFloatParameter SnowAmount = new(value: 0f, min: 0f, max: 1f);
    public FloatParameter WindStrength = new(value: 0f);
    public Vector3Parameter WindDirection = new(value: Vector3.zero);

    void IUpdatableVolumeComponent.Update()
    {
        Shader.SetGlobalColor("_VegetationColor", VegetationColor.value);
        Shader.SetGlobalFloat("_RainStrength", RainStrength.value);
        Shader.SetGlobalFloat("_SnowAmount", SnowAmount.value);
        Shader.SetGlobalFloat("_WindStrength", WindStrength.value);
        Shader.SetGlobalVector("_WindDirection", WindDirection.value.normalized);
    }
}
```

## Camera modifiers

(This example uses Cinemachine, but you can use any camera system you like.)

You can use volume components to modify the behaviour of your Cinemachine cameras.
For example, you can create a volume component that modifies the camera's field of view based on the camera's position in the scene.
This way, you can make the camera zoom in when the player is in a tight space, or zoom out when the player is in an open area.
It's possible that you already have volumes in your scene that you can reuse for this purpose.

This component only stores the field of view value,   and the actual modification is done in a Cinemachine extension.


```csharp
/// <summary> A volume component that drives modifications to the state of a cinemachine camera. </summary>
[VolumeComponentMenu("tryfinally.dev/" + nameof(CinemachineModifierVolumeComponent))]
public sealed class CinemachineModifierVolumeComponent : VolumeComponent
{
    [Tooltip("The FoV offset to apply to the camera")]
    public ClampedFloatParameter FieldOfView
        = new(value: 0, min: -30, max: +30);
}
```

In this example, we use the `PostPipelineStageCallback`{{site.code.cs}} to modify the FOV in the final stage of the pipeline.

> Cinemachine adopts a semi-functional technique, recomputing the camera state for each frame according to the camera pipeline.
> Extensions can intervene at different stages of the pipeline to alter the camera state calculation.
> Finally, the `CinemachineBrain`{{site.code.cs}} applies the result state to the `UnityEngine.Camera`{{site.code.cs}} responsible for rendering.

```csharp
/// <summary>
/// Modifies the field of view of a cinemachine camera.
/// Add this component to your virtual camera to affect it via the volume framework.
/// See: https://docs.unity3d.com/Packages/com.unity.cinemachine@2.9/manual/CinemachineVirtualCameraExtensions.html
/// </summary>
public sealed class CinemachineModifierExtension : CinemachineExtension
{
    protected override void PostPipelineStageCallback(
        CinemachineVirtualCameraBase vcam, // the virtual camera this extension belongs to
        CinemachineCore.Stage stage,       // the current pipeline stage
        ref CameraState state,             // the current camera state
        float deltaTime)
    {
        // apply modifications in last stage after other camera properties have been calculated
        // (you might want to use an earlier stage if you want to modify other parameters, eg. camera position)
        if (stage is not CinemachineCore.Stage.Noise)
            return;

        // get the interpolated volume component from the volume stack 
        var component = HDCamera
            .GetOrCreate(Camera.main)
            .volumeStack
            .GetComponent<CinemachineModifierVolumeComponent>();

        // the camera state is recalculated from scratch every frame by the Cinemachine pipeline,
        // so we can safely apply the offset directly
        state.Lens.FieldOfView += component.FieldOfView.value;
    }
}
```

Ideas for other camera parameters that can be useful to control via volumes:
- Lens settings (e.g. focal length, aperture, focus distance, etc)
- Noise/shake settings
- Position and rotation offset

## Directional light

You can use a volume component to spawn and control a sun in your scene.
Handling the sun as a scene object can be cumbersome.
Since many settings are in volume profiles, it's helpful to put sun settings there too.
This makes it easy to share lighting between scenes, switch between sun options, and keep changes when leaving play mode.

> Usually you'll want to define a global volume so that the sun is constant throughout the scene, but you can also use a local volume to modify the light parameters in a specific area.[^0]
> This example is HDRP-specific, but you should be able to adapt it to URP with little problem.

[^0]: Don't laugh. Make your game for long enough and you'll need this hack eventually.

```csharp
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.HighDefinition;

/// <summary> A volume component for spawning and controlling a sun in the scene. </summary>
[VolumeComponentMenu("tryfinally.dev/" + nameof(SunVolumeComponent))]
public sealed class SunVolumeComponent : VolumeComponent, IUpdatableVolumeComponent
{
    [Tooltip("The light layers the light should affect")]
    public VolumeParameter<LightLayerEnum> LightLayers = new() { value = LightLayerEnum.LightLayerDefault };

    [Tooltip("The intensity of the sun")]
    public ClampedFloatParameter Intensity = new(value: 80_000, min: 0, max: 150_000);

    [Tooltip("The temperature of the sun (in Kelvin)")]
    public ClampedFloatParameter Temperature = new(value: 6_500, min: 1_000, max: 20_000);

    [Tooltip("The color of the sun")]
    public ColorParameter Color = new(value: UnityEngine.Color.white);

    [Tooltip("The direction of the sun (euler angles)")]
    public Vector2Parameter Direction = new(value: new(45, 45)); // could use better interpolation

    [Tooltip("Angular diameter of the sun as seen from the camera (in degrees)")]
    public ClampedFloatParameter AngularDiameter = new(value: 0.5f, min: 0, max: 4);
    
    [Tooltip("The multiplier for volumetric lighting")]
    public ClampedFloatParameter VolumetricDimmer = new(value: 1, min: 0, max: 16);

    [Tooltip("The shadow resolution quality level of the sun")]
    public ClampedIntParameter ShadowResolution = new(value: 3, min: 0, max: 3);
    
    [Tooltip("Whether or not to use contact shadows")]
    public BoolParameter ContactShadows = new(value: true);

    GameObject gameObject;
    Light light;
    HDAdditionalLightData hdlight;

    void IUpdatableVolumeComponent.Update()
    {
        if (!gameObject)
        {
            gameObject = new("Sun") { hideFlags = HideFlags.DontSave | HideFlags.NotEditable };
            light = gameObject.AddComponent<Light>();
            hdlight = gameObject.AddComponent<HDAdditionalLightData>();

            hdlight.EnableShadows(true);
            hdlight.SetLightTypeAndShape(HDLightTypeAndShape.Directional);
            hdlight.shadowUpdateMode = ShadowUpdateMode.EveryFrame;
        }

        gameObject.transform.rotation = Quaternion.Euler(Direction.value);
        light.colorTemperature = Temperature.value;
        hdlight.lightlayersMask = LightLayers.value;
        hdlight.SetShadowResolutionOverride(false);
        hdlight.SetShadowResolutionLevel(ShadowResolution.value);
        hdlight.EnableColorTemperature(Temperature.overrideState);
        hdlight.color = Color.value;
        hdlight.intensity = Intensity.value;
        hdlight.volumetricDimmer = VolumetricDimmer.value;
        hdlight.angularDiameter = AngularDiameter.value;
        hdlight.useContactShadow.useOverride = true;
        hdlight.useContactShadow.@override = ContactShadows.value;
    }

    protected override void OnDisable()
    {
        base.OnDisable();
        CoreUtils.Destroy(gameObject);
    }
}
```

## Time control

Using a volume component, you can create a slow-motion effect that slows down the game when the camera is within a specific area.
This would make most sense in an FPS game (like most gameplay-related ideas in this article).

Is this useful? Is this crazy? No idea, but it's a fun example so let's do it anyway.[^1]

[^1]: Just make sure your camera's position is not determined in a time-scale dependent way! This could lead to some weird behaviour (eg. the camera will get stuck when the time scale is 0).

```csharp
/// <summary> A volume component for modifying the time scale of the game. </summary>
[VolumeComponentMenu("tryfinally.dev/" + nameof(TimeScaleVolumeComponent))]
public sealed class TimeScaleVolumeComponent : VolumeComponent, IUpdatableVolumeComponent
{
    [Tooltip("The time scale to apply to the game")]
    public ClampedFloatParameter TimeScale
        = new(value: 1f, min: 0, max: 2); // important: the default value is applied when outside of all volumes

    void IUpdatableVolumeComponent.Update()
        => Time.timeScale = TimeScale.value;
        
    bool IUpdatableVolumeComponent.ExecuteInEditMode
        => false;
}
```

## Other gameplay-related ideas

- You can use a volume component to set audio settings.
  - Play FMOD snapshots and modify their weights based on the camera position.
  - Play different music and ambience based on the camera position.
  - Adjust global sound parameters, eg. reverb.
- You can change gravity (and other gameplay parameters) based on the camera's position in the scene.
- You can change graphics settings based on the camera's position in the scene, to optimize performance in certain areas.