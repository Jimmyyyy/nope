var chill = document.querySelector(".chill"),
    work  = document.querySelector(".work");
var interval;

function update(data) {
    clearInterval(interval);

    if (data.blocked != undefined && (data.blocked.indexOf(location.hostname) != -1 || data.blocked.indexOf(location.hostname + location.pathname) != -1)) {
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
        chrome.storage.local.get("timeout", update);
    });
}

function select(selector, el) {
    console.log(selector);
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
        chrome.storage.local.get("blocked", block);
    }

    document.querySelector(".start").onclick = start;
    chrome.storage.local.get(null, update);
};

function block(data) {
    var blocked = data.blocked != undefined ? data.blocked : [];
    switch (document.querySelector(".block.selector > .selected").innerHTML) {
    case "Site":
        blocked.push(location.hostname);
        break;
    case "Page":
        blocked.push(location.hostname + location.pathname);
        break;
    }

    chrome.storage.local.set({"blocked": blocked});
}
