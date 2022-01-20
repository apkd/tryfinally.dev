---
layout: post
title: "Snippet: nicer Unity serialized fields"
excerpt: slim down your Unity components using this one weird trick
thumbtext: "[S]"
image: assets/img-min/cover/5tsvxCrFi_I.webp
categories: [unity-protips]
tags: [unity, csharp]
author: apkd
series: true
featured: false
hidden: false
license: cc-by
contributors: []
---

# Aliasing `[SerializeField]`{:.language-cs .highlight}

If you want to serialize stuff in Unity, you're going to either use public fields...

```cs
[Header("LookAt IK")]
public LayerMask lookAtLayerMask;
public float lookAtWeightSmooth = 0.1f;
public float lookAtEffectorSmooth = 0.1f;
public float lookAtEffectorMaxSpeed = 1.0f;
public float lookAtMaxAngle = 30f;
public float lookAtMaxDistance = 5.0f;
public float bodyVelocityScale = 0.3f;
[Header("Attack IK")]
public float lookAtAttackMaxWeight = 0.8f;
public float lookAtAttackSmoothUp = 0.1f;
public float lookAtAttackSmoothDown = 0.2f;
public float lookAtAttackEffectorSmooth = 0.5f;
```

...or slap [`[SerializeField]`{:.highlight.language-cs}](https://docs.unity3d.com/ScriptReference/SerializeField.html) on top of private fields. 

```cs
[Header("LookAt IK")]
[SerializeField] LayerMask lookAtLayerMask;
[SerializeField] float lookAtWeightSmooth = 0.1f;
[SerializeField] float lookAtEffectorSmooth = 0.1f;
[SerializeField] float lookAtEffectorMaxSpeed = 1.0f;
[SerializeField] float lookAtMaxAngle = 30f;
[SerializeField] float lookAtMaxDistance = 5.0f;
[SerializeField] float bodyVelocityScale = 0.3f;
[Header("Attack IK")]
[SerializeField] float lookAtAttackMaxWeight = 0.8f;
[SerializeField] float lookAtAttackSmoothUp = 0.1f;
[SerializeField] float lookAtAttackSmoothDown = 0.2f;
[SerializeField] float lookAtAttackEffectorSmooth = 0.5f;
```

What I like to do instead is:

`using S = UnityEngine.SerializeField;`{:.language-cs .highlight .h5}

I think this leads to more readable declarations and it lets me mark serialized fields explicitly.

```cs
[Header("LookAt IK")]
[S] LayerMask lookAtLayerMask;
[S] float lookAtWeightSmooth = 0.1f;
[S] float lookAtEffectorSmooth = 0.1f;
[S] float lookAtEffectorMaxSpeed = 1.0f;
[S] float lookAtMaxAngle = 30f;
[S] float lookAtMaxDistance = 5.0f;
[S] float bodyVelocityScale = 0.3f;
[Header("Attack IK")]
[S] float lookAtAttackMaxWeight = 0.8f;
[S] float lookAtAttackSmoothUp = 0.1f;
[S] float lookAtAttackSmoothDown = 0.2f;
[S] float lookAtAttackEffectorSmooth = 0.5f;
```

# Other fun aliases to try

## `using H = UnityEngine.HideInInspector;`{:.language-cs .highlight .h5}
I don't use this often, but it stacks nicely with `[S]`.

## `using Odin = Sirenix.OdinInspector;`{:.language-cs .highlight .h5}
Lets you avoid importing all of the 7 million Odin Inspector attributes.

## `using Object = UnityEngine.Object;`{:.language-cs .highlight .h5}
Since `System.Object` is already aliased as `object`, I don't think it's controversial to let Unity have this alias to resolve the conflict when importing the `UnityEngine` namespace.

## `using Debug = UnityEngine.Debug;`{:.language-cs .highlight .h5}
This one lets you avoid conflict with `FMOD.Debug`.

## `using static Unity.Mathematics.math;`{:.language-cs .highlight .h5}
This lets you use the Unity.Mathematics functions like it's HLSL.

## `using static System.StringComparison;`{:.language-cs .highlight .h5}
Importing enum members like this saves you some pointless typing and - arguably - improves readability, especially in [switch expressions](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/switch-expression) and the like.
