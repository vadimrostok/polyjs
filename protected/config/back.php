<?php
return CMap::mergeArray(
	require_once(dirname(__FILE__) . '/main.php'),
	array(
		'defaultController' => 'controls/admin',
		'components' => array(
			'user' => array(
				'class' => 'BackWebUser',
				'allowAutoLogin' => true,
				'loginUrl' => array('controls/auth'),
			),
			'urlManager' => array(
				'urlFormat' => 'path',
				'showScriptName' => true,
				'rules' => array(
					// REST patterns
					array('rest/list', 		'pattern' => 'rest/<model:\w+>', 			'verb' => 'GET'),
					array('rest/view', 		'pattern' => 'rest/<model:\w+>/<id:\d+>', 	'verb' => 'GET'),
					array('rest/update', 	'pattern' => 'rest/<model:\w+>/<id:\d+>', 	'verb' => 'PUT'),
					array('rest/delete', 	'pattern' => 'rest/<model:\w+>/<id:\d+>', 	'verb' => 'DELETE'),
					array('rest/create', 	'pattern' => 'rest/<model:\w+>', 			'verb' => 'POST'),
				),
			),
		),
	)
);