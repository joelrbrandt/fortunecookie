<?php 
// dbLibrary.php

/*
 You must create a file called 'dbConnectionInfo.php' that
 looks something like:

     $dbhost = 'localhost';
     $dbuser = 'my_user';
     $dbpass = 'my_pass';
     $dbname = 'my_db';
 */
require_once('dbConnectionInfo.php');

function connectToDb() {
  global $dbhost, $dbuser, $dbpass, $dbname;
  $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  return $dbh;
}

function executeQuery($strStmt, $params) {
  $result = Array();
  try {
    $dbh = connectToDb();
    $stmt = $dbh->prepare($strStmt);
    if ($stmt->execute($params)) {
      $result['success'] = True;
      try {      
	$result['data'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
      } 
      catch(Exception $e) { // wasn't a SELECT statement
	$result['data'] = Array();
      }
    }
    else {
      $result['error'] = "Error executing SQL statement";
      $result['success'] = False;
    }
  }
  catch (Exception $e) {
    $result['error'] = "PDOException: " . $e->getMessage();
    $result['success'] = False;
  }
  $stmt = null;
  $dbh = null;
  return $result;
}

function executeQueryAndReturnJSON($strStmt, $params) {
  return json_encode(executeQuery($strStmt, $params));
}

?>