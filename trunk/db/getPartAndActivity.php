<?php
  // The time in seconds should be passed in via $_POST['time']
  // The filename should be passed in via $_POST['filename']

require_once('dbLibrary.php');

$response = Array();

$sql = "SELECT tag FROM tags WHERE filename=? AND type='Activity' AND time <= ? ORDER BY time DESC LIMIT 1;";
$params = Array($_POST['filename'], $_POST['time']);

$result = executeQuery($sql, $params);
if ($result['success']) {
  $response['activity'] = $result['data'][0]['tag'];
 } else {
  $response['activity'] = null;
 }


$sql = "SELECT tag FROM tags WHERE filename=? AND type='Part' AND time <= ? ORDER BY time DESC LIMIT 1;";
$params = Array($_POST['filename'], $_POST['time']);

$result = executeQuery($sql, $params);
if ($result['success']) {
  $response['part'] = $result['data'][0]['tag'];
 } else {
  $response['part'] = null;
 }

echo json_encode($response);