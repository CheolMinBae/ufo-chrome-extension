import browser from "webextension-polyfill";

const init = () => {
    const article = document.querySelector("#article > .buttons");
    console.log(article);
    if (article) {
        const button = document.createElement("button");
        button.classList.add("record-button");
        button.textContent = "녹화 on";
        button.onclick = () => {
            console.log("begin recording button");
            // const devTools: any = chrome.devtools;
            // console.log(devTools);
            // chrome.runtime.sendMessage({ type: "begin-recording" });
            // chrome.tabs.getCurrent((tab: any) => {

            // });
            browser.runtime.sendMessage({
                type: "init",
            });
        };
        article.appendChild(button);
    }
};
const observeUrlChange = () => {
    let oldHref = document.location.href;
    const body = document.querySelector("body") as HTMLBodyElement;
    const observer = new MutationObserver((mutations) => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;
            /* Changed ! your code here */
            console.log("in changed");
            init();
        }
    });
    observer.observe(body, { childList: true, subtree: true });
};

window.addEventListener("load", function () {
    //실행될 코드
    console.log("on load");
    observeUrlChange();
});

chrome.runtime.onMessage.addListener((message: any, sender: any) => {
    console.log(message);
});
