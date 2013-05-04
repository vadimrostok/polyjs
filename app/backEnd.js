define([
        'boilerplate',
        'views/back/controls'
    ],
    function(boilerplate, appView) {
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

        return app;
    }
);