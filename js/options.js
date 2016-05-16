window.onload = function() {
    var blocked = document.querySelector(".blocked");
    chrome.storage.local.get("blocked", function(data) {
        var list = document.querySelector(".blocked").value = data.blocked.join('\n');
    });

    document.querySelector(".save").onclick = function() {
        chrome.storage.local.set({"blocked": blocked.value.split('\n')});
    };
};
