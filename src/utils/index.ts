import axios from "axios";

export const makeInjectionScripts = (): Promise<string> => {
    const recordingScriptsArray = [
        "third_party/Rx.min.js",
        "recordingScripts/cssSelectorGenerator.js",
        "recordingScripts/dompath.js",
        "recordingScripts/optimal-select.min.js",
        "recordingScripts/recordReplaySelectorGenerator.js",
        "recordingScripts/recordingEventModel.js",
        "recordingScripts/recordReplayMessenger.js",
        "recordingScripts/keyCodeDictionary.js",
        "recordingScripts/eventsRecorder.js",
    ];
    const fetchFile = (url: string) => {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((res) => {
                    res.text()
                        .then((data) => {
                            resolve(data);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                })
                .catch((e) => {
                    reject(e);
                });
        });
    };
    return new Promise((resolve, reject) => {
        const fetcherList: any[] = recordingScriptsArray.map(
            (script: string) => {
                const url = chrome.runtime.getURL(script);
                return fetchFile.bind(url);
            },
        );
        Promise.all(fetcherList).then((res) => {
            const scripts = res.reduce(
                (previousScriptText, currentScriptText) =>
                    previousScriptText + "\n\n" + currentScriptText,
            );
            resolve(scripts);
        });
    });
};
