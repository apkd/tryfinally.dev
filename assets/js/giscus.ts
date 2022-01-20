declare let iFrameResize: (options: Record<string, unknown>, selector: string) => void;

function InitGiscus() {
    const GISCUS_SESSION_KEY = 'giscus-session';
    const giscusOrigin = "https://giscus.app";

    const container = document.querySelector('.giscus');

    if (!container)
        return;

    function formatError(message: string) {
        return `[giscus] An error occurred. Error message: "${message}".`;
    }

    // Set up iframe src URL and params
    const url = new URL(location.href);
    let session = url.searchParams.get('giscus');
    const savedSession = localStorage.getItem(GISCUS_SESSION_KEY);
    url.searchParams.delete('giscus');
    const cleanedLocation = url.toString();

    if (session) {
        localStorage.setItem(GISCUS_SESSION_KEY, JSON.stringify(session));
        history.replaceState(undefined, document.title, cleanedLocation);
    } else {
        try {
            session = JSON.parse(savedSession) || '';
        } catch (e) {
            session = '';
            localStorage.removeItem(GISCUS_SESSION_KEY);
            console.warn(`${formatError(e?.message)} Session has been cleared.`);
        }
    }

    const ogDescriptionMeta: any = document.querySelector("meta[property='og:description'], meta[name='description']");
    const params = {
        origin: location.href,
        session: session,
        theme: `${url.origin}/assets/giscus.css`,
        reactionsEnabled: '0',
        emitMetadata: '0',
        repo: 'apkd/tryfinally.dev',
        repoId: 'MDEwOlJlcG9zaXRvcnkzNjg2NjM1ODc=',
        category: 'Discussions',
        categoryId: 'DIC_kwDOFflcI84B_2SB',
        description: ogDescriptionMeta ? ogDescriptionMeta.content : '',
        term: location.pathname.length < 2 ? 'index' : location.pathname.substring(1).replace(/\.\w+$/, '')
    };

    const locale = 'en';
    const src = `${giscusOrigin}/${locale}/widget?${new URLSearchParams(params)}`;

    // Set up iframe element
    const iframeElement = document.createElement('iframe');
    const iframeAttributes = {
        class: 'giscus-frame',
        title: 'Comments',
        scrolling: 'no',
        src,
    };
    Object.entries(iframeAttributes).forEach(([key, value]) =>
        iframeElement.setAttribute(key, value),
    );

    // Insert iframe element
    while (container.firstChild)
        container.firstChild.remove();

    iframeElement.onload = () => {
        iFrameResize({ checkOrigin: [giscusOrigin], resizeFrom: 'child' }, '.giscus-frame');
    }

    container.appendChild(iframeElement);

    // Listen to error messages
    window.addEventListener('message', function (event) {
        let _a;

        if (event.origin !== giscusOrigin)
            return;

        const data = event.data;
        if (!(typeof data === 'object' && ((_a = data === null || data === void 0 ? void 0 : data.giscus) === null || _a === void 0 ? void 0 : _a.error)))
            return;

        const message = data.giscus.error;
        if (message.includes('Bad credentials') || message.includes('Invalid state value')) {
            // Might be because token is expired or other causes
            if (localStorage.getItem(GISCUS_SESSION_KEY) !== null) {
                localStorage.removeItem(GISCUS_SESSION_KEY);
                console.warn(`${formatError(message)} Session has been cleared.`);
                delete params.session;
                iframeElement.src = `${giscusOrigin}/widget?${new URLSearchParams(params)}`; // Force reload
            } else if (!savedSession) {
                console.error(`${formatError(message)} No session is stored initially.`);
            }
        } else if (message.includes('Discussion not found')) {
            console.warn(`[giscus] ${message}. A new discussion will be created if a comment/reaction is submitted.`);
        } else if (message.includes('API rate limit exceeded')) {
            console.warn(formatError(message));
        } else {
            console.error(formatError(message));
        }
    });
}
