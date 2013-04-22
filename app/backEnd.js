define([
        'boilerplate',
        'views/back/controls'
    ],
    function(boilerplate, appView) {
        //appView: загрузка данный и последующий
        //рендеринг запускаются в конструкторе
        appView = new appView();
        var app = new (function() {
            var debug = true;
            var log = function(obj) {
                if(debug) {
                    console.log(obj);
                }
            }

            var t = this;

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

        window.app = app;

        return app;
    }
);