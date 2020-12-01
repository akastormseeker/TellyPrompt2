//var ipc = new BroadcastChannel("tellyprompt-ipc");
/*
ipc.onmessage = function(e) {

    if ("content" in e.data) {
        $("#content")[0].innerText = e.data.content;
    }
    if ("cmd" in e.data) {
        switch (e.data.cmd) {
            case "close":
                closeWindow();
        }
    }
    if ("scroll" in e.data) {
        doScroll(e.data.scroll);
    }
    if ("styles" in e.data) {
        console.log(e.data);
        updateStyles(e.data.styles);
    }
}
*/

var styles = {
    fontSize: 150.0 / 1920.0,
};

setInterval(function() {
    //ipc.postMessage({
    //    status: "hb"
    //});
}, 300);

$(window).on("close", function(e) {
    //ipc.postMessage({
    //    status: "closed"
    //});
});

function updateStyles(newStyles) {
    if ("backgroundColor" in newStyles) {
        styles.backgroundColor = newStyles.backgroundColor;
        $("#presenter .gridcontainer").css({ backgroundColor: styles.backgroundColor });
    }
    if ("foregroundColor" in newStyles) {
        styles.foregroundColor = newStyles.foregroundColor;
        $("#content").css({ color: styles.foregroundColor });
    }
    if ("eyelineColor" in newStyles) {
        styles.eyelineColor = newStyles.eyelineColor;
        $("#eyeline").css({ backgroundColor: styles.eyelineColor, fill: styles.eyelineColor });
    }
    if ("fontFamily" in newStyles) {
        styles.fontFamily = newStyles.fontFamily;
        $("#content").css({ fontFamily: styles.fontFamily });
    }
    if ("lineHeight" in newStyles) {
        styles.lineHeight = newStyles.lineHeight;
        $("#content").css({ lineHeight: styles.lineHeight });
    }
    if ("fontSize" in newStyles) {
        styles.fontSize = newStyles.fontSize;
        updateDisplayFontSize();
    }
    if ("eyelineArrowSize" in newStyles) {
        styles.eyelineArrowSize = newStyles.eyelineArrowSize;
        var size = styles.eyelineArrowSize;
        if (size > 100) size = 100;
        if (size < 0) size = 0;
        size = 100 - size;
        var margin = -size + "px";
        $("#eyeline .leftarrow").css({ marginLeft: margin });
        $("#eyeline .rightarrow").css({ marginRight: margin });
    }
}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

function closeWindow() {
    window.close('', '_parent', '');
}

var scrollContainer = null;
//var scrollPos = 0.0;
function doScroll(scrollPercent) {
    //scrollPos = scrollPercent;
    if (scrollContainer == null) return;

    scrollContainer.scrollTop = (scrollContainer.scrollHeight - scrollContainer.offsetHeight) * scrollPercent;
}

function updateDisplayFontSize() {
    var contentDiv = $("#content");
    var cw = contentDiv[0].offsetWidth;
    var fontSize = styles.fontSize * cw;
    contentDiv.css("fontSize", fontSize + "px");
}

$(window).on('resize', function() {
    updateDisplayFontSize();
});

/*
$(document).ready(function() {
        scrollContainer = $("#presenter .scrollcontainer")[0];

        
        $("#fullscreen").on("click", function(e) {
            if (document.fullscreenElement != null) {
                exitFullscreen();
            } else {
                console.log("attempting fullscreen...");
                openFullscreen(document.documentElement);
            }
        });
        $("#close").on("click", function(e) {
            closeWindow();
        });

        ipc.postMessage({
            status: "ready"
        });
    })
    .on("fullscreenchange", function() {
        $("body").toggleClass("fullscreen", document.fullscreenElement != null);
    });
*/