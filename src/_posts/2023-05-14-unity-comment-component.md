---
layout: post
title:  "Snippet: simple Unity comment component"
excerpt: "An easy way to document GameObjects. Just add a component and type away."
thumbtext: "Comment.cs"
image: assets/img/social/K-DwbsTXliY.webp
categories: [unity-protips]
tags: [unity]
author: apkd
series: true
featured: false
hidden: false
license: cc-by
contributors: []
---

I put this together a while ago. Maybe you'll find it useful.

# Overview

![Unity label selection dropdown](/assets/img/posts/unity-comment-component-1.png){: style="width: 100%; max-width: 480px" }
![Unity label selection dropdown](/assets/img/posts/unity-comment-component-2.png){: style="width: 100%; max-width: 480px" }

[//]: # (Don't laugh, GPT made up the example.)

* Single script, plug-and-play.
* Double-click the text area to edit.

# Installation

Either paste the script below into your project, or install it as a package via the [Unity Package Manager](https://docs.unity3d.com/Manual/upm-ui-giturl.html) using this URL:[^1]

<a href="https://gist.github.com/19c183d115953f26c62cbdced7fab5a2.git" markdown="1">
`https://gist.github.com/19c183d115953f26c62cbdced7fab5a2.git`{:.highlight.language-diff.h5}
</a>

# Source

<code data-gist-file="Comment.cs" data-gist-hide-footer="false" data-gist-id="19c183d115953f26c62cbdced7fab5a2"></code>
<noscript><a href="https://gist.github.com/apkd/19c183d115953f26c62cbdced7fab5a2#file-comment-cs">View source on gist.github.com</a></noscript>

# Optimization

* During build, the `[PostProcessScene]`{:.highlight.language-cs} callback removes instances of the component from your scenes.
* Since we can't remove the entire component from prefabs at build time[^0], the `ISerializationCallbackReceiver`{{site.code.cs}} callback clears the comment content.
* You can even use it with ECS since the component won't be baked at all.


[^0]: I looked, but couldn't find any way to do this. If I recall correctly, deleting the component during serialization results in an error. I wish we had `[PostProcessPrefab]`{:.highlight.language-cs} or something...
[^1]: Yes, you can install packages straight from GitHub Gists (if they're set up with a `package.json` and an `.asmdef`). I'm as surprised as you are that this actually works, but [Gists are built on top of regular Git repositories](https://docs.github.com/en/get-started/writing-on-github/editing-and-sharing-content-with-gists/forking-and-cloning-gists), so it makes sense.