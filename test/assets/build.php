<?php
require 'lessc.inc.php';
$less = new lessc();
$less->setImportDir( array(__DIR__) );
//$less->setFormatter("compressed");
$less->setPreserveComments(true);

//echo $less->compileFile(JPATH_SITE . '/media/com_acctexp/less/test.less');exit;

$less->compileFile( __DIR__."/build.less", __DIR__.'/../../select2-bootstrap.css' );
?>
