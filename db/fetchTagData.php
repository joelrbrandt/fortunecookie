<?php
// The filename should be passed in via $_POST['filename']

require_once('dbLibrary.php');

$sql = "SELECT * FROM tags WHERE filename=? ORDER BY time;";
$params = Array($_POST['filename']);

$result = executeQuery($sql, $params);
if (!$result['success']) {
  die($result['error']);
 }


?>

<table border=0>
<tr>
<td>Time</td>
<td>Type</td>
<td>Tag</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>ID</td>
<td>Attributes</td>
<td>Comments</td>
</tr>

<?php
foreach ($result['data'] as $r) {
?>
<tr>
<td><?=$r['time']?></td>
<td><?=$r['type']?></td>
<td><?=$r['tag']?></td>
<td><input type="button" value="Jump" onClick="gotoSpot(<?=$r['time']?>);"></td>
<td><input type="button" value="Del" onClick="deleteId(<?=$r['id']?>);"></td>
<td><?=$r['id']?></td>
<td><?=$r['attributes']?></td>
<td><?=$r['comments']?></td>
</tr>
<?php
    }
?>

</table>
