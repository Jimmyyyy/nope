chrome.runtime.sendMessage({method: "deny", loc: location}, function(response) {
    if (!response.deny) {
        return;
    }

    document.open();

    var dom = document.createElement("html");
    var title = document.createElement("title");
    title.innerHTML = "Nope";
    dom.appendChild(title);

    var warning = document.createElement("div");
    warning.className = ".nope-warning";
    warning.innerHTML = "What are you doing? Get back to work!";
    warning.style.margin = "0 auto";
    warning.style.height = "100%";
    dom.appendChild(warning);

    document.appendChild(dom);
    document.close();
});
