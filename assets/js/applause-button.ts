function InitApplauseButton() {
    const API = "https://applause.nocebo.games";
    
    const getClaps = (api, url) =>
        fetch(`${api}/get-claps` + (url ? `?url=${url}` : ""), { headers: { "Content-Type": "text/plain" } })
            .then(response => response.text())
            .then(res => Number(res));
    
    const updateClaps = (api, url) =>
        fetch(`${api}/update-claps` + (url ? `?url=${url}` : ""), {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            }
        });
    
    const formatClaps = claps => claps.toLocaleString("en");
    
    // toggle a CSS class to re-trigger animations
    const toggleClass = (element, cls) => {
        element.classList.remove(cls);
    
        // Force layout reflow
        void element.offsetWidth;
    
        element.classList.add(cls);
    };
    
    class ApplauseButton extends HTMLElement {
        private _connected: any;
        private _countElement: any;
        private _totalClaps: number;
        private _initialClapCount: Promise<unknown>;
        
        connectedCallback() {
            if (this._connected) {
                return;
            }

            this.classList.remove("clap");
            this.classList.remove("clapped");

            this._countElement = this.querySelector(".count");
            this._totalClaps = 0;
    
            // return the initial clap count as a promise
            let initialClapCountResolve;
            this._initialClapCount = new Promise(
                resolve => (initialClapCountResolve = resolve)
            );
    
            this.addEventListener("mousedown", event => {
                if (event.button !== 0) {
                    return;
                }
    
                this.classList.add("clapped");
    
                // trigger the animation
                toggleClass(this, "clap");
    
                // msg server
                this._totalClaps += 1;
                updateClaps(API, this.url);
    
                // increment the clap count after a small pause (to allow the animation to run)
                setTimeout(() => {
                    this._countElement.innerHTML = formatClaps(this._totalClaps);
                }, 250);
            });
    
            getClaps(API, this.url).then(clapCount => {
                this.parentElement.classList.remove("loading");
                initialClapCountResolve(clapCount);
                if (clapCount > 0) {
                    this._countElement.innerHTML = formatClaps(this._totalClaps = clapCount);
                } else {
                    this._countElement.innerHTML = "liek?";
                }
            });
    
            this._connected = true;
        }
    
        get initialClapCount() {
            return this._initialClapCount;
        }
    
        get url() {
            return this.getAttribute("url");
        }
    }
    
    customElements.define("applause-button", ApplauseButton);
}
