<?php

// remove the following lines when in production mode
defined('YII_DEBUG') or define('YII_DEBUG', true);
// specify how many levels of call stack should be shown in each log message
defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL', 3);

$inc = dirname(__FILE__) . '/protected/config/local_inc.php';
require_once($inc);

$yii = dirname(__FILE__) . '/../yii/framework/yii.php';
require_once($yii);

$extendCWebApp = dirname(__FILE__) . '/extendCWebApp.php';
require_once($extendCWebApp);

$config = dirname(__FILE__) . '/protected/config/back.php';
MyYii::createWebApplication($config)->runEnd('back');
