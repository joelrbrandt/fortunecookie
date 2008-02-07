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

<table border=1>
<tr>
<td>id</td>
<td>time</td>
<td>type</td>
<td>tag</td>
<td>attributes</td>
<td>comments</td>
<td>&nbsp;</td>
</tr>

<?php
foreach ($result['data'] as $r) {
?>
<tr>
<td><?=$r['id']?></td>
<td><?=$r['time']?></td>
<td><?=$r['type']?></td>
<td><?=$r['tag']?></td>
<td><?=$r['attributes']?></td>
<td><?=$r['comments']?></td>
<td><input type="button" value="J" onClick="gotoSpot(<?=$r['time']?>);">&nbsp<input type="button" value="D" onClick="deleteId(<?=$r['id']?>);"></td>
</tr>
<?php
    }
?>

</table>