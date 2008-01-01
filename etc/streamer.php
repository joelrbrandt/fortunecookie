<?php
/*
 Modified from:

	xmoov-php 0.9
	Development version 0.9.3 beta
		
	by: Eric Lorenzo Benjamin jr. webmaster (AT) xmoov (DOT) com
	originally inspired by Stefan Richter at flashcomguru.com
	bandwidth limiting by Terry streamingflvcom (AT) dedicatedmanagers (DOT) com
		
	This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License.
	For more information, visit http://creativecommons.org/licenses/by-nc-sa/3.0/
	For the full license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/legalcode 
	or send a letter to Creative Commons, 543 Howard Street, 5th Floor, San Francisco, California, 94105, USA.
		
*/

if (!isset($_GET['filename']) || !isset($_GET['position'])) {
  die('<b>ERROR:</b> must specify filename and position as GET parameters.');
 }

$filename = $_GET['filename'];
$position = $_GET['position'];

if (get_magic_quotes_gpc()) {
  $filename = stripslashes($filename);
  $position = stripslashes($position);
 }

// make sure the position is an integer
if (eregi('[^0-9]', $position)) {
  die ('<b>ERROR:</b> position argument must be an integer (byte offset)');
 }

// check if the filename is actually a .flv file in the same directory as the PHP file
if(strrchr($filename, '.') == '.flv' && 
   (strpos($filename, '/') === false) && 
   (strpos($filename, '\\') === false) &&
   file_exists($filename)) {

	$fh = fopen($filename, 'rb') or die ('<b>ERROR:</b> could not open (' . $filename . ')');

	$filesize = filesize($filename) - (($position > 0) ? $position  + 1 : 0);

	// prohibit caching (different methods for different clients)
	session_cache_limiter("nocache");
	header("Expires: Thu, 19 Nov 1981 08:52:00 GMT");
	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
	header("Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0");
	header("Pragma: no-cache");
	
	// content headers
	header("Content-Type: video/x-flv");
	header("Content-Disposition: attachment; filename=\"" . $filename . "\"");
	header("Content-Length: " . $filesize);

	// FLV file format header
	if($position != 0) 
	  {
	    print('FLV');
	    print(pack('C', 1));
	    print(pack('C', 1));
	    print(pack('N', 9));
	    print(pack('N', 9));
	  }

	// seek to requested file position
	fseek($fh, $position);
	
	while(!feof($fh)) {
	  print(fread($fh, 65536));
	  flush();
	  // TODO: put in some bandwidth limiting?
	} 

 }
 else {
   die('<b>ERROR:</b> file does not exist, or is not a flash video file in the same directory as streamer.php (' . $filename . ')');
 }
?>
