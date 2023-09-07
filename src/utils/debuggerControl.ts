export const attachDebugger = (tabID: number) => {
    return new Promise((resolve, reject) => {
        chrome.debugger.attach({ tabId: tabID }, "1.3");
        resolve("");
    });
};

export const enableNetworkEvents = (tabID: number) => {
    return new Promise((resolve, reject) => {
        chrome.debugger.sendCommand(
            { tabId: tabID },
            "Network.enable",
            {},
            function (response) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                    return;
                }
                resolve(response);
            },
        );
    });
};

export const enablePageEvents = (tabID: number) => {
    return new Promise((resolve, reject) => {
        chrome.debugger.sendCommand(
            { tabId: tabID },
            "Page.enable",
            {},
            function (response) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                    return;
                }
                resolve(response);
            },
        );
    });
};
