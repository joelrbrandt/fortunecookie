<?php

// Pass in the uniqueID to delete via $_POST[]

$dbhost = 'localhost';
$dbuser = 'FLVTagger';
$dbpass = 'FLVTagger';
$dbname = 'flvtagger'; // stupid lowercase names!!!???

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die                      ('Error connecting to mysql');

mysql_select_db($dbname);

// TODO: there's gotta be a more elegant and less error-prone 
// way to do this shit ...
$query = sprintf("DELETE FROM FLVTags where uniqueID=%d;",
                 $_POST['uniqueID']);

mysql_query($query, $conn);

mysql_close($conn);
?>

