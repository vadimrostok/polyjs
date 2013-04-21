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
					array('rest/list', 		'pattern' => 'rest/<model:\w+>', 			'verb' => 'GET'),
					array('rest/view', 		'pattern' => 'rest/<model:\w+>/<id:\d+>', 	'verb' => 'GET'),
					array('rest/update', 	'pattern' => 'rest/<model:\w+>/<id:\d+>', 	'verb' => 'PUT'),
					array('rest/delete', 	'pattern' => 'rest/<model:\w+>/<id:\d+>', 	'verb' => 'DELETE'),
					array('rest/create', 	'pattern' => 'rest/<model:\w+>', 			'verb' => 'POST'),
					//other
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
				// use 'site/error' action to display errors
				'errorAction' => 'expose/error',
			),
		),
	)
);