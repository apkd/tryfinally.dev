/// <reference path='./instant-page.ts' />
/// <reference path='./gist-embed.ts' />
/// <reference path='./goatcounter.ts' />
/// <reference path='./giscus.ts' />

function InitSpoilers() {
    const spoilers = document.querySelectorAll('.spoiler');
    for (let i = 0, n = spoilers.length; i < n; i++) {
        const element = spoilers[i];
        element.addEventListener('click', () => element.classList.remove('spoiler'));
    }
}

function InitSearch() {
    if (document.querySelector("#pagefind-search-box")) {
        // @ts-ignore
        return new PagefindUI({element: "#pagefind-search-box", bundlePath: "/assets/pagefind/"});
    }
}

InitInstantPage();
InitSpoilers();
InitGistEmbed();
GoatCounterCountHit();
InitGoatCounterEvents();
InitSearch();
InitGiscus();