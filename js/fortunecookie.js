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
    if(playerWindow && playerWindow.mdLoaded) {
	getFlashMovie("myScrubber").gotoTime(timeInSec);
    }
}

function displaySpecs() {
    if(playerWindow && playerWindow.mdLoaded) {
	var current = getCurrentPositionInSeconds();
	var duration = getMovieDurationInSeconds();
        document.getElementById("specs").innerHTML = "Length: " + duration + "<br>Current: " + current;
    }
}

function updateTime() {
    var current = getCurrentPositionInSeconds();
    var duration = getMovieDurationInSeconds();
    if (!current) current = 0;
    if (!duration) duration = 1;
    position = current * 800 / duration;
    $('#time').text('' + formatTime(current) + ' (' + parseInt(current * 100 / duration) + '%)');
    setScrubberValue(parseInt(position));
}

function getCurrentPositionInSeconds() {
    if(playerWindow && playerWindow.mdLoaded) {
	return getFlashMovie("myScrubber").getMovieTime();
    } else {
	return null;
    }
}

function getMovieDurationInSeconds() {
    if(playerWindow && playerWindow.mdLoaded) {
	return getFlashMovie("myScrubber").getDuration();
    } else {
	return null;
    }
}

function formatTime(time) {
    seconds = time % 60;
    minutes = parseInt(time / 60);
    if (seconds < 10) {
	return '' + minutes + ':0' + seconds;
    } else {
	return '' + minutes + ':' + seconds;
    }
}

function switchVideoButton() {
    var targetElement1 = document.getElementById("domain");
    var targetElement2 = document.getElementById("vidName");
    var dom = targetElement1.value;
    var vid = targetElement2.value;
    switchVideo(dom, vid);
}

function switchVideo(domain, filename) {
    playerWindow.metadataUnloaded();
    getFlashMovie("myScrubber").setDomain(domain);
    getFlashMovie("myScrubber").setFilename(filename);
}

function onScrubberChange(value, slider) {
    // calculate the time in seconds to scrub to
    var duration = getMovieDurationInSeconds();
    if (!duration) duration = 0;
    time = duration * value / 800;
    gotoSpot(parseInt(time));
    updateTime();
}

// initialize the slider when the page is ready
$(function() {
    initializeSlider($('#scrubber').get(0), $('#scrubberDisplay').get(0));
    setSliderChangeCallback(onScrubberChange);
    setScrubberValue(0);
 });


function setScrubberValue(v) {
    $('#scrubberDisplay').get(0).value = v;
    updateSliderToMatchDisplay($('#scrubber').get(0), $('#scrubberDisplay').get(0));
}

function getScrubberValue() {
    return $('#scrubberDisplay').get(0).value;
}

function leadingZero(nr)
{
    if (nr < 10) nr = "0" + nr;
    return nr;
}

$(function() {
    setInterval(updateTime, 250);
});