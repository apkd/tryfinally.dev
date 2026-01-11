#!/usr/bin/env dotnet run
#:property TargetFramework=net10.0
#:package Bullseye@6.1.0
#:package SimpleExec@12.1.0

using FileSystem = Microsoft.VisualBasic.FileIO.FileSystem;
using static Bullseye.Targets;
using static SimpleExec.Command;

Target(
    "build",
    dependsOn: ["build-css", "build-js", "build-img", "build-search", "build-cp"]
);

Target(
    "build-html",
    async () =>
    {
        var env = args.Contains("build-html-dev") ? "development" : "production";
        await RunAsync("bundle", "exec jekyll build", configureEnvironment: x => x["JEKYLL_ENV"] = env);

        string[] files = Directory.GetFiles("_site", "*.html", SearchOption.AllDirectories);
        long before = MeasureFileSizesKb(files);
        await Task.WhenAll(files.Select(MinifyHtml));
        long after = MeasureFileSizesKb(files);
        Console.WriteLine($"Minified {files.Length} HTML files from {before} KB to {after} KB.");
    }
);

Target(
    "build-html-dev",
    dependsOn: ["build-html"]
);

Target(
    "build-img",
    Task () => Task.WhenAll(
        ImageMin("static/img/cover", "_site/assets/img/cover", quality: 90, crop: (0, 512, 2048, 400)),
        ImageMin("static/img/cover", "_site/assets/img/thumb", quality: 80, resize: (800, 0)),
        ImageMin("static/img/cover", "_site/assets/img/social", quality: 80, resize: (1440, 0)),
        ImageMin("static/img/site", "_site/assets/img/site", quality: 90)
    )
);

Target(
    "build-js",
    () =>
    {
        Run("yarn", "tsc");
        Run("yarn", "terser --config-file terserconfig.json --output ./_site/assets/bundle.min.js -- ./_site/assets/bundle.js");
        Run("yarn", "terser --output ./_site/assets/iframe-resizer.min.js -- ./static/iframe-resizer.js");
    }
);

Target(
    "build-cp",
    () =>
    {
        FileSystem.CopyDirectory("./static/fonts", "./_site/assets/fonts", overwrite: true);
        FileSystem.CopyDirectory("./static/img/posts", "./_site/assets/img/posts", overwrite: true);
        File.Copy("./static/giscus-dark.css", "./_site/assets/giscus-dark.css", overwrite: true);
        File.Copy("./static/giscus-light.css", "./_site/assets/giscus-light.css", overwrite: true);
    }
);

Target(
    "build-css",
    dependsOn: (args.Contains("build-html") || args.Contains("build")) ? ["build-html"] : [],
    () =>
    {
        Run("yarn", "sass ./static/bundle.scss ./_site/assets/bundle.css");

        Run(
            "yarn",
            "purgecss" +
            " --safelist my-0 my-1 my-2 my-3 my-4 my-5" +
            " --css _site/assets/bundle.css" +
            " --content _site/**/*.html" +
            " --output ./_site/assets/bundle.min.css"
        );
    }
);

Target(
    "build-search",
    dependsOn: ["build-html"],
    () => Run(
        "yarn", "pagefind" +
                " --site ./_site/" +
                " --output-path ./_site/assets/pagefind/"
    )
);

static long MeasureFileSizesKb(string[] files)
    => files.Sum(x => new FileInfo(x).Length) / 1024;

static Task MinifyHtml(string path)
    => RunAsync(
        "yarn", $"minify-html {path} --output {path}" +
                " --minify-js" +
                " --minify-css" +
                " --keep-input-type-text-attr"
    );

static Task ImageMin(string src, string dst, int quality, (int x, int y, int w, int h) crop = default, (int x, int y) resize = default)
{
    const string o = "--plugin.webp.";
    string args = $"imagemin \"{src}\" --out-dir=\"{dst}\" {o}method=6 {o}quality={quality} {o}autofilter=true";

    if (crop != default)
        args += $" {o}crop.x={crop.x} {o}crop.y={crop.y} {o}crop.width={crop.w} {o}crop.height={crop.h}";

    if (resize != default)
        args += $" {o}resize.width={resize.x} {o}resize.height={resize.y}";

    return RunAsync("yarn", args);
}

await RunTargetsAndExitAsync([..args, "--parallel"]);