---
layout: post
title: "Snippet: partial repository cloning w/ git sparse-checkout"
excerpt: use `git sparse-checkout` and `git clone --filter` to clone only part of a large repository
thumbtext: git sparse-checkout
image: assets/img-min/cover/YJGq5H9ofy0.webp
categories: [unity-protips]
tags: [git]
author: apkd
series: true
featured: false
hidden: false
license: cc-by
contributors: []
---

If you have a large repo and only want to clone some directories (eg. to only work with audio files), you'll want to use this feature.

There's longer posts about this out there,[^0] but if you don't care about the details then this is the snippet you're looking for:

```sh
git clone --filter=blob:none --no-checkout https://github.com/apkd/tryfinally.dev.git .
git sparse-checkout init --cone
git sparse-checkout set README.md LICENSE.md
```

[^0]: [more info about `sparse-checkout` and partial cloning](https://github.blog/2020-01-17-bring-your-monorepo-down-to-size-with-sparse-checkout/)
