---
layout: post
title: "Forcing Unity inspectors to redraw every frame"
excerpt: "Use `Editor.RequiresConstantRepaint` to make sure your custom inspector doesn't skip any updates"
thumbtext: "RequiresConstantRepaint"
image: assets/img/social/mkvpA0BA-9E.webp
categories: [unity-protips]
tags: [unity, csharp]
author: apkd
series: true
featured: false
hidden: false
license: cc-by
contributors: []
---

Unity inspectors aren't repainted every frame by default. It is an optimization that Unity uses to make the editor slightly more responsive. You might notice inspectors don't update until you move your mouse over them - this is why.

# Forcing inspectors to redraw every frame

If you have a custom editor for your type, simply override:

> [`Editor.RequiresConstantRepaint`{{site.code.cs}}](https://docs.unity3d.com/ScriptReference/Editor.RequiresConstantRepaint.html){:.h5.mb-0}  
> Checks if this editor requires constant repaints in its current state.

Here's a snippet of how to do this for any component:

```csharp
public sealed class MyComponent : UnityEngine.MonoBehaviour
{
#if UNITY_EDITOR
    [UnityEditor.CustomEditor(typeof(MyComponent))]
    sealed class Editor : UnityEditor.Editor
    {
        public override bool RequiresConstantRepaint() => true;
    }
#endif
}
```

(And by the way, yes, I like putting my editors inline like this when they're short)