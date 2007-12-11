<?php

// The filename should be passed in via $_GET[]

$dbhost = 'localhost';
$dbuser = 'FLVTagger';
$dbpass = 'FLVTagger';
$dbname = 'flvtagger'; // stupid lowercase names!!!???

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die                      ('Error connecting to mysql');

mysql_select_db($dbname);

// TODO: there's gotta be a more elegant and less error-prone 
// way to do this shit ...
//
// sort by startTime
$query = sprintf("SELECT * FROM FLVTags WHERE filename='%s' ORDER BY startTime;", mysql_real_escape_string($_GET['filename'], $conn));

$result = mysql_query($query, $conn);

$all_tag_entries = array();
while ($row = mysql_fetch_assoc($result)) {
  $all_tag_entries[] = $row;
}

// let's try some json action
echo json_encode($all_tag_entries);

mysql_close($conn);
?>

