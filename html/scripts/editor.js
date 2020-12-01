const applicationId = "611F0029";

var ipc = new BroadcastChannel("tellyprompt-ipc");
ipc.onmessage = function(e) {
    //console.log("Message received: ", e.data);

    processMessage(e.data);
}

var presenterHeartbeatTimeout = null;

var lipsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non dolor quis sapien varius lacinia id sed tellus. Mauris feugiat sapien sed elit sollicitudin, viverra tempor justo lacinia. Vestibulum eget tellus ut metus molestie ultricies. Praesent euismod lacus ac purus pellentesque iaculis. Nulla a rhoncus est. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In hac habitasse platea dictumst. Nam finibus consectetur vehicula. Vivamus cursus hendrerit nulla, in suscipit tellus commodo nec. Integer congue sapien et orci accumsan, a varius massa pulvinar. Duis vitae aliquet nisi, ultrices sodales mi. Fusce tincidunt, risus at pretium aliquam, ligula est mollis ipsum, a scelerisque lorem augue ut magna. Donec sem nunc, imperdiet vel placerat in, porta at arcu. Sed dui odio, sollicitudin nec ipsum sodales, posuere ullamcorper enim. Pellentesque sit amet eleifend leo, eget dignissim ex. Sed convallis augue ac augue porta, vel vehicula mauris fermentum.\n\nPellentesque vestibulum elit et nisl fringilla tincidunt. Integer malesuada ullamcorper nibh ut vehicula. Maecenas vitae sodales nisi, a euismod leo. Ut tristique elit at justo eleifend sollicitudin. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis dignissim velit vel lorem mollis iaculis. Aenean sit amet dui lectus. Aliquam ligula felis, dapibus et ex id, fringilla rutrum sapien. Nam erat lectus, lobortis in mattis ac, pretium ultricies elit. Donec vestibulum purus nisi, eu eleifend ipsum consequat vel.\n\nNunc risus mauris, facilisis nec eros nec, lobortis maximus magna. Vestibulum id euismod sem, vitae lacinia velit. Donec rutrum, nunc et mollis dapibus, ex lorem semper velit, at egestas tortor augue quis eros. Etiam non bibendum lorem. Aliquam non facilisis odio. Aliquam eu ex non libero bibendum pulvinar id a turpis. Morbi consequat, metus ac consectetur suscipit, libero quam dictum libero, eu viverra neque lectus eu velit. In quis porttitor lectus, sit amet fringilla tortor. Fusce rutrum nulla at enim ultrices, vel tempor libero placerat. Mauris tempor sodales suscipit. Suspendisse potenti. Proin libero magna, luctus et tempor in, feugiat nec odio. Nam quis odio consectetur, consequat nisl id, malesuada turpis.\n\nDuis a ligula in nunc aliquam eleifend. In hac habitasse platea dictumst. Vivamus nec tempus ex. Ut neque nulla, aliquet in dolor commodo, feugiat imperdiet libero. Nunc suscipit nunc massa. Cras varius ex id mattis mollis. Etiam eu orci ligula. Phasellus finibus ligula et sagittis cursus. Vivamus in orci eget urna sagittis ornare. Phasellus sit amet lobortis ipsum, eu luctus turpis. Aenean eros neque, fermentum vel aliquam quis, tempus sit amet orci. Mauris accumsan, felis eu posuere ultrices, nibh nulla placerat massa, eget rutrum quam metus eu dolor.\n\nAenean laoreet tristique tortor, eget tristique risus. Morbi tempus ac velit vel ultricies. Maecenas eleifend urna quis lorem tempor, ac ultrices lacus accumsan. Duis ut velit nec lorem ornare blandit. Nulla facilisi. Nullam consectetur erat ut venenatis egestas. Duis eu pretium elit, vitae posuere diam. Nunc egestas consectetur tempus. Nam neque orci, porta quis maximus non, placerat nec lectus.";

var editorDirty = false;
var displayScrollPos = 0;

var styles = {
    backgroundColor: "#000000",
    foregroundColor: "cyan",
    eyelineColor: "#7f7f7f",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
    lineHeight: 1.2,
    fontSize: 150.0 / 1920.0,
    eyelineArrowSize: 50,
}

function processMessage(msg) {
    if ("status" in msg) {
        switch (msg.status) {
            case "hb":
                if (presenterHeartbeatTimeout != null) {
                    clearTimeout(presenterHeartbeatTimeout);
                }
                presenterHeartbeatTimeout = setTimeout(function() {
                    presenterHeartbeatTimeout = null;
                    setPresenterClosed();
                }, 500);

                setPresenterOpen();
                break;

            case "getstyles":
                sendAllStyles();
                break;
        }
    }
}

var presenterOpen = "unknown";
presenterHeartbeatTimeout = setTimeout(function() {
    presenterHeartbeatTimeout = null;
    setPresenterClosed();
}, 500);

function setPresenterOpen() {
    if (presenterOpen === true) return;
    presenterOpen = true;

    sendAllStyles();
    sendContent();
}

function setPresenterClosed() {
    if (presenterOpen === false) return;
    presenterOpen = false;


}

function sendAllStyles() {
    ipc.postMessage({
        styles: styles
    })
}

function sendContent() {
    var theText = $("#editor-content").val();
    $("#content")[0].innerText = theText;
    ipc.postMessage({
        content: theText
    });

}

function sendScroll(scrollPercent) {
    ipc.postMessage({
        scroll: scrollPercent
    });
}

function showLoading() {
    $("#editor").hide();
    $("#presenter").hide();
    $("#loading").show();
    $("#navbar .main .btn").removeClass("selected");
}

function showEditor() {
    $("#presenter").hide();
    $("#loading").hide();
    $("#editor").show();
    $("#navbar .main .btn").removeClass("selected");
    $("#navbar .main .btn.editor").addClass("selected");
}

function showPresenter() {
    $("#loading").hide();
    $("#editor").hide();
    $("#presenter").show();
    $("#presenter .scrollcontainer")[0].scrollTop = displayScrollPos;
    $("#navbar .main .btn").removeClass("selected");
    $("#navbar .main .btn.presenter").addClass("selected");
    updateDisplayFontSize();
}

function updateDisplayFontSize() {
    var contentDiv = $("#content");
    var cw = contentDiv[0].offsetWidth;
    var fontSize = styles.fontSize * cw;
    contentDiv.css("fontSize", fontSize + "px");
}

function newDocument(initialText) {
    if (editorDirty) {
        // TODO: ask to save changes
    }

    $("#editor-content").val(initialText);
    sendContent();
    editorDirty = false;
}

$(window).on('resize', function() {
    updateDisplayFontSize();
});

initializeCastApi = function() {
    cast.framework.CastContext.getInstance().setOptions({
        receiverApplicationId: applicationId,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });
};

window['__onGCastApiAvailable'] = function(isAvailable) {
    if (isAvailable) {
        console.log("Cast is available. Initializing library...");
        initializeCastApi();
    }
};

$(document).ready(function() {
    $("#tb-fullscreen").on("click", function() {
        if (presenterOpen) {
            ipc.postMessage({
                cmd: "close"
            });
        } else {
            window.open("presenter.html", "tellyprompt-presenter", "location=no,menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no");
        }

    });

    $("#editor-content").on("change blur input", function(e) {
        editorDirty = true;
        sendContent();
    });

    $("#new").on("click", function() {
        newDocument("");
    });

    $("#new-lipsum").on("click", function() {
        newDocument(lipsumText);
    });

    $("#navbar .main .btn.editor").on("click", function() {
        showEditor();
    });
    $("#navbar .main .btn.presenter").on("click", function() {
        showPresenter();
    });

    $("#presenter .scrollcontainer").on("scroll", function() {
        var scrollPos = this.scrollTop / (this.scrollHeight - this.offsetHeight);
        displayScrollPos = this.scrollTop;
        sendScroll(scrollPos);
    });

    updateDisplayFontSize();
    showEditor();
});