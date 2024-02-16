chrome.action.onClicked.addListener(async (tab) => {
    const url = tab.url;
    const prName = extractPullRequestName(url);

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: setPagePullRequestName,
        args: [prName]
    });
});

function setPagePullRequestName(prName) {
    const prNameDom = document.querySelector('input[id^="formField"]');
    if (prNameDom && prName !== "") {
        prNameDom.value = prName;
    }
}

function extractPullRequestName(url) {
    const regex = /refs\/heads\/([^/]+)\/...\/refs\/heads\/feature\/([^/]+)\/(.+)\?/;
    const matches = url.match(regex);

    if (matches && matches.length === 4) {
        const [_, baseBranch, feature, serviceName] = matches;

        return `[${baseBranch}][${feature}] ${serviceName.replace(/-/g, ' ')}`;
    }

    return "";
}