---
layout: post
title: "Notifying Unity about texture modifications"
excerpt: "Use `Texture.IncrementUpdateCount()` to let Unity know that a texture has changed"
thumbtext: "IncrementUpdateCount"
image: assets/img/social/yn97LNy0bao.webp
categories: [unity-protips]
tags: [unity, csharp]
author: apkd
series: true
featured: false
hidden: false
license: cc-by
contributors: []
---

When you modify a Texture directly on the GPU side (eg. via Compute Shaders), Unity has no way of knowing that the texture has changed. This can break some things if you assign the texture as a [density volume mask](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@7.1/api/UnityEngine.Rendering.HighDefinition.DensityVolumeArtistParameters.html#UnityEngine_Rendering_HighDefinition_DensityVolumeArtistParameters_volumeMask), a [light cookie texture](https://docs.unity3d.com/ScriptReference/Light-cookie.html), etc.

I first stumbled upon [`Texture.imageContentsHash`{{site.code.cs}}](https://docs.unity3d.com/ScriptReference/Texture-imageContentsHash.html), but don't actually use that - confusingly enough, it's an editor-only property and doesn't even exist in `UnityEngine.dll` in builds.

What you actually want is:

> [`Texture.IncrementUpdateCount`{{site.code.cs}}](https://docs.unity3d.com/ScriptReference/Texture.IncrementUpdateCount.html){:.h5.mb-0}  
> Increment the update counter.  
> Call this method when you update a Texture from the GPU side, or you want to explicitly increment the counter.

Simply call the method on the texture and - if you're lucky - Unity will notice that the texture has changed.

```csharp
// bump the texture version
texture.IncrementUpdateCount();
```