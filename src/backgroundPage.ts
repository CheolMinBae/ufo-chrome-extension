import browser from "webextension-polyfill";
import { createTab, waitForLoad } from "./utils/controlTabs";
import {
    attachDebugger,
    enableNetworkEvents,
    enablePageEvents,
} from "./utils/debuggerControl";
import { makeInjectionScripts } from "./utils";
// Listen for messages sent from other parts of the extension
const injectScript = async (tabId: number, scriptString: string) => {
    return new Promise((resolve, reject) => {
        // chrome.tabs.executeScript(
        //     tabId,
        //     //If allFrames true and frameId is set, then the code is inserted in the selected frame and all of its child frames
        //     //THIS ONLY INCLUDES VANILLA IFRAMES - FOR CROSS ORIGIN IFRAMES WE NEED TO HAVE THE SEPARATE ROUTINE BELOW
        //     {
        //         code: scriptString,
        //         allFrames: true,
        //         runAt: "document_idle",
        //     },
        //     //log the script injection so we can see what's happening and resolve the promise
        //     () => {
        //         resolve("");
        //     },
        // );
        browser.scripting.executeScript({
            target: {
                tabId,
                allFrames: true,
            },
            files: [
                "third_party/Rx.min.js",
                "recordingScripts/cssSelectorGenerator.js",
                "recordingScripts/dompath.js",
                "recordingScripts/optimal-select.min.js",
                "recordingScripts/recordReplaySelectorGenerator.js",
                "recordingScripts/recordingEventModel.js",
                "recordingScripts/recordReplayMessenger.js",
                "recordingScripts/keyCodeDictionary.js",
                "recordingScripts/eventsRecorder.js",
            ],
        });
    });
};
const initTab = async (id: number) => {
    const tab = await createTab(
        "https://universe-qa.hyundaicard.com/demo/home",
    );
    if (tab.tabId) {
        await waitForLoad(tab.tabId);
        await attachDebugger(tab.tabId);
        await enableNetworkEvents(tab.tabId);
        await enablePageEvents(tab.tabId);
        const scripts = await makeInjectionScripts();
        injectScript(tab.tabId, scripts);
        adaptListener(id);
    }
};
const adaptListener = (parentTabId: number) => {
    const wrapper = (message: any, sender: any) => {
        // const options = {
        //     async: this.asyncMessageListening,
        //     request,
        //     sender,
        //     sendResponse,
        // };
        console.log("in recordReplayMessenger");
        console.log(message);
        chrome.tabs.sendMessage(parentTabId, {
            fromUniverse: message,
        });
    };
    browser.runtime.onMessage.addListener(wrapper);
};
browser.runtime.onMessage.addListener(
    (request: {
        popupMounted: boolean;
        type: "init" | "record" | "replay";
        currentTabId: number;
    }) => {
        // Log statement if request.popupMounted is true
        // NOTE: this request is sent in `popup/component.tsx`
        const { popupMounted, type, currentTabId } = request;
        console.log(request);
        if (popupMounted) {
            console.log("backgroundPage notified that Popup.tsx has mounted.");
        }
        if (type) {
            switch (type) {
                case "init":
                    console.log("init universe tab");
                    chrome.tabs.query(
                        {
                            active: true,
                            currentWindow: true,
                        },
                        (tabs) => {
                            initTab(tabs[0].id as number);
                        },
                    );
                    break;
                case "record":
                    break;
                default:
                    break;
            }
        }
    },
);
