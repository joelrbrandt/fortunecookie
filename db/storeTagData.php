<?php

// Pass in all parameters via $_POST[], and stores them in database

$dbhost = 'localhost';
$dbuser = 'FLVTagger';
$dbpass = 'FLVTagger';
$dbname = 'flvtagger'; // stupid lowercase names!!!???

// SQL database schema:
// 
// Table name: FLVTags
//
// uniqueID:     INTEGER PRIMARY KEY AUTOINCREMENT
// filename:     VARCHAR(100)  (index)
// authorName:   VARCHAR(50)
// eventType:    VARCHAR(50)
// eventSubType: VARCHAR(50)
// eventID:      VARCHAR(20)
// annotation:   TEXT
// startTime:    INTEGER (in seconds relative to beginning of movie) (index)
// endTime:      INTEGER (in seconds relative to beginning of movie) (index)

// CREATE TABLE `flvtagger`.`FLVTags` (
//`uniqueID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
//`filename` VARCHAR( 100 ) NOT NULL ,
//`authorName` VARCHAR( 50 ) NOT NULL ,
//`eventType` VARCHAR( 50 ) NOT NULL ,
//`eventSubType` VARCHAR( 50 ) NOT NULL ,
//`eventID` VARCHAR( 20 ) NOT NULL ,
//`annotation` TEXT NULL ,
//`startTime` INT NOT NULL ,
//`endTime` INT NOT NULL ,
//INDEX ( `filename` , `startTime` , `endTime` )
//) ENGINE = MYISAM 

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die                      ('Error connecting to mysql');

mysql_select_db($dbname);

// cribbed from http://us2.php.net/function.mysql-real-escape-string

// Get rid of slashes due to stooopid magic quotes:
if(get_magic_quotes_gpc()) {
  foreach (array_keys($_POST) as $key) {
    $_POST[$key] = stripslashes($_POST[$key]);
  }
}

// TODO: there's gotta be a more elegant and less error-prone 
// way to do this shit ...
$query = sprintf("INSERT INTO FLVTags (`uniqueID`, `filename`, `authorName`, `eventType`, `eventSubType`, `eventID`, `annotation`, `startTime`, `endTime`) VALUES (null, '%s', '%s', '%s', '%s', '%s', '%s', %d, %d)",
                 mysql_real_escape_string($_POST['filename'], $conn),
                 mysql_real_escape_string($_POST['authorName'], $conn),
                 mysql_real_escape_string($_POST['eventType'], $conn),
                 mysql_real_escape_string($_POST['eventSubType'], $conn),
                 mysql_real_escape_string($_POST['eventID'], $conn),
                 mysql_real_escape_string($_POST['annotation'], $conn),
                 $_POST['startTime'],
                 $_POST['endTime']);

mysql_query($query, $conn);

mysql_close($conn);
?>
