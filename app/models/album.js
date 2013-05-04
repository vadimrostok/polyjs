define([
        'boilerplate',
        'collections/pictures',
    ], 
    function(boilerplate, PicturesList){
        var AlbumModel = Backbone.Model.extend({
            urlRoot: URLS.base + '/rest/album',
            defaults: {
                'title': ''
            },
            initialize: function(initData) {
                if(initData.pictures) {
                    var pictures = new PicturesList(initData.pictures, {add: function() {alert(1);}});
                    this.set('pictures', pictures);
                    this.set('pictures_count', pictures.length);
                } else {
                    this.unset('pictures');
                    this.set('pictures_count', 0);
                }
                this.set('status_text', setatusTexts[this.get('status_id')]);
            },
            validate: function(attrs) {
                if(!_.isString(attrs.title)) {
                    return {field: 'title', text: 'Название альбома должно быть строкой'};
                } else if(attrs.title.replace(' ', '').length < 3) {
                    return {field: 'title', text: 'Длина названия альбома должна быть не менее 3-х символов'};
                }
            }
        });

        return AlbumModel;
    }
);