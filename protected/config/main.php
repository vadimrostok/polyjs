<?php
return array(
    'basePath' => dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
    'name' =>'Shepi',

    'preload'=>array('log'),

    'import' => array(
        'application.models.base.*',
        'application.models.*',
        'application.components.*',
        'application.components.controller.*',
        'application.components.user.*',
        'application.helpers.*',
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
                /*
                array(
                    'class' => 'CFileLogRoute',
                    'levels' => 'error, warning',
                ),
                array(
                    'class'=>'CWebLogRoute',
                ),
                'db' => array(
                    'class' => 'CWebLogRoute',
                    'categories' => 'system.db.CDbCommand',
                    'showInFireBug' => true
                )
                */
            ),
        ),
        'clientScript'=>array(
            'scriptMap'=>array(
                'jquery.js'=>'//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
                'jquery.min.js'=>'//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
            )
        ),
    ),
    'params'=>array(
        'adminEmail'=>'vadimrostok@gmail.com',
    ),
);