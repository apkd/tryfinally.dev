---
layout: post
title: "Snippet: partial repository cloning w/ git sparse-checkout"
excerpt: "Use `git sparse-checkout` and `git clone --filter` to clone only part of a large repository"
thumbtext: git sparse-checkout
image: assets/img/social/0bXb4TQ2y-k.webp
categories: []
tags: [git]
author: apkd
series: true
featured: false
hidden: false
license: cc-by
contributors: []
---

If you have a large repo and only want to clone some directories (eg. to only work with audio files), you'll want to use this feature.

There's more extensive posts about this out there,[^0] but if you don't care about the details then this is the snippet you're looking for. Just tweak the repository URL and set the files/directories you want to clone:

```sh
git clone --filter=blob:none --no-checkout https://github.com/Unity-Technologies/FPSSample.git .
git sparse-checkout init
# add as many paths as you like below
git sparse-checkout set /FPSSample/Assets/Audio/Clips/Ambient/ /FPSSample/Assets/Audio/Clips/HUD/
```

You can also swap the second line for `git sparse-checkout init --cone` to [improve repository performance](https://git-scm.com/docs/git-sparse-checkout#_cone_pattern_set), at the cost of potentially including more files in the checkout.[^1]

[^0]: [more info about `sparse-checkout` and partial cloning](https://github.blog/2020-01-17-bring-your-monorepo-down-to-size-with-sparse-checkout/)
[^1]: Specifically, this includes all *files* in every folder you need to check out (including the parent of the folder you want, all the way up to the root), but still avoids checking out unwanted folders.