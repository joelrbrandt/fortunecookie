<?php
// The filename should be passed in via $_POST['filename']

require_once('dbLibrary.php');

$sql = "SELECT * FROM FLVTags WHERE filename=? ORDER BY startTime;";
$params = Array($_POST['filename']);

echo executeQueryAndReturnJSON($sql, $params);

?>
