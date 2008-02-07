// fortunecookie.js
var playerWindow = null

// set in switchVideo()
var videoFileName = null

mouseover = false

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
    w;
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
	updatePartAndActivity(timeInSec);
    }
}

function displaySpecs() {
    if(playerWindow && playerWindow.mdLoaded) {
	var current = getCurrentPositionInSeconds();
	var duration = getMovieDurationInSeconds();
        document.getElementById("specs").innerHTML = "Length: " + duration + "<br>Current: " + current;
    }
}

function updatePartAndActivity(time) {
    $.ajax({
	type: "POST",
	url: "db/getPartAndActivity.php",
	data: "filename=" + videoFileName + "&time=" + time,
	success: function(json){
	    var response = eval("(" + json + ")");
	    setPartButton(response.part);
	    setActivityButton(response.activity);
	}
    });

}

function setPartButton(part) {
    // uncolor all borders
    $.each($(".partbutton"), function () {
	var bordername = getBorderName(this.id);
	$(bordername).css("border", "2px solid white");	
    });
    
    if (part) {
	var bordername = getBorderName(part);
	$(bordername).css("border", "2px solid #ee0000");
    }
}


function setActivityButton(activity) {
    // uncolor all borders
    $.each($(".activitybutton"), function () {
	var bordername = getBorderName(this.id);
	$(bordername).css("border", "2px solid white");	
    });
    
    if (activity) {
	var bordername = getBorderName(activity);
	$(bordername).css("border", "2px solid #ee0000");
    }

}

function updateTime() {
    if (!mouseover) {
	var current = getCurrentPositionInSeconds();
	var duration = getMovieDurationInSeconds();
	if (!current) current = 0;
	if (!duration) duration = 1;
	position = current * 800 / duration;
	$('#time').text('' + formatTime(current) + ' (' + parseInt(current * 100 / duration) + '%)');
	setScrubberValue(parseInt(position));
    } else {
	var current = $('#scrubberDisplay').get(0).value;
	var duration = getMovieDurationInSeconds();
	if (!current) current = 0;
	if (!duration) duration = 1;
	timeinseconds = current * duration / 800;
	$('#time').text('' + formatTime(timeinseconds) + ' (' + parseInt(current * 100 / 800) + '%)');
    }
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
    seconds = parseInt(time % 60);
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

    // Update the table for the current video name:
    videoFileName = $("#vidName").val();
    updateTable();
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


// Redraws the entire table of tags
function updateTable() {
    $("#tagtable_title").html("Existing tags for " + videoFileName);

    $.ajax({
	type: "POST",
	url: "db/fetchTagData.php",
	data: "filename=" + videoFileName,
	success: function(html){
	    $("#tagtable").html(html)
	}
    });
}

// Deletes entry with given ID from the database table
function deleteId(id) {
    var answer = confirm("Really delete tag with id " + id + "?");
    if (answer) {
	$.ajax({
	    type: "POST",
	    url: "db/deleteTagEntry.php",
	    data: "id=" + id,
	    success: function(html){
		updateTable();
	    }
	});
    }
}




// Some buttons with id $foo will have a div surrounding it
// with name $foo_border
function getBorderName(n) {
    return '#' + n + '_border';
}


function storeIntoDB(type, tag, attributes, comment) {
    if (comment == null) {
	comment = '';
    }

    // Optional fields:
    if (!attributes) {
	attributes = '';
    }

    // escape() needed for freeform text, right?
    var researcher = escape($("#researcher").val());
    var time = getCurrentPositionInSeconds();

    $.ajax({
	type: "POST",
	url: "db/storeTagData.php",
	data: "researcher=" + researcher + "&filename=" + videoFileName + "&time=" + time + "&type=" + type + "&tag=" + tag + "&attributes=" + attributes + "&comment=" + escape(comment),
	success: function(html){
	    updateTable();
	}
    });

}


$(document).ready(function() {

    // Set onclick handlers for all button types

    $(".partbutton").click(function() {
	var curPartName = this.id;
	setPartButton(curPartName);
	// Add an entry to the database
	storeIntoDB('Part', curPartName, null, null);
    });
    

    $(".activitybutton").click(function() {
	var curActivityName = this.id
	setActivityButton(curActivityName);
	// Add an entry to the database
	var comment = null;
	if (curActivityName == "Other") {
	    pauseMovie();
	    comment = prompt('Describe the activity:');
	}
	
	storeIntoDB('Activity', curActivityName, null, comment);

	if (curActivityName == "Other") {
	    playMovie();
	}


    });


    $(".eventbutton").click(function() {
	pauseMovie();

	var curEventName = this.id;

	var attributes = null;

	var attrsArray = new Array();

	// Certain special events have attributes that we need to prompt for:
	if (curEventName == "FixBug") {
	    var isLogicError = confirm("Logic error?");
	    var isSyntaxError = confirm("Syntax error?");
	    var isCopyPasteCode = confirm("Code came from copy/paste?");
	    var fixedRightAway = confirm("Fixed (almost) immediately?");
	    var knewRightAway = false;
	    if (!fixedRightAway) {
		knewRightAway = confirm("Knew about it immediately (rather than do something else before realizing bug)?"); 
	    }
	    var isMetaprogrammingError = confirm("Meta-programming error?");

	    if (isLogicError) {
		attrsArray.push("LogicError");
	    }

	    if (isSyntaxError) {
		attrsArray.push("SyntaxError");
	    }

	    if (isCopyPasteCode) {
		attrsArray.push("CopyPasteError");
	    }

	    if (fixedRightAway) {
		attrsArray.push("FixedRightAway");
	    }
	    else {
		if (knewRightAway) {
		    attrsArray.push("KnewRightAwayButFixedLater");
		}
		else {
		    attrsArray.push("FixedLater");
		}
	    }

	    if (isMetaprogrammingError) {
		attrsArray.push("MetaprogrammingError");
	    }

	    attributes = attrsArray.join(',');
	}
	else if (curEventName == "InsertPrintStmt") {
	    var isPreemptive = confirm("Preemptive (before debugging)?");
	    var providesInfo = confirm("Provides info beyond simply 'got here'?");

	    var attrsArray = new Array();
	    if (isPreemptive) {
		attrsArray.push("Preemptive");
	    }
	    if (providesInfo) {
		attrsArray.push("ProvidesInfo");
	    }
	    else {
		attrsArray.push("GotHere");
	    }

	    attributes = attrsArray.join(',');
	}

	comment = prompt('comment:');

	// Add an entry to the database
	storeIntoDB('Event', curEventName, attributes, comment);
	playMovie();
    });


});



$(function() {
    setInterval(updateTime, 250);
});

function updatePartAndActivityCurrent() {
    var current = getCurrentPositionInSeconds();
    updatePartAndActivity(current);
}

$(function() {
    setInterval(updatePartAndActivityCurrent, 5000);
})