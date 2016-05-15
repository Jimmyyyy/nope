chrome.runtime.sendMessage({method: "deny", loc: location}, function(response) {
    console.log(response);
    if (!response.deny) {
        return;
    }

    var body = document.querySelector("body");
    body.innerHTML = "";
});
