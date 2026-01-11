---
layout: post
title: "Unity Package Cheatsheet"
excerpt: "A handy reference of all UPM packages and related links"
thumbtext: "UPM"
image: assets/img/social/YJGq5H9ofy0.webp
categories: [unity-protips]
tags: [unity]
author: apkd
series: true
featured: false
hidden: false
license: cc-by
contributors: []
---

Surprisingly enough, I haven't been able to find a convenient page that lists all packages along with links to the latest documentation... so I made my own.

Missing package? Broken link? Outdated info? You can [help keep this page up to date on Github]({{site.github.repository_url}}/edit/master/{{page.path}}).\
Feel free to add useful links to blog posts, video tutorials, forums, threads, etc.
{:.callout .callout-warning}

* chapter 1
* chapter 2
* chapter 3
{:toc}

# About packages

> A “package” is a container that stores various types of features or assets, such as:
> * Editor tools and libraries, such as a text editor, an animation viewer or test frameworks.
> * Runtime tools and libraries like the Physics API or a Graphics pipeline.
> * Asset collections, such as Textures or animations.
> * Project templates to share common project types with others.

Install packages using the [Unity Package Manager](https://docs.unity3d.com/2022.2/Documentation/Manual/upm-ui.html).

Some packages (eg. experimental ones) might not show up in the package list automatically; to install them use the `Add package by name...` option. Look up the Package ID in the table below.

![Unity Package Manager screenshot](assets/img/posts/upm.gif){:.pixel-perfect}

On older Unity versions, you can use the `Add package from Git URL...` option instead (simply paste the Package ID instead of the repository URL).\
If you prefer, you can also manage packages via the `manifest.json` file stored in `Assets/Packages/` in your project path.

Learn [how the package manager works here](https://docs.unity3d.com/2022.2/Documentation/Manual/Packages.html).\
Read about [package states, versions and lifecycle here](https://docs.unity3d.com/2022.2/Documentation/Manual/upm-lifecycle.html).

<style>
.badge.bg-secondary {font-weight: 100; font-size: 0.6rem}
table { overflow: scroll }
</style>

{% assign released = '<span class="badge bg-info">Released</span>' %}
{% assign prerelease = '<span class="badge bg-warning">Pre-release</span>' %}
{% assign experimental = '<span class="badge bg-danger">Experimental</span>' %}

{% assign pkg = 'https://docs.unity3d.com/Packages/' %}
{% assign sref = 'https://docs.unity3d.com/Documentation/ScriptReference/' %}
{% assign man = 'https://docs.unity3d.com/Manual/' %}
{% assign forums = 'https://forum.unity.com/forums/' %}
{% assign threads = 'https://forum.unity.com/threads/' %}
{% assign roadmap = 'https://unity.com/roadmap/unity-platform/' %}
{% assign badge = '{:.badge .bg-secondary}' %}

{% capture umath_github %} [GitHub](https://github.com/Unity-Technologies/Unity.Mathematics){{badge}} {% endcapture %}
{% capture gametorrahod_ecs %} [Game Torrahod Posts](https://gametorrahod.com/tag/unity-ecs/){{badge}} {% endcapture %}
{% capture gametorrahod_umath %} [Game Torrahod Post 1](https://gametorrahod.com/unity-mathematics-vs-mathf/){{badge}} {% endcapture %}
{% capture gametorrahod_noise %} [Game Torrahod Post 2](https://gametorrahod.com/various-noise-functions/){{badge}} {% endcapture %}
{% capture gametorrahod_burst %} [Game Torrahod Post](https://gametorrahod.com/analyzing-burst-generated-assemblies/){{badge}} {% endcapture %}
{% capture moetsi_dots %} [dots-tutorial.moetsi.com](https://dots-tutorial.moetsi.com){{badge}} {% endcapture %}
{% capture timeline_blogposts %}  {% endcapture %}
{% capture mlagents_blogposts %} [Unity Blog ML-Agents Posts](https://blog.unity.com/topic/machine-learning-agents){{badge}} {% endcapture %}
{% capture keijiro_barracuda %} [Keijiro's Barracuda Repositories](https://github.com/keijiro?tab=repositories&q=barracuda){{badge}} {% endcapture %}
{% capture jacksondunstan_nativecollections %} [jacksondunstan/NativeCollections](https://github.com/jacksondunstan/NativeCollections){{badge}} {% endcapture %}
{% capture hdrp_guide %} [HDRP Guide Ebook](https://resources.unity.com/games/hdrp-guide?ungated=true){{badge}} {% endcapture %}
{% capture keijiro_urp_postfx %} [keijiro/SimplePostEffects](https://github.com/keijiro/SimplePostEffects){{badge}} {% endcapture %}
{% capture ulearn_navmesh %} [Tutorial](http://unity3d.com/learn/tutorials/topics/navigation){{badge}} {% endcapture %}

{% capture dots_roadmap %} [DOTS Roadmap]({{roadmap}}dots){{badge}} {% endcapture %}
{% capture gameplay_ui_roadmap %} &#32;[Roadmap]({{roadmap}}gameplay-ui-design){{badge}} {% endcapture %}
{% capture rendering_roadmap %} [Roadmap]({{roadmap}}rendering-visual-effects){{badge}} {% endcapture %}

{% capture unity_2d %}
&#32;[2D Forum]({{forums}}.53){{badge}}
&#32;[2D Experimental Preview Forum]({{forums}}.104){{badge}}
&#32;[2D Manual Page]({{man}}/Unity2D.html){{badge}}
&#32;[2D Roadmap]({{roadmap}}2d){{badge}}
{% endcapture %}
{% capture unity_2d_oneline %} {{ unity_2d | strip_newlines }} {% endcapture %}

{% capture unity_ap %}
&#32;[Unity Blog Post 1](https://blog.unity.com/games/build-stunning-mobile-games-that-run-smoothly-with-adaptive-performance){{badge}}
&#32;[Unity Blog Post 2](https://blog.unity.com/technology/mobile-performance-optimization-with-adaptive-performance-40){{badge}}
&#32;[ARM Community Blog Post](https://community.arm.com/arm-community-blogs/b/graphics-gaming-and-vr-blog/posts/how-to-use-adaptive-performance){{badge}}
&#32;[Forum Thread](https://forum.unity.com/threads/adaptive-performance-package.652306/){{badge}}
{% endcapture %}
{% capture unity_ap_oneline %} {{ unity_ap | strip_newlines }} {% endcapture %}

{% capture unity_xr %}
&#32;[XR Manual]({{man}}XR.html){{badge}}
&#32;[XR Forum]({{forums}}.80){{badge}}
&#32;[XR Roadmap]({{roadmap}}arvr){{badge}}
{% endcapture %}
{% capture unity_xr_oneline %} {{ unity_xr | strip_newlines }} {% endcapture %}

{% capture unity_timeline %}
&#32;[Timeline Forum]({{forums}}.127){{badge}}
&#32;[Docs]({{pkg}}com.unity.timeline@latest/manual/play_director.html){{badge}}
&#32;[Blog Posts](https://blog.unity.com/topic/timeline){{badge}}
&#32;[Roadmap]({{roadmap}}gameplay-ui-design){{badge}}
{% endcapture %}
{% capture unity_timeline_oneline %} {{ unity_timeline | strip_newlines }} {% endcapture %}

# Package list

{::comment}
I did my best trying to make the tables below as readable/editable as possible, but even my liquid powers have their limits.
For contributing, I recommend a standalone text editor with wrapping disabled, else things get messy fast.
{:/comment}

<div class="table-responsive" markdown="block">

| Package ID                                   | Documentation                                                                               |            State | Links                                                                                                                                             |
|----------------------------------------------|:--------------------------------------------------------------------------------------------|-----------------:|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `com.unity.2d.animation`                     | [2D Animation]({{pkg}}com.unity.2d.animation@latest)                                        |     {{released}} | {{unity_2d_oneline}}                                                                                                                              |
| `com.unity.2d.pixel-perfect`                 | [2D Pixel Perfect]({{pkg}}com.unity.2d.pixel-perfect@latest)                                |     {{released}} | {{unity_2d_oneline}}                                                                                                                              |
| `com.unity.2d.psdimporter`                   | [2D PSD Importer]({{pkg}}com.unity.2d.psdimporter@latest)                                   |     {{released}} | {{unity_2d_oneline}}                                                                                                                              |
| `com.unity.2d.spriteshape`                   | [2D SpriteShape]({{pkg}}com.unity.2d.spriteshape@latest)                                    |     {{released}} | {{unity_2d_oneline}}                                                                                                                              |
| `com.unity.2d.tilemap.extras`                | [2D Tilemap Extras]({{pkg}}com.unity.2d.tilemap.extras@latest)                              |     {{released}} | {{unity_2d_oneline}}                                                                                                                              |
| `com.unity.adaptiveperformance`              | [Adaptive Performance]({{pkg}}com.unity.adaptiveperformance@latest)                         |     {{released}} | {{unity_ap_oneline}}                                                                                                                              |
| `com.unity.addressables`                     | [Addressables]({{pkg}}com.unity.addressables@latest)                                        |     {{released}} | [Addressables Forum]({{forums}}.156){{badge}}                                                                                                     |
| `com.unity.ads.ios-support`                  | [iOS 14 Advertising Support]({{pkg}}com.unity.ads.ios-support@latest)                       |     {{released}} |                                                                                                                                                   |
| `com.unity.ads`                              | [Advertisement]({{pkg}}com.unity.ads@latest)                                                |     {{released}} |                                                                                                                                                   |
| `com.unity.analytics`                        | [Analytics Library]({{pkg}}com.unity.analytics@latest)                                      |     {{released}} |                                                                                                                                                   |
| `com.unity.animation.rigging`                | [Animation Rigging]({{pkg}}com.unity.animation.rigging@latest)                              |     {{released}} | [Animation Rigging Forum]({{forums}}.589){{badge}}                                                                                                |
| `com.unity.burst`                            | [Burst]({{pkg}}com.unity.burst@latest)                                                      |     {{released}} | [Burst Forum]({{forums}}.629){{badge}} {{gametorrahod_burst}}                                                                                     |
| `com.unity.cinemachine`                      | [Cinemachine]({{pkg}}com.unity.cinemachine@latest)                                          |     {{released}} | [Cinemachine Forum]({{forums}}.136){{badge}}                                                                                                      |
| `com.unity.collab-proxy`                     | [Version Control]({{pkg}}com.unity.collab-proxy@latest)                                     |     {{released}} |                                                                                                                                                   |
| `com.unity.collections`                      | [Collections]({{pkg}}com.unity.collections@latest)                                          |     {{released}} | [DOTS Forum]({{forums}}.147){{badge}} {{jacksondunstan_nativecollections}}                                                                        |
| `com.unity.connect.share`                    | [WebGL Publisher]({{pkg}}com.unity.connect.share@latest)                                    |     {{released}} |                                                                                                                                                   |
| `com.unity.device-simulator.devices`         | [Device Simulator Devices]({{pkg}}com.unity.device-simulator.devices@latest)                |     {{released}} |                                                                                                                                                   |
| `com.unity.editorcoroutines`                 | [Editor Coroutines]({{pkg}}com.unity.editorcoroutines@latest)                               |     {{released}} |                                                                                                                                                   |
| `com.unity.formats.alembic`                  | [Alembic]({{pkg}}com.unity.formats.alembic@latest)                                          |     {{released}} |                                                                                                                                                   |
| `com.unity.formats.fbx`                      | [FBX Exporter]({{pkg}}com.unity.formats.fbx@latest)                                         |     {{released}} |                                                                                                                                                   |
| `com.unity.ide.rider`                        | [JetBrains Rider Editor]({{pkg}}com.unity.ide.rider@latest)                                 |     {{released}} |                                                                                                                                                   |
| `com.unity.ide.visualstudio`                 | [Visual Studio Editor]({{pkg}}com.unity.ide.visualstudio@latest)                            |     {{released}} |                                                                                                                                                   |
| `com.unity.ide.vscode`                       | [Visual Studio Code Editor]({{pkg}}com.unity.ide.vscode@latest)                             |     {{released}} |                                                                                                                                                   |
| `com.unity.inputsystem`                      | [Input System]({{pkg}}com.unity.inputsystem@latest)                                         |     {{released}} | [Input System Forum]({{forums}}.103){{badge}} {{gameplay_ui_roadmap}}                                                                             |
| `com.unity.learn.iet-framework.authoring`    | [Tutorial Authoring Tools]({{pkg}}com.unity.learn.iet-framework.authoring@latest)           |     {{released}} |                                                                                                                                                   |
| `com.unity.learn.iet-framework`              | [Tutorial Framework]({{pkg}}com.unity.learn.iet-framework@latest)                           |     {{released}} |                                                                                                                                                   |
| `com.unity.live-capture`                     | [Live Capture]({{pkg}}com.unity.live-capture@latest)                                        |     {{released}} |                                                                                                                                                   |
| `com.unity.localization`                     | [Localization]({{pkg}}com.unity.localization@latest)                                        |     {{released}} | [Localization Forum]({{forums}}.205){{badge}}                                                                                                     |
| `com.unity.mathematics`                      | [Mathematics]({{pkg}}com.unity.mathematics@latest)                                          |     {{released}} | [Burst Forum]({{forums}}.629){{badge}} [DOTS Forum]({{forums}}.147){{badge}} {{umath_github}} {{gametorrahod_umath}} {{gametorrahod_noise}}       |
| `com.unity.ml-agents`                        | [ML Agents]({{pkg}}com.unity.ml-agents@latest)                                              |     {{released}} | [ML-Agents Forum]({{forums}}.453){{badge}} {{mlagents_blogposts}}                                                                                 |
| `com.unity.mobile.android-logcat`            | [Android Logcat]({{pkg}}com.unity.mobile.android-logcat@latest)                             |     {{released}} |                                                                                                                                                   |
| `com.unity.mobile.notifications`             | [Mobile Notifications]({{pkg}}com.unity.mobile.notifications@latest)                        |     {{released}} |                                                                                                                                                   |
| `com.unity.performance.profile-analyzer`     | [Profile Analyzer]({{pkg}}com.unity.performance.profile-analyzer@latest)                    |     {{released}} |                                                                                                                                                   |
| `com.unity.polybrush`                        | [Polybrush]({{pkg}}com.unity.polybrush@latest)                                              |     {{released}} |                                                                                                                                                   |
| `com.unity.postprocessing`                   | [Post Processing]({{pkg}}com.unity.postprocessing@latest)                                   |     {{released}} | [Image Effects Forum]({{forums}}.96){{badge}}                                                                                                     |
| `com.unity.probuilder`                       | [ProBuilder]({{pkg}}com.unity.probuilder@latest)                                            |     {{released}} | [ProBuilder Forum Thread]({{threads}}.169245){{badge}}                                                                                            |
| `com.unity.profiling.core`                   | [Unity Profiling Core API]({{pkg}}com.unity.profiling.core@latest)                          |     {{released}} |                                                                                                                                                   |
| `com.unity.profiling.systemmetrics.mali`     | [System Metrics Mali]({{pkg}}com.unity.profiling.systemmetrics.mali@latest)                 |     {{released}} |                                                                                                                                                   |
| `com.unity.purchasing.udp`                   | [Unity Distribution Portal]({{pkg}}com.unity.purchasing.udp@latest)                         |     {{released}} |                                                                                                                                                   |
| `com.unity.purchasing`                       | [In App Purchasing]({{pkg}}com.unity.purchasing@latest)                                     |     {{released}} |                                                                                                                                                   |
| `com.unity.render-pipelines.core`            | [Scriptable Render Pipeline Core]({{pkg}}com.unity.render-pipelines.core@latest)            |     {{released}} |                                                                                                                                                   |
| `com.unity.render-pipelines.high-definition` | [High Definition Render Pipeline]({{pkg}}com.unity.render-pipelines.high-definition@latest) |     {{released}} | [HDRP Forum]({{forums}}.386){{badge}} [Graphics Experimental Previews Forum]({{forums}}.110){{badge}} {{rendering_roadmap}} {{hdrp_guide}}        |
| `com.unity.render-pipelines.universal`       | [Universal Render Pipeline]({{pkg}}com.unity.render-pipelines.universal@latest)             |     {{released}} | [URP Forum]({{forums}}.383){{badge}} [Graphics Experimental Previews Forum]({{forums}}.110){{badge}} {{rendering_roadmap}} {{keijiro_urp_postfx}} |
| `com.unity.recorder`                         | [Recorder]({{pkg}}com.unity.recorder@latest)                                                |     {{released}} | [Recorder Forum Thread]({{threads}}.1071971){{badge}}                                                                                             |
| `com.unity.remote-config`                    | [Remote Config]({{pkg}}com.unity.remote-config@latest)                                      |     {{released}} | [Remote Config Forum]({{forums}}.371){{badge}}                                                                                                    |
| `com.unity.scriptablebuildpipeline`          | [Scriptable Build Pipeline]({{pkg}}com.unity.scriptablebuildpipeline@latest)                |     {{released}} |                                                                                                                                                   |
| `com.unity.sequences`                        | [Sequences]({{pkg}}com.unity.sequences@latest)                                              |     {{released}} |                                                                                                                                                   |
| `com.unity.shadergraph`                      | [Shader Graph]({{pkg}}com.unity.shadergraph@latest)                                         |     {{released}} | [Shader Graph Forum]({{forums}}.346){{badge}} {{rendering_roadmap}}                                                                               |
| `com.unity.splines`                          | [Splines]({{pkg}}com.unity.splines@latest)                                                  |     {{released}} | [Splines Forum Thread]({{threads}}.1190464){{badge}}                                                                                              |
| `com.unity.terrain-tools`                    | [Terrain Tools]({{pkg}}com.unity.terrain-tools@latest)                                      |     {{released}} | [Terrain Tools Forum Thread]({{threads}}.1003392){{badge}}                                                                                        |
| `com.unity.test-framework`                   | [Test Framework]({{pkg}}com.unity.test-framework@latest)                                    |     {{released}} | [Testing & Automation Forum]({{forums}}.211){{badge}}                                                                                             |
| `com.unity.testtools.codecoverage`           | [Code Coverage]({{pkg}}com.unity.testtools.codecoverage@latest)                             |     {{released}} | [Testing & Automation Forum]({{forums}}.211){{badge}}                                                                                             |
| `com.unity.textmeshpro`                      | [TextMeshPro]({{pkg}}com.unity.textmeshpro@latest)                                          |     {{released}} | [UGUI & TextMesh Pro Forum]({{forums}}.60){{badge}}                                                                                               |
| `com.unity.timeline`                         | [Timeline]({{pkg}}com.unity.timeline@latest)                                                |     {{released}} | {{unity_timeline_oneline}}                                                                                                                        |
| `com.unity.visualscripting`                  | [Visual Scripting]({{pkg}}com.unity.visualscripting@latest)                                 |     {{released}} | [Visual Scripting Forum]({{forums}}.537){{badge}} {{gameplay_ui_roadmap}}                                                                         |
| `com.unity.visualeffectgraph`                | [Visual Effect Graph]({{pkg}}com.unity.visualeffectgraph@latest)                            |     {{released}} | [VFX Graph Forum]({{forums}}.428){{badge}} {{rendering_roadmap}}                                                                                  |
| `com.unity.xr.arcore`                        | [ARCore XR Plugin]({{pkg}}com.unity.xr.arcore@latest)                                       |     {{released}} | {{unity_xr_oneline}}                                                                                                                              |
| `com.unity.xr.arfoundation`                  | [AR Foundation]({{pkg}}com.unity.xr.arfoundation@latest)                                    |     {{released}} | {{unity_xr_oneline}}                                                                                                                              |
| `com.unity.xr.arkit`                         | [ARKit XR Plugin]({{pkg}}com.unity.xr.arkit@latest)                                         |     {{released}} | {{unity_xr_oneline}}                                                                                                                              |
| `com.unity.xr.interaction.toolkit`           | [XR Interaction Toolkit]({{pkg}}com.unity.xr.interaction.toolkit@latest)                    |     {{released}} | {{unity_xr_oneline}}                                                                                                                              |
| `com.unity.xr.magicleap`                     | [Magic Leap XR Plugin]({{pkg}}com.unity.xr.magicleap@latest)                                |     {{released}} | {{unity_xr_oneline}}                                                                                                                              |
| `com.unity.xr.management`                    | [XR Plugin Management]({{pkg}}com.unity.xr.management@latest)                               |     {{released}} | {{unity_xr_oneline}}                                                                                                                              |
| `com.unity.xr.oculus`                        | [Oculus XR Plugin]({{pkg}}com.unity.xr.oculus@latest)                                       |     {{released}} | {{unity_xr_oneline}}                                                                                                                              |
| `com.unity.xr.openxr`                        | [OpenXR Plugin]({{pkg}}com.unity.xr.openxr@latest)                                          |     {{released}} | {{unity_xr_oneline}}                                                                                                                              |
| `com.unity.scripting.python`                 | [Python for Unity]({{pkg}}com.unity.scripting.python@latest)                                |   {{prerelease}} | [Python for Unity Forum Thread]({{forums}}.1084688){{badge}}                                                                                      |
| `com.unity.services.vivox`                   | [Vivox]({{pkg}}com.unity.services.vivox@latest)                                             |   {{prerelease}} | [Vivox Forum]({{forums}}.737){{badge}} [Dashboard](https://dashboard.unity3d.com/vivox){{badge}}                                                  |
| `com.unity.ai.navigation`                    | [NavMesh Building Components]({{pkg}}com.unity.ai.navigation@latest)                        | {{experimental}} | [Navigation Forum]({{forums}}.79){{badge}} {{ulearn_navmesh}} [Navigation and AI Roadmap]({{roadmap}}navigation-game-ai){{badge}}                 |
| `com.unity.barracuda`                        | [Barracuda]({{pkg}}com.unity.barracuda@latest)                                              | {{experimental}} | [Barracuda Forum]({{forums}}.500){{badge}} {{keijiro_barracuda}}                                                                                  |
| `com.unity.entities`                         | [Entities]({{pkg}}com.unity.entities@latest)                                                | {{experimental}} | [DOTS Forum]({{forums}}.147){{badge}} [DOTS Roadmap]({{roadmap}}dots){{badge}} {{moetsi_dots}} {{gametorrahod_ecs}}                               |
| `com.unity.jobs`                             | [Jobs]({{pkg}}com.unity.jobs@latest)                                                        | {{experimental}} | [DOTS Forum]({{forums}}.147){{badge}} [DOTS Roadmap]({{roadmap}}dots){{badge}} {{moetsi_dots}}                                                    |
| `com.unity.platforms`                        | [Platforms]({{pkg}}com.unity.platforms@latest)                                              | {{experimental}} | [DOTS Forum]({{forums}}.147){{badge}} [DOTS Roadmap]({{roadmap}}dots){{badge}} {{moetsi_dots}}                                                    |
| `com.unity.rendering.hybrid`                 | [Hybrid Renderer]({{pkg}}com.unity.rendering.hybrid@latest)                                 | {{experimental}} | [DOTS Graphics Forum]({{forums}}.641){{badge}} [DOTS Roadmap]({{roadmap}}dots){{badge}} {{moetsi_dots}}                                           |
| `com.unity.netcode`                          | [Netcode]({{pkg}}com.unity.netcode@latest)                                                  | {{experimental}} | [DOTS NetCode Forum]({{forums}}.425){{badge}} [Multiplayer Roadmap]({{roadmap}}multiplayer-networking){{badge}} {{moetsi_dots}}                   |
| `com.unity.transport`                        | [Transport]({{pkg}}com.unity.transport@latest)                                              | {{experimental}} | [DOTS NetCode Forum]({{forums}}.425){{badge}} [Multiplayer Roadmap]({{roadmap}}multiplayer-networking){{badge}} {{moetsi_dots}}                   |
| `com.unity.physics`                          | [Unity Physics]({{pkg}}com.unity.physics@latest)                                            | {{experimental}} | [DOTS Physics Forum]({{forums}}.422){{badge}} [DOTS Roadmap]({{roadmap}}dots){{badge}} {{moetsi_dots}}                                            |
| `com.havok.physics`                          | [Havok Physics]({{pkg}}com.havok.physics@latest)                                            | {{experimental}} | [DOTS Physics Forum]({{forums}}.422){{badge}} [DOTS Roadmap]({{roadmap}}dots){{badge}} {{moetsi_dots}}                                            |
| `com.unity.kinematica`                       | [Kinematica]({{pkg}}com.unity.kinematica@latest)                                            | {{experimental}} | [DOTS Animation Previews Forum]({{forums}}.141){{badge}}                                                                                          |
| `com.unity.tiny`                             | [Project Tiny (core package)]({{pkg}}com.unity.tiny@latest)                                 | {{experimental}} | [Project Tiny Forum]({{forums}}.151){{badge}}                                                                                                     |
| `com.unity.tiny.all`                         | [Project Tiny (all dependencies)]({{pkg}}com.unity.tiny.all@latest)                         | {{experimental}} | [Project Tiny Forum]({{forums}}.151){{badge}}                                                                                                     |
{:.table-hover}
</div>

# About built-in packages

> Built-in packages allow users to toggle Unity features on or off through the Package Manager.
> Enabling or disabling a package reduces the run-time build size.
> For example, most Projects don’t use the legacy Particle System.
> 
> When you remove a built-in package for a feature, Unity does not include the related code and resources when you build your final application.
> Typically, these built-in packages contain only the package manifest and are bundled with Unity (rather than available on the package registry).

You can add or remove built-in packages in the Package Manager, in the `Built-in` tab.
Disabling unneeded packages early in development will help you avoid referencing them by accident.

![Unity Package Manager screenshot](assets/img/posts/upm-builtin.gif){:.pixel-perfect}

# Built-in package list

{% capture nav_pkg %} [Extras Package]({{pkg}}com.unity.ai.navigation@latest){{badge}} {% endcapture %}
{% capture addr_pkg %} [Addressables Package]({{pkg}}com.unity.addressables@latest){{badge}} {% endcapture %}

<div class="table-responsive" markdown="block">

| Package ID                                     | Script Reference                                                                                                                                                                                                                    | Links                                                                                                         |
|------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| `com.unity.modules.ai`                         | [AI *(Pathfinding)*{:.small}]({{sref}}UnityEngine.AIModule.html "The AI module implements the path finding features in Unity.")                                                                                                     | [Manual]({{man}}Navigation.html){{badge}} {{ulearn_navmesh}} {{nav_pkg}}                                      |
| `com.unity.modules.androidjni`                 | [Android JNI]({{sref}}UnityEngine.AndroidJNIModule.html "AndroidJNI module allows you to call Java code.")                                                                                                                          | [Manual]({{man}}android-plugins-java-code-from-c-sharp.html){{badge}}                                         |
| `com.unity.modules.animation`                  | [Animation *(Mecanim)*{:.small}]({{sref}}UnityEngine.AnimationModule.html "The Animation module implements Unity’s animation system.")                                                                                              | [Manual]({{man}}AnimationSection.html){{badge}} [Animation Forum]({{forums}}.52){{badge}}                     |
| `com.unity.modules.assetbundle`                | [Asset Bundle]({{sref}}UnityEngine.AssetBundleModule.html "The AssetBundle module implements the AssetBundle class and related APIs to load data from AssetBundles.")                                                               | [Manual]({{man}}AssetBundlesIntro.html){{badge}}  [Asset Bundles Forum]({{forums}}.118){{badge}} {{addr_pkg}} |
| `com.unity.modules.audio`                      | [Audio]({{sref}}UnityEngine.AudioModule.html "The Audio module implements Unity’s audio system.")                                                                                                                                   | [Manual]({{man}}Audio.html){{badge}}  [Audio Forum]({{forums}}.74){{badge}}                                   |
| `com.unity.modules.cloth`                      | [Cloth]({{sref}}UnityEngine.ClothModule.html "The Cloth module implements cloth physics simulation through the Cloth component.")                                                                                                   | [Manual]({{man}}class-Cloth.html){{badge}}                                                                    |
| `com.unity.modules.director`                   | [Director *(Timeline)*{:.small}]({{sref}}UnityEngine.DirectorModule.html "The Director module implements the PlayableDirector class.")                                                                                              | {{unity_timeline_oneline}}                                                                                            |
| `com.unity.modules.imageconversion`            | [Image Conversion]({{sref}}UnityEngine.ImageConversionModule.html "The ImageConversion module implements the ImageConversion class which provides helper methods to convert images from and to PNG, JPEG or EXR formats")           |                                                                                                               |
| `com.unity.modules.imgui`                      | [IMGUI]({{sref}}UnityEngine.IMGUIModule.html "The IMGUI module provides Unity’s immediate mode GUI solution for creating in-game and editor user interfaces.")                                                                      | [Manual]({{man}}GUIScriptingGuide.html){{badge}}                                                              |
| `com.unity.modules.jsonserialize`              | [JSONSerialize *(JsonUtility)*{:.small}]({{sref}}UnityEngine.JSONSerializeModule.html "The JSONSerialize module provides the JsonUtility class which lets you serialize Unity Objects to JSON format.")                             | [Manual]({{man}}script-Serialization.html){{badge}}                                                           |
| `com.unity.modules.nvidia`                     | [NVIDIA *(DLSS etc)*{:.small}]({{sref}}UnityEngine.NVIDIAModule.html "A module that contains API you can use to interact with NVIDIA graphics cards.")                                                                              | [Manual]({{man}}deep-learning-super-sampling.html){{badge}}                                                   |
| `com.unity.modules.particlesystem`             | [Particle System]({{sref}}UnityEngine.ParticleSystemModule.html "The ParticleSystem module implements Unity’s Particle System.")                                                                                                    | [Manual]({{man}}ParticleSystems.html){{badge}} [General Graphics Forum]({{forums}}.76){{badge}}               |
| `com.unity.modules.physics`                    | [Physics]({{sref}}UnityEngine.PhysicsModule.html "The Physics module implements 3D physics in Unity.")                                                                                                                              | [Manual]({{man}}PhysicsOverview.html){{badge}} [Physics Forum]({{forums}}.78){{badge}}                        |
| `com.unity.modules.physics2d`                  | [Physics 2D]({{sref}}UnityEngine.Physics2DModule.html "The Physics2d module implements 2D physics in Unity.")                                                                                                                       | [Manual]({{man}}Physics2DReference.html){{badge}} [2D Forum]({{forums}}.53){{badge}}                          |
| `com.unity.modules.screencapture`              | [Screen Capture]({{sref}}UnityEngine.ScreenCaptureModule.html "The ScreenCapture module provides functionality to take screen shots using the ScreenCapture class.")                                                                |                                                                                                               |
| `com.unity.modules.subsystems`                 | [Subsystems]({{sref}}UnityEngine.SubsystemsModule.html "The Subsystem module contains the definitions and runtime support for general subsystems in Unity.")                                                                        |                                                                                                               |
| `com.unity.modules.terrain`                    | [Terrain]({{sref}}UnityEngine.TerrainModule.html "The Terrain module implements Unity’s Terrain rendering engine available through the Terrain component.")                                                                         | [Manual]({{man}}script-Terrain.html){{badge}} [World Building Forum]({{forums}}.146){{badge}}                 |
| `com.unity.modules.terrainphysics`             | [Terrain Physics *(Terrain Collider)*{:.small}]({{sref}}UnityEngine.TerrainPhysicsModule.html "The TerrainPhysics module connects the Terrain and Physics modules by implementing the TerrainCollider component.")                  | [Manual]({{man}}class-TerrainCollider.html){{badge}} [Physics Forum]({{forums}}.78){{badge}}                  |
| `com.unity.modules.tilemap`                    | [Tilemap]({{sref}}UnityEngine.TilemapModule.html "The Tilemap module implements the Tilemap class.")                                                                                                                                | [Manual]({{man}}class-Tilemap.html){{badge}} [2D Forum]({{forums}}.53){{badge}}                               |
| `com.unity.modules.ui`                         | [UI *(UGUI)*{:.small}]({{sref}}UnityEngine.UIModule.html "The UI module implements basic components required for Unity’s UI system.")                                                                                               | [UGUI Docs]({{pkg}}com.unity.ugui@latest){{badge}} [UGUI Forum]({{forums}}.60){{badge}}                       |
| `com.unity.modules.uielements`                 | [UI Elements *(UI Toolkit)*{:.small}]({{sref}}UnityEngine.UIElementsModule.html "The UIElements module implements the UIElements retained mode UI framework.")                                                                      | [Manual]({{man}}UIElements.html){{badge}} [UI Toolkit Forum]({{forums}}.178){{badge}}                         |
| `com.unity.modules.uielementsnative`           | [UI Elements Native]({{sref}}UnityEngine.UIElementsModule.html "This built in package controls the presence of the UIElements Native module.")                                                                                      |                                                                                                               |
| `com.unity.modules.umbra`                      | [Umbra *(Occlusion Culling)*{:.small}]({{sref}}UnityEngine.UmbraModule.html "The Umbra module implements Unity’s occlusion culling system.")                                                                                        | [Manual]({{man}}OcclusionCulling.html){{badge}} [General Graphics Forum]({{forums}}.76){{badge}}              |
| `com.unity.modules.unityanalytics`             | [Unity Analytics]({{sref}}UnityEngine.UnityAnalyticsModule.html "The UnityAnalytics module implements APIs required to use Unity Analytics.")                                                                                       | [Manual]({{man}}UnityAnalytics.html){{badge}}                                                                 |
| `com.unity.modules.unitywebrequest`            | [Unity Web Request]({{sref}}UnityEngine.UnityWebRequestModule.html "The UnityWebRequest module lets you communicate with http services.")                                                                                           | [Manual]({{man}}UnityWebRequest.html){{badge}}                                                                |
| `com.unity.modules.unitywebrequestassetbundle` | [Unity Web Request Asset Bundle]({{sref}}UnityEngine.UnityWebRequestAssetBundleModule.html "The UnityWebRequestAssetBundle module provides the DownloadHandlerAssetBundle class to use UnityWebRequest to download Asset Bundles.") | [Manual]({{man}}UnityWebRequest.html){{badge}}                                                                |
| `com.unity.modules.unitywebrequestaudio`       | [Unity Web Request Audio]({{sref}}UnityEngine.UnityWebRequestAudioModule.html "The UnityWebRequestAudio module provides the DownloadHandlerAudioClip class to use UnityWebRequest to download AudioClips.")                         | [Manual]({{man}}UnityWebRequest.html){{badge}}                                                                |
| `com.unity.modules.unitywebrequesttexture`     | [Unity Web Request Texture]({{sref}}UnityEngine.UnityWebRequestTextureModule.html "The UnityWebRequestTexture module provides the DownloadHandlerTexture class to use UnityWebRequest to download Textures.")                       | [Manual]({{man}}UnityWebRequest-RetrievingTexture.html){{badge}}                                              |
| `com.unity.modules.unitywebrequestwww`         | [Unity Web Request WWW]({{sref}}UnityEngine.UnityWebRequestWWWModule.html "The UnityWebRequestWWW module implements the legacy WWW lets you communicate with http services.")                                                       | [Manual]({{man}}UnityWebRequest.html){{badge}}                                                                |
| `com.unity.modules.vehicles`                   | [Vehicles *(Wheel Collider)*{:.small}]({{sref}}UnityEngine.VehiclesModule.html "The Vehicles module implements vehicle physics simulation through the WheelCollider component.")                                                    | [Manual]({{man}}class-WheelCollider.html){{badge}} [Physics Forum]({{forums}}.78){{badge}}                    |
| `com.unity.modules.video`                      | [Video]({{sref}}UnityEngine.VideoModule.html "The Video module lets you play back video files in your content.")                                                                                                                    | [Manual]({{man}}VideoPlayer.html){{badge}}                                                                    |
| `com.unity.modules.wind`                       | [Wind *(Wind Zone)*{:.small}]({{sref}}UnityEngine.WindModule.html "The Wind module implements the WindZone component which can affect terrain rendering and particle simulations.")                                                 | [Manual]({{man}}class-WindZone.html){{badge}}                                                                 |
| `com.unity.modules.vr`                         | [VR]({{sref}}UnityEngine.VRModule.html "The VR module implements support for virtual reality devices in Unity.")                                                                                                                    | {{unity_xr_oneline}}                                                                                          |
| `com.unity.modules.xr`                         | [XR]({{sref}}UnityEngine.XRModule.html "The XR module contains the VR and AR related platform support functionality.")                                                                                                              | {{unity_xr_oneline}}                                                                                          |
{:.table-hover}
</div>

![package illustration](assets/img/posts/package.gif){:.pixel-perfect}

# Todo
{:.no_toc}

- [ ] Keep adding missing packages (eg. ones only available on GitHub)
- [ ] Add more links (eg. YT tutorials)
- [x] Add list of built-in modules
- [x] Improve table readability