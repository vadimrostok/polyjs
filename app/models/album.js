define([
        'boilerplate',
        'collections/picturesCollection',
    ], 
    function(boilerplate, PicturesList){
        var AlbumModel = Backbone.Model.extend({
            'urlRoot': URLS.base + '/rest/album',
            'defaults': {
                'title': ''
            },
            'initialize': function(initData) {
                if(initData.pictures) {
                    this.set('pictures', new PicturesList(initData.pictures));
                } else {
                    this.unset('pictures')
                }
            },
            'validate': function(attrs) {
                if(!_.isString(attrs.title)) {
                    return {title: 'Название альбома должно быть строкой'};
                } else if(attrs.title.replace(' ', '').length < 3) {
                    return {title: 'Длина названия альбома должна быть не менее 3-х символов'};
                }
            }
        });

        return AlbumModel;
    }
);