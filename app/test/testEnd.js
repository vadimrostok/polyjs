var data = {
    albums: {
        //collection
        list: {},
        //views[album_id] == needed view
        views: {}
    },
    pictures: {
        //Модели картинок в данном случе
        //хранятся в модели альбома.
        //views[album_id][picture_id] == needed view
        views: {}
    },
    //Оповещения, которые появляются в правом верхнем углу экрана.
    notifications: {}
};

requirejs.config({
    baseUrl: 'app/',
    paths: {
        //jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
        jquery: 'libs/jquery',
        
        //underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
        //backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',
        //bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/js/bootstrap.min',

        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        bootstrap: 'libs/bootstrap/js/bootstrap.min',

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
        jqueryui: {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        jasmineHtml: {
            deps: ['jasmine'],
            exports: 'jasmine'
        }
    }
});

progressBar(20);

/*
 * Я использовал название boilerplate, тогда я не правильно понял его значение.
 * Время прошло, название boilerplate осталось.
 * Смысл его в том, что в том модуле собраны jQuery, Backbone и Underscore, 
 * которые используются в каждом другом модуле. Подключая boilerplate подключается
 * эта тройка(все 3 инциируют объекты в глобальном объекте).
 * Не лучшая практика, в след. раз исправлюсь.
 */
require([
        'boilerplate',
        'jasmineHtml'
    ],
    function(boilerplate, jasmine) {
        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 1000;

        var htmlReporter = new jasmine.HtmlReporter();

        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function(spec) {
            return htmlReporter.specFilter(spec);
        };
        require(['specs/bootstrap'], function(hz) {
            jasmineEnv.execute();
        });
    }
);