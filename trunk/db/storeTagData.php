<?php
// Pass in all parameters via $_POST[], and stores them in database

require_once('dbLibrary.php');

$sql = "INSERT INTO FLVTags (`uniqueID`, `filename`, `authorName`, `eventType`, `eventSubType`, `eventID`, `annotation`, `startTime`, `endTime`) VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?);";
$params = Array($_POST['filename'],
		$_POST['authorName'],
		$_POST['eventType'],
		$_POST['eventSubType'],
		$_POST['eventID'],
		$_POST['annotation'],
		$_POST['startTime'],
		$_POST['endTime']);

echo executeQueryAndReturnJSON($sql, $params);

?>
