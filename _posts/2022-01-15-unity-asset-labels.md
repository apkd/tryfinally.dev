---
layout: post
title: "Using Unity asset labels"
excerpt: don't get your hopes up
thumbtext: Asset labels
image: assets/img-min/cover/aHhhdKUP77M.webp
categories: [unity-protips]
tags: [unity, csharp]
author: apkd
series: true
featured: false
hidden: false
license: cc-by
contributors: []
---

Asset labels are sadly delegated to a [rather short section in the Unity docs](https://docs.unity3d.com/Manual/Searching.html).

> A label is a short piece of text that you can use to group particular assets.

You know that small icon in the lower right of the inspector for assets? <img src="/assets/img/posts/d_FilterByLabel@2x.png" class="m-0" />

The idea is that you tag your project assets with some strings, and then you can look stuff up based on the label (or look up the labels based on the stuff). Oh, by the way, term overload warning: We're talking about [these Unity asset labels](https://docs.unity3d.com/Manual/Searching.html), not [these Unity asset labels](https://docs.unity3d.com/Manual/AssetPackagesLabels.html).

As far as I know, developers very rarely utilize labels in their projects. However, in some scenarios they're a nice trick to have up your sleeve.

* chapter 1
* chapter 2
* chapter 3
{:toc}

# Nobody uses asset labels

I wrote a quick script for counting the labels applied to project assets. 

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using static System.Reflection.BindingFlags;

static class ListAssetLabels
{
    [InitializeOnLoadMethod]
    static void Init()
    {
        var labels = typeof(AssetDatabase)
                .GetMethod("GetAllLabels", Static | NonPublic)
                .Invoke(null, null) as Dictionary<string, float>;

        var labelsAndCounts = labels
            .Select(x => (
                Label: x.Key,
                Count: AssetDatabase.FindAssets($"l:{x.Key}").Length
            ))
            .OrderByDescending(x => x.Count)
            .ThenBy(x => x.Label)
            .Select(x => $"{x.Label}: {x.Count}");

        string msg = string.Join(
            separator: "\n",
            values: labelsAndCounts
        );

        UnityEngine.Debug.Log(msg);
    }
}
```

I thought it would be fun to use it on Unity's own official sample projects. I ended up testing these three:
* [Boat Attack](https://github.com/Unity-Technologies/BoatAttack)
* [Boss Room](https://github.com/Unity-Technologies/com.unity.multiplayer.samples.coop)
* [Chop Chop](https://github.com/UnityTechnologies/open-project-1)

I'd post the full results, but there isn't much to show. None of the projects use labels in any real capacity - most of the labels come from imported assets in packages.

# Labels become stale very quickly

To prove my point: in the BoatAttack project, the only actually used labels are `UI`, `GpuInstancing` and `Boat`.

The `Boat` label only includes one of the two boat prefabs, none of the materials in `GpuInstancing` have the GPU instancing option enabled, and it seems that the `UI` label is actually for random non-UI materials.

If you're using labels like they're categories, it's nearly impossible to do any work in Unity without them going out of sync with the actual state of the project.

# Label pollution from packages and assets 

If the idea of labels is that you use them to organize your project, then it all falls apart as soon as you start importing Package Manager packages or Asset Store assets.

In fact, even if you create an empty project from the default 3D template, it will come with TextMeshPro preinstalled, which includes assets tagged with the following labels:

| Labels   |             |
|----------|-------------|
| Advanced | Mesh        |
| Atlas    | Outline     |
| Bevel    | Pro         |
| Creator  | Rendering   |
| Distance | Scene       |
| Dynamic  | SDF         |
| Field    | Shadow      |
| Font     | Signed      |
| Fonts    | Style       |
| Glow     | Styles      |
| GUI      | Text        |
| Kerning  | TextMesh    |
| Layout   | TextMeshPro |
| line     | TrueType    |
| low      | ui          |

Note that each of those labels is used *exactly once*. It's hard to make an argument that organization was achieved. Moreover, since the labeled assets are in a package, you're stuck with these labels unless you uninstall TextMeshPro (which is a perfectly useful package that you probably want to keep), or install the package locally which is a bit overkill for such small annoyances.

Even if you actually organized your project using labels, importing almost any asset will instantly add a ton of random labels to your project. The problem is that these labels clutter up the UI and take space from labels that actually matter to you. **In my opinion, Unity should strip labels from assets/packages upon import**. If not by default, then at least give me a checkbox.

If you want to clean all of that mess up, editor scripts are strongly recommended. Here's one:

```csharp
[MenuItem("Tools/" + nameof(RemoveLabelsFromAllAssets))]
static void RemoveLabelsFromAllAssets()
{
    foreach (var asset in AssetDatabase.GetAllAssetPaths().Select(AssetDatabase.LoadAssetAtPath<UnityEngine.Object>))
        AssetDatabase.SetLabels(asset, System.Array.Empty<string>());
}
```
But even if you do, an empty Unity project *still* includes the following default unused labels:

| Labels       |              |              |              |
|--------------|--------------|--------------|--------------|
| 2d           | credits      | key          | red          |
| 3d           | damage       | knife        | retro        |
| abstract     | dark         | lake         | rifle        |
| action       | dawn         | landscape    | road         |
| africa       | day          | lane         | robot        |
| airplane     | debug        | language     | rock         |
| alien        | destruction  | laser        | rural        |
| ambience     | dialogue     | level        | shield       |
| ambient      | dirt         | light        | ship         |
| android      | door         | line         | skateboard   |
| animal       | drawing      | localization | skin         |
| animated     | dusk         | long         | sky          |
| animation    | editor       | loop         | small        |
| antique      | effect       | low          | smoke        |
| architecture | electric     | lowpoly      | soft         |
| armor        | enemy        | magic        | soldier      |
| army         | energy       | male         | sound        |
| arrow        | environment  | manager      | space        |
| atlas        | explosion    | marble       | sparks       |
| attack       | exterior     | material     | sprite       |
| audio        | fabric       | medieval     | starfield    |
| avatar       | fantasy      | menu         | stone        |
| bag          | farm         | metal        | street       |
| ball         | female       | military     | sun          |
| barrel       | fence        | mine         | sword        |
| base         | field        | mmo          | table        |
| bat          | fighter      | mobile       | terrain      |
| battle       | fire         | monster      | tile         |
| beach        | fly          | motorbike    | time         |
| beast        | foley        | mountain     | tool         |
| bike         | food         | music        | toon         |
| billboard    | force        | nature       | tower        |
| blood        | forest       | new          | track        |
| boat         | furniture    | night        | trailer      |
| bonus        | fx           | normalmap    | tree         |
| boost        | glass        | npc          | truck        |
| boss         | grass        | ocean        | turret       |
| box          | green        | old          | ui           |
| brick        | ground       | paint        | unlockable   |
| bridge       | grunge       | particles    | urban        |
| building     | gui          | pause        | valley       |
| bush         | gun          | pavement     | vegetation   |
| camera       | happy        | pet          | vehicle      |
| canon        | health       | photoreal    | vintage      |
| car          | helicopter   | physics      | wall         |
| cartoon      | hero         | pickup       | war          |
| character    | historical   | plant        | water        |
| city         | home         | platform     | weapon       |
| cliff        | house        | player       | wheel        |
| cloth        | hud          | police       | window       |
| cloud        | human        | pond         | wolf         |
| code         | hut          | pool         | wood         |
| combat       | industrial   | procedural   | yellow       |
| concrete     | interior     | prop         | zombie       |
| container    | inventory    | puddle       | zone         |
| controller   | jet          | racing       |              |

Note that I only extracted this list thanks to the script above. When you use the UI to add a label to an asset, you're only shown this subset.

![Unity label selection dropdown](/assets/img/posts/unity-label-selection.png){: style="height: 256px" }

The other labels are available in autocomplete (perhaps that's why they exist?). If you have more than 15 custom labels, that's also the only way to access them. By the way, I hope that your label names aren't too long, because the UI doesn't resize, and you can't see the end of the name. Needless to say, a strong candidate for an UI overhaul.

# What to use for organization instead

## Editor scripts

Rather than *expecting your labels to magically stay up to date somehow*, I'd suggest you write simple utility scripts that let you locate the assets you're interested in. They're super easy to type out and usually single-use, so I usually write these ad hoc (but keep them around just in case).

```csharp
using System;
using System.Linq;
using UnityEditor;
using UnityEngine;

static class Tools
{
    static void LogAssetsOfType<T>(Func<T, bool> filter) where T : UnityEngine.Object
    {
        var assets = AssetDatabase
            .FindAssets($"t:{typeof(T).Name}")
            .Select(AssetDatabase.GUIDToAssetPath)
            .Select(AssetDatabase.LoadAssetAtPath<T>)
            .Where(filter);

        // you can click the line in the console window to select the asset
        foreach (var asset in assets)
            Debug.Log(asset.name, context: asset);
    }

    [MenuItem("Tools/" + nameof(LogMaterialsWithInstancingEnabled))]
    static void LogMaterialsWithInstancingEnabled()
        => LogAssetsOfType<Material>(filter: x => x.enableInstancing);
}
```

## Search

The project window[^0] has some awesome hidden (undocumented?) search operators. For example, typing `t:texture2d` (case-insensitive) lets you find all Texture2D assets in your project. This works as expected for pretty much all asset types and even custom ScriptableObjects. You can also combine this with searching by name (eg. `red t:material`).

[^0]: Works in the hierarchy window too! For example, `t:MeshRenderer` filters the hierarchy to only include objects that have the MeshRenderer component.

Some more examples:
* `t:Texture`
* `t:Texture2D`
* `t:Cubemap`
* `t:Material`
* `t:Prefab`
* `t:Model`
* `t:Mesh`
* `t:LightingSettings`
* `t:RenderPipelineAsset`
* `t:InputActionAsset`
* `t:BuildConfiguration`
* `t:UniversalRenderPipelineGlobalSettings`
* `t:Preset`
* `t:AnimationClip`
* `t:Shader` ...you get it.

If you need more powertools, check out the [Unity Search](https://blog.unity.com/technology/the-latest-in-search-unity-20212) feature.

## Folders

Oh yeah, that old thing. Apparently some people just stick all of their stuff into the project's `/Assets` folder and call it a day. Labels won't save you if you're that guy.

# The actual use for labels

What's cool about labels is that they're preserved in the meta file of the asset. This means that they're easy to sync/version using source control. It looks like this:

```yaml
fileFormatVersion: 2
guid: 5184144c338498711abdd211433b990d
labels:
- MyLabel1
- MyLabel2
- MyLabel3
- MyLabel4
- MyLabel5
DefaultImporter:
  externalObjects: {}
  userData: 
  assetBundleName: 
  assetBundleVariant:
```

Not only that, but Unity automatically reimports an asset whenever its labels are modified. This is actually a bit annoying if you're using labels for organization (for some reason), but incidentally, it's an awesome feature if you use them with [`AssetPostprocessor`](https://docs.unity3d.com/ScriptReference/AssetPostprocessor.html)s.

We can write post-processors that modify the imported asset **depending on how it is labeled**. Like this:

```csharp
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;
using Object = UnityEngine.Object;

sealed class StripModelsAssetPostprocessor : AssetPostprocessor
{
    const string LabelName = "SetupAnimationAsset";

    void OnPreprocessModel() // update your import settings here
    {
        var labels = AssetDatabase.GetLabels(assetImporter);

        if (labels.Contains(LabelName))
        {
            var modelImporter = assetImporter as ModelImporter;

            if (modelImporter)
            {
                // update model importer settings to exclude unnecessary objects
                modelImporter.materialImportMode = ModelImporterMaterialImportMode.None;
                modelImporter.importCameras = false;
                modelImporter.importLights = false;
                modelImporter.importConstraints = false;
                modelImporter.importVisibility = false;
                modelImporter.importBlendShapes = false;
                modelImporter.SaveAndReimport();
            }
        }
    }

    void OnPostprocessModel(GameObject model) // modify the imported asset here
    {
        var labels = AssetDatabase.GetLabels(assetImporter);

        if (labels.Contains(LabelName))
        {
            // clean up skinned meshes
            foreach (var skinnedMeshRenderer in model.GetComponentsInChildren<SkinnedMeshRenderer>())
            {
                if (skinnedMeshRenderer.sharedMesh is var sharedMesh)
                    if (sharedMesh)
                        Object.DestroyImmediate(sharedMesh);

                Object.DestroyImmediate(skinnedMeshRenderer);
            }

            // clean up meshes from mesh filters
            foreach (var meshFilter in model.GetComponentsInChildren<MeshFilter>())
            {
                if (meshFilter.sharedMesh is var sharedMesh)
                    if (sharedMesh)
                        Object.DestroyImmediate(sharedMesh);

                Object.DestroyImmediate(meshFilter);
            }

            // clean up all child objects in the imported model
            foreach (var transform in model.GetComponentsInChildren<Transform>().Where(x => x.parent == model.transform))
                Object.DestroyImmediate(transform.gameObject);
        }
    }
}
```

Now, you only need to tag your FBX assets with the `SetupAnimationAsset` label, and the asset will strip objects other than the AnimationClips themselves. This way you can selectively modify how some of the assets in the project are imported.

It's a bit of a hack, but on the other hand it works *really well*. The primary benefit of implementing these label-based post-processors is that you can easily tag specific assets for processing. The moment you label them the asset is automatically reimported, and you can have multiple passes by stacking multiple labels. Whenever you go back modify the source asset, your post-processors are automatically applied. It's fun to set up a pipeline like this for fixing/preparing your assets procedurally, instead of going into blender/photoshop and doing it manually.

The caveats are predictable: the UI for adding/removing is terrible (it sometimes prioritizes the unused default labels over custom ones...), and you can't apply multiple instances of the same label or reorder them.

The topic of post-processors deserves a separate post, but in the meanwhile, here's a free bag of hot ideas how you can use them:

* Models
  * Simplify hierarchy, remove redundant objects
  * Simplify geometry, delete back-facing/small/duplicate/hidden triangles 
  * Generate LODs (eg. Unity's [AutoLOD](https://github.com/Unity-Technologies/AutoLOD) apparently [can do this](https://github.com/Unity-Technologies/AutoLOD/blob/cbb89da381253cf16d12afc8a2312d9931cf1d7d/Editor/ModelImporterLODGenerator.cs) in a post-processor)
  * Unwrap UVs using a custom algorithm (eg. [xatlas](https://github.com/TolinSimpson/xatlas-for-Unity))
  * Generate additional vertex channels for use in shaders (eg. [thickness](https://assetstore.unity.com/packages/tools/modeling/vertex-thickness-generator-199786), [occlusion](https://assetstore.unity.com/packages/tools/modeling/vertex-ambient-occlusion-generator-199753))
* Textures
  * Apply image effects (eg. brightness/contrast/saturation/etc... but also [dithering](https://github.com/keijiro/unity-dither4444))
  * Compression (eg. [ChromePack](https://github.com/keijiro/ChromaPack))
  * Automatically setup import settings (eg. based on texture type)
* Animations
  * Procedurally generate animation events (eg. for footstep sfx/vfx)
  * Fix/transform/optimize the animation procedurally
  * Remove meshes and unnecessary objects from animation-only FBX files (see examples above)
* Other uses
  * Procedural generation/modification/optimization of all kinds of assets (eg. [Pugrad](https://github.com/keijiro/Pugrad))
  * Automatic addressable asset management (eg. [Unity Addressable Importer](https://github.com/favoyang/unity-addressable-importer))

Note that you have to be really careful that your post-processor is entirely repeatable and deterministic (in other words, a [pure function](https://en.wikipedia.org/wiki/Pure_function) of the asset), or else you'll get inconsistent asset import results (eg. across different machines), which breaks build reproducibility (and developer sanity).
