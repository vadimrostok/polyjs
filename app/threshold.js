var URLS = {
	'base': '/flekr/back.php'
};
var data = {
	albums: {
		list: {},
		views: {}
	},
	pictures: {
		//Модели картинок в данном случе
		//хранятся в модели альбома.
		views: {}
	}
};
requirejs.config({
	paths: {
		jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
		underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
		backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',
		bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/js/bootstrap.min'
	},
	shim: {
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		underscore: {
			exports: '_'
		}
	}
});

require(
	['backEnd'], 
	function(App){
		//
	}
);