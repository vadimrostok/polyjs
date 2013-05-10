<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
	'basePath' => dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name' =>'Flekr',

	// preloading 'log' component
	'preload'=>array('log'),

	// autoloading model and component classes
	'import' => array(
		'application.models.base.*',
		'application.models.*',
		'application.components.*',
		'application.components.controller.*',
		'application.components.user.*',
		'application.helpers.*',
	),

	'modules' => array(
		// uncomment the following to enable the Gii tool
		/*
		'gii'=>array(
			'class'=>'system.gii.GiiModule',
			'password'=>'Enter Your Password Here',
			// If removed, Gii defaults to localhost only. Edit carefully to taste.
			'ipFilters'=>array('127.0.0.1','::1'),
		),
		*/
	),
	'behaviors' => array(
		'runEnd' => array(
			'class' => 'application.behaviors.WebApplicationEndBehavior',
		),
	),
	// application components
	'components' => array(
		'user' => array(
			// enable cookie-based authentication
			'allowAutoLogin' => true,
		),
		'kohanaImageObject' => array(
			'class' => 'application.extensions.image.CImageComponent',
			'driver' => IMAGE_DRIVER,
			'params' => defined(IMAGE_DRIVER_DIRECTORY)? false: array('directory' => IMAGE_DRIVER_DIRECTORY)
        ),
		'db' => array(
			'connectionString' => 'sqlite:' . dirname(__FILE__) . '/../data/' . DB_FILE,
			'enableProfiling' => true,
			'enableParamLogging' => true
		),
		'log' => array(
			'class' => 'CLogRouter',
			'routes' => array(
				/*array(
					'class' => 'CFileLogRoute',
					'levels' => 'error, warning',
				),
				array(
					'class'=>'CWebLogRoute',
				),*/
				'db' => array(
					'class' => 'CWebLogRoute',
					'categories' => 'system.db.CDbCommand',
					'showInFireBug' => true
				)
			),
		),
		'clientScript'=>array(
			'scriptMap'=>array(
				'jquery.js'=>'//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
				'jquery.min.js'=>'//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
			)
		),
	),

	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>array(
		// this is used in contact page
		'adminEmail'=>'vadimrostok@gmail.com',
	),
);