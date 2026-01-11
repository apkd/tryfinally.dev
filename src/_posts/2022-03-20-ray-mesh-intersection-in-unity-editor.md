---
layout: post
title: "Ray-mesh intersection in Unity Editor"
excerpt: "Unity has a built-in `IntersectRayMesh` function, but it's internal and editor-only... here's how you use it."
thumbtext: "IntersectRayMesh"
image: assets/img/social/VOigE30bMhg.webp
categories: ["unity-protips"]
tags: [csharp, unity]
author: apkd
series: true
featured: false
hidden: false
license: cc-by
contributors: []
---

Computing precise mesh intersections is usually prohibitively expensive at runtime[^0], but it's still useful for editor scripts and the like.
 Unity has a built in function for raycasting against a mesh:

[^0]: If you want to do raycasts at runtime, you'll want to use simplified collision meshes or approximate your object's shape using several primitive colliders. Using high-poly mesh colliders will murder your physics engine.

[`UnityEditor.HandleUtility.IntersectRayMesh`{: .language-cs .highlight .h3 }](https://github.com/Unity-Technologies/UnityCsReference/blob/4a277091cc6a007ed91e686e7379e7e62d20cd4f/Editor/Mono/HandleUtility.bindings.cs#L33)

Now, if you excuse the fact that it is

- **editor-only**[^1]
- internal 
- unsupported
- could move
  - or change
  - or break
  - or disappear 
in any engine update, here's how you conveniently use it:

[^1]: This trick won't work at runtime (in player builds). <br> The code compiles even in [`Assembly-CSharp`](https://docs.unity3d.com/Manual/ScriptCompilationAssemblyDefinitionFiles.html), but you might wanna put this whole thing in `Assembly-CSharp-Editor` or somewhere instead

```csharp
using UnityEngine;
using static System.Reflection.BindingFlags;

public static class MeshFilterExtensions
{
    public static RaycastHit? IntersectRayMesh(this MeshFilter meshFilter, in Ray ray)
        => intersectRayMeshFunc(ray, meshFilter.sharedMesh, meshFilter.transform.localToWorldMatrix, out var result) ? result : null;

    delegate bool IntersectRayMeshDelegate(Ray ray, Mesh mesh, Matrix4x4 matrix, out RaycastHit hit);

    static readonly IntersectRayMeshDelegate intersectRayMeshFunc
        =
#if UNITY_EDITOR
        (IntersectRayMeshDelegate)
        typeof(UnityEditor.HandleUtility)
            .GetMethod("IntersectRayMesh", Static | NonPublic)
            .CreateDelegate(typeof(IntersectRayMeshDelegate));
#else
            null;
#endif
}
```

```csharp
var ray = new Ray(/* ... */);

if (GetComponent<MeshFilter>().IntersectRayMesh(ray) is { distance: < 1f } hit)
    Debug.Log(hit.collider);
```

![raycasted teapot](assets/img/posts/teapot.gif "img credit: Chris Tralie COS 426 Assignment #3"){:.pixel-perfect}
{:.mb-0}
<noscript>
    <a href="https://www.ctralie.com/PrincetonUGRAD/Projects/COS426/Assignment3/part1.html">img credit: Chris Tralie COS 426 Assignment #3</a>
</noscript>