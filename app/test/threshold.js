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
	baseUrl: 'app/',
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
        backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',
        bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/js/bootstrap.min',
        jqueryui: '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min',
        specs: 'test/specs',
        jasmine: 'test/lib/jasmine/jasmine',
        jasmineHtml: 'test/lib/jasmine/jasmine-html'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        /*jasmine: {
        	deps: ['jasmineHtml'],
            exports: 'jasmine'
        },*/
        jasmineHtml: {
        	deps: ['jasmine'],
            exports: 'jasmine'
        }
    }
});

require([
	    'boilerplate',
	    'jasmineHtml'
    ], 
    function(boilerplate, jasmine){
    	var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 1000;

        var htmlReporter = new jasmine.HtmlReporter();

        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function(spec) {
            return htmlReporter.specFilter(spec);
        };
        require(['specs/bootstrap'], function(hz) {
        	jasmineEnv.execute();
        })
    }
);