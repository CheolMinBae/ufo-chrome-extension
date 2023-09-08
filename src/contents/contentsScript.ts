import browser from "webextension-polyfill";

const init = () => {
    const article = document.querySelector("#article .buttons");
    console.log(article);
    if (article) {
        const button = document.createElement("Button");
        const videoIcon = document.createElement("UilVideo");
        button.classList.add("ant-btn");
        button.classList.add("ant-btn-secondary");
        button.classList.add("ant-btn-sm");
        button.classList.add("sc-iHbSHJ");
        button.classList.add("dBTPGj");
        button.setAttribute("type", "primary");
        button.appendChild(videoIcon);
        button.textContent = "녹화 시작";
        button.onclick = () => {
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
    console.log("in contents scripts");
    console.log(message);
    window.postMessage(message, "*");
});
