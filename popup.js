var chill = document.querySelector(".chill"),
    work  = document.querySelector(".work");
var interval;

function update(data, tabs) {
    clearInterval(interval);

    var loc = document.createElement("a");
    loc.href = tabs[0].url;
    console.log(loc.href);

    if (data.blocked != undefined && (data.blocked.indexOf(loc.hostname) != -1 || data.blocked.indexOf(loc.hostname + loc.pathname) != -1)) {
        document.querySelector(".block.selector").style.display = "none";
    }
    display(data.timeout);
    interval = setInterval(function() {
        display(data);
    }, 500);
}

function display(timeout) {
    var timeLeft = getTimeLeft(timeout);
    if (timeLeft == "-1") {
        chill.style.display = "block";
        work.style.display  = "none";
        return;
    }

    chill.style.display = "none";
    work.style.display = "block";     
    document.querySelector(".timer").innerHTML = timeLeft;
}

function getTimeLeft(timeout) {
    var current = (new Date()).getTime();

    if (timeout != undefined && current <= parseInt(timeout)) {
        var delta = new Date(timeout - current);
        var hours = (delta.getHours() - 19 < 10 ? "0" + (delta.getHours() - 19) : delta.getHours()) - 19, 
            mins  = delta.getMinutes() < 10 ? "0" + delta.getMinutes() : delta.getMinutes(),
            secs  = delta.getSeconds() < 10 ? "0" + delta.getSeconds() : delta.getSeconds();
        return hours + ":" + mins + ":" + secs;     
    }

    return "-1";
}

function start() {
    var selected = document.querySelector(".control.selector > .selected");
    var amount = selected.tagName == "A" ? selected.innerHTML : selected.value;

    var timeout = new Date((new Date()).getTime() + parseInt(amount) * 60000);
    chrome.storage.local.set({
        "timeout": timeout.getTime() 
    }, function() {
        chrome.storage.local.get("timeout", function(data) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                update(data, tabs);
            })
        });
    });
}

function select(selector, el) {
    document.querySelector("." + selector + ".selector > .selected").className = "";
    el.className = "selected";
}

window.onload = function() {
    var selector = document.querySelectorAll(".selector");
    for (var j = 0; j != selector.length; j++) { 
        var children = selector[j].querySelectorAll("a,input");
        for (var i = 0; i != children.length; i++) {
            children[i].onclick = function(s) {
                return function() { 
                    select(s.className.split(" ")[0], this);
                }
            }(selector[j]);
        }
    }

    document.querySelector("button.block").onclick = function() {
        chrome.storage.local.get("blocked", function(data) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                block(data, tabs);
            });
        });
    }

    document.querySelector(".start").onclick = start;
    chrome.storage.local.get(null, function(data) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            update(data, tabs);
        });
    });
};

function block(data, tabs) {
    var loc = document.createElement("a");
    loc.href = tabs[0].url;

    var blocked = data.blocked != undefined ? data.blocked : [];
    switch (document.querySelector(".block.selector > .selected").innerHTML) {
    case "Site":
        blocked.push(loc.hostname);
        break;
    case "Page":
        blocked.push(loc.hostname + loc.pathname);
        break;
    }

    chrome.storage.local.set({"blocked": blocked});
}
