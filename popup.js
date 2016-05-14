var chill = document.querySelector(".chill"),
    work  = document.querySelector(".work");

var interval;

function update(data) {
    display(data);
    interval = setInterval(function() {
        display(data);
    }, 500);
}

function display(data) {
    var timeLeft = getTimeLeft(data);
    if (timeLeft == "-1") {
        chill.style.display = "block";
        work.style.display  = "none";
        return;
    }

    chill.style.display = "none";
    work.style.display = "block";     
    document.querySelector(".timer").innerHTML = timeLeft;
}

function getTimeLeft(data) {
    var timeout = data.timeout;
    var current = (new Date()).getTime();

    if (timeout != undefined && current <= parseInt(timeout)) {
        var delta = new Date(timeout - current);
        var hours = (delta.getHours() < 10 ? "0" + delta.getHours() : delta.getHours()) - 19, 
            mins  = delta.getMinutes() < 10 ? "0" + delta.getMinutes() : delta.getMinutes(),
            secs  = delta.getSeconds() < 10 ? "0" + delta.getSeconds() : delta.getSeconds();
        return hours + ":" + mins + ":" + secs;     
    }

    return "-1";
}

function start() {
    var selected = document.querySelector(".selected");
    var amount = selected.tagName == "A" ? selected.innerHTML : selected.value;

    var timeout = new Date((new Date()).getTime() + parseInt(amount) * 60000);
    chrome.storage.local.set({
        "timeout": timeout.getTime() 
    }, function() {
        chrome.storage.local.get("timeout", update);
    });
}

function select(el) {
    document.querySelector(".selected").className = "";
    el.className = "selected";
}

window.onload = function() {
    var amount = document.querySelectorAll(".control > a,input");
    for (var i = 0; i != amount.length; i++) {
        amount[i].onclick = function() {
            select(this);
        }
    }

    document.querySelector(".start").onclick = start;
    chrome.storage.local.get("timeout", update);
};
