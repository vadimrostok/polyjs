<?php
return CMap::mergeArray(
    require_once(dirname(__FILE__) . '/main.php'),
    array(
        'defaultController' => 'expose/list',
        'components' => array(
            'urlManager' => array(
                'urlFormat' => 'path',
                'showScriptName' => false,
                'rules' => array(
                    // REST patterns
                    array('rest/list',      'pattern' => 'rest/<model:\w+>',            'verb' => 'GET'),
                    array('rest/view',      'pattern' => 'rest/<model:\w+>/<id:\d+>',   'verb' => 'GET'),
                    array('rest/update',    'pattern' => 'rest/<model:\w+>/<id:\d+>',   'verb' => 'PUT'),
                    array('rest/delete',    'pattern' => 'rest/<model:\w+>/<id:\d+>',   'verb' => 'DELETE'),
                    array('rest/create',    'pattern' => 'rest/<model:\w+>',            'verb' => 'POST'),
                    //other
                    'init' => '/',
                    'album-<album_id:\d+>' => 'expose/generateSeoForAlbum/album/<album_id>',
                    'album-<album_id:\d+>/picture-<picture_id:\d+>' => 'expose/generateSeoForPicture/album/<album_id>/picture/<picture_id>',
                    '<controller:\w+>/<id:\d+>' => '<controller>/view',
                    '<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
                    '<controller:\w+>/<action:\w+>' => '<controller>/<action>',
                ),
            ),
            'user' => array(
                'class' => 'FrontWebUser',
                'allowAutoLogin' => true,
                'loginUrl' => array('expose/list'),
            ),
            'errorHandler' => array(
                'errorAction' => 'expose/error',
            ),
        ),
    )
);