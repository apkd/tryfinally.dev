// GoatCounter: https://www.goatcounter.com
// This file (and *only* this file) is released under the ISC license:
// https://opensource.org/licenses/ISC


const [GoatCounterCountHit, InitGoatCounterEvents] = (function () {
    'use strict';

    // Get all data we're going to send off to the counter endpoint.
    const get_data = function (vars) {
        const data = {
            p: (vars.path) as any,
            r: (vars.referrer) as any,
            t: (vars.title) as any,
            e: !!(vars.event),
            s: [window.screen.width, window.screen.height, (window.devicePixelRatio || 1)],
            b: is_bot(),
            q: location.search,
            rnd: "",
        };

        let rcb, pcb, tcb;  // Save callbacks to apply later.
        if (typeof (data.r) === 'function') rcb = data.r
        if (typeof (data.t) === 'function') tcb = data.t
        if (typeof (data.p) === 'function') pcb = data.p

        if (is_empty(data.r)) data.r = document.referrer
        if (is_empty(data.t)) data.t = document.title
        if (is_empty(data.p)) data.p = get_path()

        if (rcb) data.r = rcb(data.r)
        if (tcb) data.t = tcb(data.t)
        if (pcb) data.p = pcb(data.p)
        return data
    };

    // Check if a value is "empty" for the purpose of get_data().
    const is_empty = function (v) {
        return v === null || v === undefined || typeof (v) === 'function'
    }

    // See if this looks like a bot; there is some additional filtering on the
    // backend, but these properties can't be fetched from there.
    const is_bot = function () {
        // Headless browsers are probably a bot.
        const w = window, d = document;
        // @ts-ignore
        if (w.callPhantom || w._phantom || w.phantom)
            return 150
        // @ts-ignore
        if (w.__nightmare)
            return 151
        // @ts-ignore
        if (d.__selenium_unwrapped || d.__webdriver_evaluate || d.__driver_evaluate)
            return 152
        if (navigator.webdriver)
            return 153
        return 0
    }

    // Object to urlencoded string, starting with a ?.
    const urlencode = function (obj) {
        const p = [];
        for (let k in obj)
            if (obj[k] !== '' && obj[k] !== null && obj[k] !== undefined && obj[k] !== false)
                p.push(`${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
        return `?${p.join('&')}`
    };

    // Show a warning in the console.
    const warn = function (msg) {
        if (console && 'warn' in console)
            console.warn(`goatcounter: ${msg}`)
    };

    // Get the endpoint to send requests to.
    const get_endpoint = function () {
        return "https://tryfinally.goatcounter.nocebo.games/count";
    };

    // Get current path.
    const get_path = function () {
        return new URL(document.querySelector<HTMLLinkElement>('link[rel="canonical"][href]').href).pathname;
    }

    // Filter some requests that we (probably) don't want to count.
    const filter = function () {
        // @ts-ignore
        if ('visibilityState' in document && (document.visibilityState === 'prerender' || document.visibilityState === 'hidden'))
            return 'visibilityState'
        if (location !== parent.location)
            return 'frame'
        if (location.hostname.match(/(localhost$|^127\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\.)/))
            return 'localhost'
        if (location.protocol === 'file:')
            return 'localfile'
        if (localStorage && localStorage.getItem('skipgc') === 't')
            return 'disabled with #toggle-goatcounter'
        return false
    };

    // Get URL to send to GoatCounter.
    const make_url = function (vars) {
        const data = get_data(vars || {});
        if (data.p === null)  // null from user callback.
            return
        data.rnd = Math.random().toString(36).substring(2, 7)  // Browsers don't always listen to Cache-Control.

        const endpoint = get_endpoint();
        if (!endpoint)
            return warn('no endpoint found')

        return endpoint + urlencode(data)
    };

    // Count a hit.
    const count = function (vars = {}) {
        const f = filter();
        if (f)
            return warn('not counting because of: ' + f)

        const url = make_url(vars);
        if (!url)
            return warn('not counting because path callback returned null')

        const img = document.createElement('img');
        img.src = url
        img.style.position = 'absolute'  // Affect layout less.
        img.setAttribute('alt', '')
        img.setAttribute('aria-hidden', 'true')

        const rm = function () {
            if (img && img.parentNode) img.parentNode.removeChild(img)
        };
        setTimeout(rm, 10000)  // In case the onload isn't triggered.
        img.addEventListener('load', rm, false)
        document.body.appendChild(img)
    };

    // Track click events.
    const bind_events = function () {
        if (!document.querySelectorAll)  // Just in case someone uses an ancient browser.
            return

        const send = function (elem) {
            return function () {
                count({
                    event: true,
                    path: (elem.dataset.goatcounterClick || elem.name || elem.id || ''),
                    title: (elem.dataset.goatcounterTitle || elem.title || (elem.innerHTML || '').substring(0, 200) || ''),
                    referrer: (elem.dataset.goatcounterReferrer || elem.dataset.goatcounterReferral || ''),
                })
            }
        };

        Array.prototype.slice.call(document.querySelectorAll("*[data-goatcounter-click]")).forEach(function (elem) {
            if (elem.dataset.goatcounterBound)
                return
            const f = send(elem);
            elem.addEventListener('click', f, false)
            elem.addEventListener('auxclick', f, false)  // Middle click.
            elem.dataset.goatcounterBound = 'true'
        })
    };

    // Make it easy to skip your own views.
    if (location.hash === '#toggle-goatcounter') {
        if (localStorage.getItem('skipgc') === 't') {
            localStorage.removeItem('skipgc')
            alert('GoatCounter tracking is now ENABLED in this browser.')
        } else {
            localStorage.setItem('skipgc', 't')
            alert(`GoatCounter tracking is now DISABLED in this browser until ${location} is loaded again.`)
        }
    }
    
    return [count, bind_events];
})();
