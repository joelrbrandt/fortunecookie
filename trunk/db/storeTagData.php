<?php
// Pass in all parameters via $_POST[], and stores them in database

require_once('dbLibrary.php');

$sql = "INSERT INTO tags (`id`, `researcher`, `filename`, `time`, `type`, `tag`, `attributes`, `comment`) VALUES (null, ?, ?, ?, ?, ?, ?, ?);";
$params = Array($_POST['researcher'],
		$_POST['filename'],
		$_POST['time'],
		$_POST['type'],
		$_POST['tag'],
		$_POST['attributes'],
		$_POST['comment']);

echo executeQueryAndReturnJSON($sql, $params);

?>
