function executeAfterWindowLoaded(callback, window) {
    if (window.document.isFinishedLoading) {
	callback(window);
    } else {
	setTimeout(function() {executeAfterWindowLoaded(callback, window)}, 100);
    }
}


function newWindow() {
    var w = window.open('externalwindow_2.html', 'myWindow', 'width=200,height=200,resizable=yes');
    executeAfterWindowLoaded(function(window) {
	$("#putstuffhere", window.document).append("<p>here is a paragraph</p>")
    },w);
}