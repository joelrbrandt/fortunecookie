<?php
// The filename should be passed in via $_POST['filename']

require_once('dbLibrary.php');

$sql = "SELECT * FROM tags WHERE filename=? ORDER BY time;";
$params = Array($_POST['filename']);

$result = executeQuery($sql, $params);
if (!$result['success']) {
  die($result['error']);
 }


// Format the time to be in minutes/seconds
function formatTime($timeInSecs) {
  $seconds = (int)($timeInSecs % 60);
  $minutes = (int)($timeInSecs / 60);
    if ($seconds < 10) {
	return '' . $minutes . ':0' . $seconds;
    } else {
	return '' . $minutes . ':' . $seconds;
    }
}

?>

<table class="tags">
<tr>
<td>Time</td>
<td>Type</td>
<td>Tag</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>ID</td>
<td>Attributes</td>
<td>Comment</td>
<td>Researcher</td>
</tr>

<?php
foreach ($result['data'] as $r) {
?>
<tr>
<td><?=formatTime($r['time'])?></td>
		<td><?=htmlspecialchars($r['type'])?></td>
		<td><?=htmlspecialchars($r['tag'])?></td>
<td><input type="button" value="Jump" onClick="gotoSpot(<?=$r['time']?>);"></td>
<td><input type="button" value="Del" onClick="deleteId(<?=$r['id']?>);"></td>
		<td><?=htmlspecialchars($r['id'])?></td>
		<td><?=htmlspecialchars($r['attributes'])?></td>
		<td><?=htmlspecialchars($r['comment'])?></td>
		<td><?=htmlspecialchars($r['researcher'])?></td>
</tr>
<?php
    }
?>

</table>
