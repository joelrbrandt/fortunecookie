<?php
// Pass in the uniqueID to delete via $_POST[]

require_once('dbLibrary.php');
$result = Array();

try {
  $dbh = connectToDb();
  $stmt = $dbh->prepare("DELETE FROM FLVTags where uniqueID=?");
  if ($stmt->execute(Array($_POST['uniqueID']))) {
        $result['success'] = True;
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

echo json_encode($result);

?>

