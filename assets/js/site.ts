/// <reference path='./accelerator.ts' />
/// <reference path='./applause-button.ts' />
/// <reference path='./gist-embed.ts' />
/// <reference path='./goatcounter.ts' />
/// <reference path='./giscus.ts' />
/// <reference path='../../node_modules/darkreader/darkreader.js' />
/// <reference types='darkreader' />

function InitSpoilers() {
    let spoilers = document.querySelectorAll('.spoiler');
    for (let i = 0, n = spoilers.length; i < n; i++) {
        let element = spoilers[i];
        element.addEventListener('click', () => element.classList.remove('spoiler'));
    }
}

function InitDarkMode() {
    DarkReader.setFetchMethod(window.fetch);
    DarkReader.auto({brightness: 100, contrast: 107, sepia: 10});
}

function InitAccelerate() {
    accelerate(BeforeAcceleratedPageLoad, AfterAcceleratedPageLoad, ShowNetworkError);

    function BeforeAcceleratedPageLoad() { }

    function AfterAcceleratedPageLoad() {
        InitSpoilers();
        InitGistEmbed();
        InitGiscus();
        InitGoatCounter();
    }

    function ShowNetworkError() {
        let error = document.querySelector('#error-alert');
        error.innerHTML = "<strong>Unable to navigate to page.</strong> I don't mean to shift the blame, but please check your network connection.";
        error.classList.remove('.d-none');
    }
}

InitSpoilers();
InitApplauseButton();
InitGistEmbed();
InitGiscus();
InitDarkMode();
InitAccelerate();
InitGoatCounter();
InitGoatCounterEvents();
