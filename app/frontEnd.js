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
    notifications: {}
};

requirejs.config({
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
        
        //underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
        //backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',
        //bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/js/bootstrap.min',

        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        bootstrap: 'libs/bootstrap/js/bootstrap.min',

        jqueryui: '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min'
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
        }
    }
});

progressBar(20);

require([
        'boilerplate',
        'views/front/expose',
        'routers/main'
    ],
    function(boilerplate, appView, Workspace) {
        progressBar(50);

        //appView: загрузка данных и последующий
        //рендеринг(по событию загрузки альбомов) запускаются в конструкторе

        appView = new appView();

        var app = new (function() {
            var debug = true;
            this.log = function(obj) {
                if(debug) {
                    console.log(obj);
                }
            }

            this.mainView = appView;

            this.reset = function(vithSync) {
                if(vithSync) {
                    if(data.albums && data.albums.list) {
                        data.albums.list.fetch({success: function() {
                            appView.render();
                        }});
                    } else {
                        log('error occured');
                    }
                } else {
                    appView.render();
                }
            };
            this.getData = function() {return data;};
        });

        window.app = _.extend(window.app, app);


        window.mainRouter = new Workspace();

        Backbone.history.start();

        if(window.mainRouter.nothingWasRouted) {
        	window.mainRouter.navigate('init');
        }

        return app;
    }
);