/*
  * PageAccelerator - A solution to load web pages faster
  * http://github.com/EasyFood/PageAccelerator
  * author: Evandro Leopoldino Goncalves <evandrolgoncalves@gmail.com>
  * http://github.com/EasyFood
  * License: MIT
*/

// a strict-mode, trimmed-down, deobfuscated version of PageAccelerator
function accelerate(beforeLoading: () => void, afterLoading: () => void, onError: () => void) {
    let url = document.location.href;
    let metaKeyIsPressed = false;

    function ajax(url) {
        return new window.Promise(function (resolve, reject) {
            const req = new XMLHttpRequest();
            req.open('GET', url, true);

            req.onload = function () {
                if (req.status >= 200 && req.status < 400) {
                    resolve(req.response);
                    return;
                }

                reject(req.response);
            };

            req.onerror = function () {
                reject(Error('Network error'));
            };

            req.send();
        });
    }

    function updateObject(obj, body) {
        const attrs = body.attributes;

        let i = 0;
        const size = attrs.length;
        for (; i < size; i++) {
            obj.attrs[attrs[i].name] = attrs[i].value;
        }

        return obj;
    }

    function updateHistory(head, body) {
        const obj = updateObject({
            head: head.innerHTML,
            content: body.innerHTML,
            attrs: {}
        }, body);

        window.history.pushState(obj, '', url);
        window.addEventListener('popstate', onPopState.bind(this), false);
    }

    function parseDom(data) {
        const parser = new DOMParser();
        return parser.parseFromString(data, 'text/html');
    }

    function updateBodyAttributes(data) {
        Object.keys(data).forEach(function (key) {
            const value = data[key];
            document.body.setAttribute(key, value);
        });
    }

    function onPopState(event) {
        beforeLoading();

        const data = event.state;

        if (data != null) {
            updateBodyAttributes(data.attrs);
            document.body.innerHTML = data.content;

            const dom = parseDom(data.head);
            document.title = dom.head.querySelector('title').innerText;
        }

        url = window.location.href;
        processPageContent();
        afterLoading();
    }

    function onLoadPage(data) {
        const dom = parseDom(data);
        const head = dom.head;

        const body = dom.body;
        document.body = body;
        document.title = head.querySelector('title').innerText;
        document.querySelector('link[rel="canonical"][href]').outerHTML = head.querySelector('link[rel="canonical"][href]').outerHTML;

        updateHistory(head, body);
        window.scrollTo(0, 0);
        processPageContent();
        afterLoading();
    }

    function onClick(element) {
        beforeLoading();
        url = element.href;
        ajax(url)
            .then(onLoadPage.bind(this))
            .catch(onError);
    }

    function replaceHistory() {
        const body = document.body;
        const obj = updateObject({
            head: document.head.innerHTML,
            content: body.innerHTML,
            attrs: {}
        }, body);

        window.history.replaceState(obj, '', url);
    }

    function addEventListeners() {
        window.addEventListener('keydown', function (event) {
            if (event.metaKey || event.ctrlKey) {
                metaKeyIsPressed = true;
            }
        });

        window.addEventListener('keyup', function (event) {
            if (event.metaKey || event.ctrlKey) {
                metaKeyIsPressed = false;
            }
        });
    }

    function processPageContent() {
        const links = document.querySelectorAll('a:not([data-accelerate="false"]):not([target=_blank])');

        links.forEach((element: any) => {
            if (element.hostname !== window.location.hostname) {
                return;
            }
            if (element.protocol !== window.location.protocol) {
                return;
            }
            if (/#/.test(element.href)) {
                return;
            }

            element.addEventListener('click', function (event) {
                if (!metaKeyIsPressed) {
                    event.preventDefault();
                    onClick(element);
                }
            }, false);
        });
    }

    addEventListeners();
    replaceHistory();
    processPageContent();
}
