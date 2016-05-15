chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if (req.method != "deny") 
        return false;

    chrome.storage.local.get(null, function(data) {
        if (data.timeout == undefined || data.timeout <= (new Date()).getTime()) {
            sendResponse({deny: false});
            return;
        }

        if (data.blocked == undefined) {
            sendResponse({deny: false});
            return;
        }

        if (data.blocked.indexOf(req.loc.hostname) == -1 && data.blocked.indexOf(req.loc.hostname + req.loc.pathname) == -1) {
            sendResponse({deny: false});
            return;
        }

        sendResponse({deny: true});
    });

    return true;
});
