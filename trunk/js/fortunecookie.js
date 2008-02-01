// fortunecookie.js
var playerWindow = null

// TODO: this should have some sort of histeresis in case things fail
function executeAfterWindowLoaded(callback, w) {
    if (w && w.document && w.document.isFinishedLoading) {
	callback(w);
    } else {
	setTimeout(function() {executeAfterWindowLoaded(callback, w)}, 100);
    }
}

// callback is a function that will get called after the window
//   -- 1 parameter: the new window
function newWindow(url, name, parameters, callback) {
    if (name == null) {
	name = 'mywindow';
    }
    if (parameters == null) {
	parameters = 'width=200,height=200,resizable=yes';
    }

    var w = window.open(url, name, parameters);

    if (callback != null) {
	executeAfterWindowLoaded(callback,w);
    }

    return w
}

function createPlayerWindow(url) {
    playerWindow = newWindow(url,
			     'playerWindow',
			     'status=no, \
                             toolbar=, \
                             location=no, \
                             menubar=no, \
                             directories=no, \
                             resizable=yes, \
                             scrollbars=no, \
                             height=1280, \
                             width=1024',
			     finishCreatePlayerWindow);
}

function finishCreatePlayerWindow(w) {
    console.log("Opened!")
}

function getFlashMovie(movieName) {
    if (playerWindow != null) {
	if (navigator.appName.indexOf("Microsoft") != -1) {
            return playerWindow[movieName];
	}
	else {
            return playerWindow.document[movieName];
	}
    }
    return null
}

function pauseMovie() {
    getFlashMovie("myScrubber").pauseMovie();
}

function playMovie() {
    getFlashMovie("myScrubber").playMovie();
}

function gotoSpot(timeInSec) {
    getFlashMovie("myScrubber").gotoTime(timeInSec);
}

function displaySpecs() {
    if(playerWindow && playerWindow.mdLoaded) {
	var duration = getFlashMovie("myScrubber").getDuration();
	var current = getFlashMovie("myScrubber").getMovieTime();
        document.getElementById("specs").innerHTML = "Length: " + duration + "<br>Current: " + current;
    }
}


function switchVideo() {
    var targetElement1 = document.getElementById("domain");
    var targetElement2 = document.getElementById("vidName");
    var dom = targetElement1.value;
    var vid = targetElement2.value;
    playerWindow.metadataUnloaded();
    getFlashMovie("myScrubber").setDomain(dom);
    getFlashMovie("myScrubber").setFilename(vid);

}

function leadingZero(nr)
{
    if (nr < 10) nr = "0" + nr;
    return nr;
}
