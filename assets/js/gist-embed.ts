function getLineNumbers(
    lineRangeString: string,
    totalLines?: number,
): Array<number> {
    const lineNumbers: number[] = [];
    // lineRangeString can be 1,2,3 or 1-4,5
    // Dash supports the range, commas are specfic line numbers
    lineRangeString.split(',').forEach((line: string) => {
        const range = line.split('-');
        const start = parseInt(range[0], 10);
        let end = parseInt(range[1], 10);
        // If this is a range, push the numbers inclusive in that range
        if (range.length === 2) {
            // If this is of the format "7-" with no end range, we set our end range to the totalLines param. totalLines defines how many lines
            // are in the gist
            if (line[line.length - 1] === '-' && totalLines != null) {
                end = totalLines;
            }
            for (let i = start; i <= end; i++) {
                lineNumbers.push(i);
            }
        }
        // If it's just a single line number, push it
        else if (range.length === 1) {
            lineNumbers.push(parseInt(range[0], 10));
        }
    });
    return lineNumbers;
}

function line(element: HTMLElement, lineRangeString: string) {
    const fileLineEls = element.querySelectorAll('.js-file-line');
    const lineNumbers = getLineNumbers(lineRangeString, fileLineEls.length);
    // find all trs containing code lines that don't exist in the line param
    fileLineEls.forEach((lineElement: HTMLElement, index) => {
        // If the line number does not exist in the lines we want to show list, remove it
        if (
            !lineNumbers.includes(index + 1) &&
            lineElement.parentNode != null &&
            lineElement.parentNode.parentNode != null
        ) {
            lineElement.parentNode.parentNode.removeChild(lineElement.parentNode);
        }
    });
}

function highlightLine(element: HTMLElement, lineRangeString: string) {
    const fileLineEls = element.querySelectorAll('.js-file-line');
    const highlightLineNumbers = getLineNumbers(
        lineRangeString,
        fileLineEls.length,
    );

    // we need to set the line-data td to 100% so the highlight expands the whole line
    element.querySelectorAll('td.line-data').forEach((el: HTMLElement) => {
        el.style.width = '100%';
    });

    // find all .js-file-line tds (actual code lines) that match the highlightLines and add the highlight class
    fileLineEls.forEach((el: HTMLElement, index: number) => {
        if (highlightLineNumbers.includes(index + 1)) {
            el.style.backgroundColor = 'rgb(255, 255, 204)';
        }
    });
}

function hideLineNumbers(element: HTMLElement) {
    element.querySelectorAll('.js-line-number').forEach(node => {
        if (node.parentNode != null) {
            node.parentNode.removeChild(node);
        }
    });
}

function hideFooter(element: HTMLElement) {
    element.querySelectorAll('.gist-meta').forEach((node: HTMLElement) => {
        if (node.parentNode != null) {
            node.parentNode.removeChild(node);
        }
    });

    // Get rid of the collapsed border from missing footer
    element.querySelectorAll('.gist-data').forEach((node: HTMLElement) => {
        if (node != null) {
            node.style.borderBottom = '0px';
        }
    });
    element.querySelectorAll('.gist-file').forEach((node: HTMLElement) => {
        if (node != null) {
            node.style.borderBottom = '1px solid #dddddd';
        }
    });
}

function caption(element: HTMLElement, captionValue: string) {
    element.querySelectorAll('table tbody').forEach((node: HTMLElement) => {
        const row = document.createElement('tr');
        const captionTD = document.createElement('td');
        captionTD.style.padding = '10px !important';
        captionTD.style.borderBottom = '10px solid white';
        captionTD.style.backgroundColor = '#f9f9f9';
        captionTD.style.fontWeight = 'bold';
        captionTD.innerHTML = captionValue;

        const spacerTD = document.createElement('td');
        spacerTD.style.backgroundColor = '#f9f9f9';
        spacerTD.style.borderBottom = '10px solid white';

        row.appendChild(spacerTD);
        row.appendChild(captionTD);

        // Shift row to the front of it's children
        node.prepend(row);
    });
}


// Global methods
const GIST_EMBED_GLOBAL_SETTINGS_NAME = 'GistEmbedSettings';
const GIST_EMBED_GLOBAL_SETTINGS_BASE_URL_NAME = 'baseURL';
window[GIST_EMBED_GLOBAL_SETTINGS_NAME] =
    window[GIST_EMBED_GLOBAL_SETTINGS_NAME] || {};

// Keep track of stylesheets added. Only append a new stylesheet if it doesn't exist
const StylesheetURLs: Set<string> = new Set();
// Prefix for fetching via JSONP
const JSONP_CALLBACK_PREFIX: string = '_gistEmbedJSONP_';
// Global counter for each JSONP called so we can append to prefix to create a unique JSONP callback
let _jsonpCallbackIDCounter: number = 0;
// URL prefix to get the JSONP result
// You can sepcify a base url if you'd like
const GIST_URL_PREFIX: string =
    window[GIST_EMBED_GLOBAL_SETTINGS_NAME][
        GIST_EMBED_GLOBAL_SETTINGS_BASE_URL_NAME
        ] || 'https://gist.github.com/';
// The attribute we check on the DOM elements to grab the gist id
const GIST_ID_ATTRIBUTE_NAME: string = 'data-gist-id';
// Attribute used to specify file to fetch during the request in case the gist is multi-file
const GIST_FILE_ATTRIBUTE_NAME: string = 'data-gist-file';

enum MODIFIER_ATTRIBUTES {
    hideLineNumbersAttribute = 'data-gist-hide-line-numbers',
    hideFooterAttribute = 'data-gist-hide-footer',
    captionAttribute = 'data-gist-caption',
    lineAttribute = 'data-gist-line',
    highlightLineAttribute = 'data-gist-highlight-line',
}

const MODIFIER_ATTRIBUTE_NAMES: MODIFIER_ATTRIBUTES[] = [
    MODIFIER_ATTRIBUTES.hideLineNumbersAttribute,
    MODIFIER_ATTRIBUTES.hideFooterAttribute,
    MODIFIER_ATTRIBUTES.captionAttribute,
    MODIFIER_ATTRIBUTES.lineAttribute,
    MODIFIER_ATTRIBUTES.highlightLineAttribute,
];

type GistJSONResponse =
    | {
    div?: string | undefined;
    stylesheet?: string | undefined;
}
    | null
    | undefined;

// init function that runs on page load. Grabs all nodes and fetches JSONP for each and
// swapping the content of the node with the response
function InitGistEmbed() {
    StylesheetURLs.clear();
    Array.from(getAllGistEmbedDOMNodes()).forEach(fetchJSONPForGistEmbedDOMNode);
}

// returns all dom nodes with attribute GIST_ID_ATTRIBUTE_NAME
function getAllGistEmbedDOMNodes(): NodeList {
    return document.querySelectorAll(`[${GIST_ID_ATTRIBUTE_NAME}]`);
}

// creates a unique callback for JSONP
function generateJSONPCallbackPrefix(): string {
    ++_jsonpCallbackIDCounter;
    return `${JSONP_CALLBACK_PREFIX}${_jsonpCallbackIDCounter}`;
}

// Add a stylesheet to the DOM given a http url
function appendStylesheet(stylesheetURL: string) {
    if (!StylesheetURLs.has(stylesheetURL)) {
        StylesheetURLs.add(stylesheetURL);
        const linkEl = document.createElement('link');
        linkEl.setAttribute('href', stylesheetURL);
        linkEl.setAttribute('type', 'text/css');
        linkEl.setAttribute('rel', 'stylesheet');
        document.body.appendChild(linkEl);
    }
}

// Simple getJSONP method that takes a gist id and callback
function getJSONP(
    gistID: string,
    fileName: string | undefined | null,
    callback: (response: GistJSONResponse) => void,
) {
    const callbackName = generateJSONPCallbackPrefix();
    window[callbackName] = callback;

    const scriptEl = document.createElement('script');
    const fileQueryParam =
        fileName != null ? `&file=${encodeURIComponent(fileName)}` : '';
    scriptEl.setAttribute(
        'src',
        `${GIST_URL_PREFIX}${gistID}.json?callback=${callbackName}${fileQueryParam}`,
    );
    document.body.appendChild(scriptEl);
}

// Fetch the JSONP for a given DOM Node
function fetchJSONPForGistEmbedDOMNode(gistDOMNode: HTMLElement) {
    const gistID = gistDOMNode.getAttribute(GIST_ID_ATTRIBUTE_NAME);
    const fileName = gistDOMNode.getAttribute(GIST_FILE_ATTRIBUTE_NAME);
    if (gistID != null && gistID !== '') {
        getJSONP(gistID, fileName, function (response: GistJSONResponse) {
            handleGetJSONPResponse(gistDOMNode, response);
        });
    }
}

function handleGetJSONPResponse(
    gistDOMNode: HTMLElement,
    response: GistJSONResponse,
) {
    if (response == null || response.div == null || response.stylesheet == null) {
        gistDOMNode.innerHTML = 'Error fetching gist';
        return;
    }

    updateDOMNodeWithGistContent(gistDOMNode, response.stylesheet, response.div);
}

// From the JSONP response, add the stylesheet to the DOM and replace the DOM Node contents
function updateDOMNodeWithGistContent(
    gistDOMNode: HTMLElement,
    responseStylesheet: string,
    responseDIV: string,
) {
    appendStylesheet(responseStylesheet);
    // update
    gistDOMNode.innerHTML = responseDIV;
    // Avoid id collision. id is the gistID and we could be embedding multiple on the page
    if (gistDOMNode.children.length) {
        gistDOMNode.children[0].removeAttribute('id');
    }

    modify(gistDOMNode);
}

function modify(gistDOMNode: HTMLElement) {
    MODIFIER_ATTRIBUTE_NAMES.forEach(attribute => {
        const attributeValue = gistDOMNode.getAttribute(attribute);
        if (attributeValue != null && attributeValue !== '') {
            switch (attribute) {
                case 'data-gist-hide-line-numbers':
                    if (attributeValue === 'true') {
                        hideLineNumbers(gistDOMNode);
                    }
                    break;
                case 'data-gist-hide-footer':
                    if (attributeValue === 'true') {
                        hideFooter(gistDOMNode);
                    }
                    break;
                case 'data-gist-caption':
                    caption(gistDOMNode, attributeValue);
                    break;
                case 'data-gist-line':
                    line(gistDOMNode, attributeValue);
                    break;
                case 'data-gist-highlight-line':
                    highlightLine(gistDOMNode, attributeValue);
                    break;
            }
        }
    });
}
