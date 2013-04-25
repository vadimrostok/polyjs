<?php
if(defined(YII_DEBUG)) {
	error_reporting(1);
	//error_reporting(E_ALL ^E_NOTICE ^E_WARNING);
} else {
	error_reporting(E_ALL);
}

date_default_timezone_set('Europe/Kiev');

defined('IMAGE_DRIVER') or define('IMAGE_DRIVER', 'ImageMagick');
defined('IMAGE_DRIVER_DIRECTORY') or define('IMAGE_DRIVER_DIRECTORY', 'C:\Program Files (x86)\ImageMagick-6.8.4-Q16');