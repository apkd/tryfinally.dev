---
layout: post
title: "Snippet: quickly re-encoding video files w/ ffmpeg on Windows"
excerpt: "Quick `.bat` script to re-encode `yt-dlp`'d video files to H.264"
thumbtext: "reencode.bat"
image: assets/img/social/vg0Mph2RmI4.webp
categories: []
tags: [ffmpeg]
author: apkd
series: true
featured: false
hidden: true
license: cc-by
contributors: []
---

Recently I constantly find myself having to re-encode `yt-dlp`'d video files before sending/posting them somewhere.

Here's a super simple `.bat` that you can [drop in your `PATH`](https://stackoverflow.com/questions/44272416/how-to-add-a-folder-to-path) (along with [ffmpeg](https://ffmpeg.org/download.html)) to make this fast:

<code data-gist-hide-footer="false" data-gist-id="a4eb52d29eb114ec2deb2103b69f03e1"></code>
<noscript><a href="https://gist.github.com/apkd/a4eb52d29eb114ec2deb2103b69f03e1#file-comment-cs">View source on gist.github.com</a></noscript>

> Usage:<br/>
> `reencode path_to_file optional_crf`{{site.code.cs}}

> For example:<br/>
> `reencode myvid.mp4`{{site.code.cs}}

> Custom encoding quality:<br/>
> `reencode myvid.mp4 30`{{site.code.cs}}

* The script transcodes the file to H.264+Opus, appends `_x264` to the filename and changes the extension to `.mp4`.
* Adjust transcoding quality by providing the CRF after the filename.
  * Useful for tweaking the file size, eg. when you're trying to fit under Discord's 8MB attachment size limit.
  * If you omit this argument, the default value is 23.
  * Values in the range of 17-28 give good results, but the full range is 0-51, where 0 is lossless and 51 is loss...ful.
* You can also switch the encoding `-preset` to match your personal patience level.
* See [this H.264 encoding guide](https://trac.ffmpeg.org/wiki/Encode/H.264) for a nice summary of all available settings.