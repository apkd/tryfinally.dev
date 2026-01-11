---
layout: post
title: "Snippet: C# version of `SquirrelNoise5`"
excerpt: "High-performance stateless noise/hash functions written by Squirrel Eiserloh. Useful for procedural generation and noise generation."
thumbtext: "SquirrelNoise5.cs"
image: assets/img/social/NDUjrvZKMeE.webp
categories: []
tags: [unity, csharp]
author: apkd
series: false
featured: false
hidden: false
---

***TL;DR*** these functions return random-looking numbers based on an integer position and seed. And they're super fast.
You can use these for procedural generation, or for anything else that needs a bit of (stateless and reproducible) randomness.

# Background

Original C++ code published [here by Squirrel Eiserloh](https://twitter.com/SquirrelTweets/status/1421251894274625536).
I changed the API a little, grouping the functions by return type - hope you don't mind.

Recommended talks by the author:
- [Math for Game Programmers: Noise-Based RNG](https://youtu.be/LWFzPP8ZbdU)
- [Math for Game Programmers: Fast and Funky 1D Nonlinear Transformations](https://youtu.be/mr5xkf6zSzk)
- [Math for Game Programmers: Juicing Your Cameras With Math](https://youtu.be/tu-Qe66AvtY)
- [Math for Game Programmers: Randomness in Games](https://www.gdcvault.com/play/1020648/Math-for-Game-Programmers-Random)

# Installation

Either simply paste the class below into your project, or install it as a package via the [Unity Package Manager](https://docs.unity3d.com/Manual/upm-ui-giturl.html) using this URL:[^0]

<a href="https://gist.github.com/eb733523bee790c3b15e9aac39713ef8.git" markdown="1">
`https://gist.github.com/eb733523bee790c3b15e9aac39713ef8.git`{:.highlight.language-diff.h5}
</a>

[^0]: Yes, you can install packages straight from GitHub Gists (if they're set up with a `package.json` and an `.asmdef`). I'm as surprised as you are that this actually works, but [Gists are built on top of regular Git repositories](https://docs.github.com/en/get-started/writing-on-github/editing-and-sharing-content-with-gists/forking-and-cloning-gists), so it makes sense.


# Source

<code data-gist-file="SquirrelNoise5.cs" data-gist-hide-footer="false" data-gist-id="eb733523bee790c3b15e9aac39713ef8"></code>
<noscript><a href="https://gist.github.com/apkd/eb733523bee790c3b15e9aac39713ef8#file-comment-cs">View source on gist.github.com</a></noscript>