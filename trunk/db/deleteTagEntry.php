<?php
// Pass in the uniqueID to delete via $_POST[]

require_once('dbLibrary.php');
$result = Array();

try {
  $dbh = connectToDb();
  $stmt = $dbh->prepare("DELETE FROM tags where id=?");
  if ($stmt->execute(Array($_POST['id']))) {
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

