---
layout: post
title: "Quick fix: `Transform 'X' not found in HumanDescription`"
excerpt: "When you're attaching a GameObject to a bone of an animated character using the Humanoid rig you might encounter this error (Unity 2021.3.2f1)."
thumbtext: ""
image: assets/img/social/YBg0ptVCOOU.webp
categories: []
tags: [unity]
author: apkd
series: false
featured: false
hidden: false
license: cc-by
contributors: []
---

When you're attaching a GameObject to a bone of an animated character using the Humanoid rig you might encounter the error (as of Unity 2021.3.2f1):

`Transform 'Attachment' not found in HumanDescription.`{:.h4.keyword}

The character `Animator`{{site.code.cs}} will stop working, so sweeping it under the rug is not an option. `Attachment` refers to the name of a game object attached to the character hierarchy. Enabling stack traces reveals that during scene rendering, the animator attempts to initialize itself and it fails while binding avatar bones to the transform hierarchy in the scene.

```cpp
0x00007ff6a094b5cd (Unity) StackWalker::GetCurrentCallstack
0x00007ff6a0952329 (Unity) StackWalker::ShowCallstack
0x00007ff6a18b9713 (Unity) GetStacktrace
0x00007ff6a1f4314d (Unity) DebugStringToFile
0x00007ff6a0c3a598 (Unity) AvatarBuilder::BuildAvatarConstantFromTransformHierarchy
0x00007ff6a0c2e98b (Unity) Animator::SetupAvatarDataSet
0x00007ff6a0c22604 (Unity) Animator::CreateObject
0x00007ff6a0c2e436 (Unity) Animator::SetVisibleRenderers
0x00007ff6a01f1d2e (Unity) EventManager::InvokeEventCommon
0x00007ff6a039da9a (Unity) Renderer::RendererBecameVisible
0x00007ff6a02d046e (Unity) RendererScene::SceneAfterCullingOutputReady
0x00007ff6a02e34b0 (Unity) CullSendEvents
0x00007ff6a02e33b0 (Unity) CullScene
0x00007ff6a04b6415 (Unity) CullScriptable
0x00007ff69faab313 (Unity) ScriptableRenderContext_CUSTOM_Internal_Cull_Injected
```

Sadly, `AvatarBuilder::BuildAvatarConstantFromTransformHierarchy`{{site.code.cpp}} is native engine code, so we're not going to be able to take a look at the implementation.
However, I poked around and figured out that the issue is that Mecanim is picky about transform names.

This error message is particularly confusing because it refers to the Attachment bone, but in actuality the issue is with its children.

Take a look at this hierarchy:

![](/assets/img/posts/transform-not-found-humandescription-hierarchy-1.png){:style="width:20rem"}

I haven't figured out the exact rule (names need to be unique in transform path? unique at a given hierarchy level?), but it seems duplicate object names cause Mecanim to log errors with the attachment's root GameObject name.

To stop Mecanim from complaining (and get your animations to play), just make sure objects in the hierarchy have unique names.

As a quick workaround, you can use this script which renames GameObjects based on the `UnityEngine.Object`{{site.code.cs}} instance ID. This guarantees that objects are distinctly named (across a single editor session).

```csharp
[MenuItem("GameObject/" + nameof(RenameToInstanceID))]
static void RenameToInstanceID()
{
    foreach (var x in Selection.gameObjects)
    {
        x.name = $"GameObject {x.GetInstanceID()}";
        EditorUtility.SetDirty(x);
    }
}
```

![](/assets/img/posts/transform-not-found-humandescription-hierarchy-2.png){:style="width:20rem"}