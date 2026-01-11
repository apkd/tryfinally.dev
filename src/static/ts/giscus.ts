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
    } else if (savedSession) {
        try {
            session = JSON.parse(savedSession);
        } catch (e) {
            localStorage.removeItem(GISCUS_SESSION_KEY);
            console.warn(`${formatError(e?.message)} Session has been cleared.`);
        }
    }

    const ogDescriptionMeta: any = document.querySelector("meta[property='og:description'], meta[name='description']");
    let term = location.pathname.length < 2 ? 'index' : location.pathname.substring(1);
    if (!term.startsWith("."))
        term = term.replace(/\.\w+$/, '');
    const params = {
        origin: location.href,
        session: session,
        theme: `https://tryfinally.dev/assets/giscus-dark.css`,
        reactionsEnabled: '0',
        emitMetadata: '0',
        repo: 'apkd/tryfinally.dev',
        repoId: 'MDEwOlJlcG9zaXRvcnkzNjg2NjM1ODc=',
        category: 'Discussions',
        categoryId: 'DIC_kwDOFflcI84B_2SB',
        loading: 'lazy',
        description: ogDescriptionMeta ? ogDescriptionMeta.content : '',
        term: term
    };

    const locale = 'en';
    const src = `${giscusOrigin}/${locale}/widget?${new URLSearchParams(params)}`;
    const loading = 'lazy';

    // Set up iframe element
    const iframeElement = document.createElement('iframe');
    const iframeAttributes = {
        class: 'giscus-frame',
        title: 'Comments',
        scrolling: 'no',
        src,
        loading
    };
    Object.entries(iframeAttributes).forEach(([key, value]) =>
        iframeElement.setAttribute(key, value),
    );

    // Insert iframe element
    while (container.firstChild)
        container.firstChild.remove();

    container.appendChild(iframeElement);
    const suggestion = `Please consider reporting this error at https://github.com/giscus/giscus/issues/new.`;

    // Listen to messages
    window.addEventListener('message', (event) => {
        if (event.origin !== giscusOrigin) return;

        const {data} = event;
        if (!(typeof data === 'object' && data.giscus)) return;

        if (data.giscus.resizeHeight) {
            iframeElement.style.height = `${data.giscus.resizeHeight}px`;
        }

        if (!data.giscus.error) return;

        const message: string = data.giscus.error;

        if (message.includes('Bad credentials') || message.includes('Invalid state value') || message.includes('State has expired')) {
            localStorage.removeItem(GISCUS_SESSION_KEY);
            console.warn(`${formatError(message)} Session has been cleared.`);
            delete params.session;
            iframeElement.src = `${giscusOrigin}/widget?${new URLSearchParams(params)}`; // Force reload
        } else if (message.includes('Discussion not found')) {
            console.warn(
                `[giscus] ${message}. A new discussion will be created if a comment/reaction is submitted.`,
            );
        } else if (message.includes('API rate limit exceeded')) {
            console.warn(formatError(message));
        } else {
            console.error(`${formatError(message)} ${suggestion}`);
        }
    });
}