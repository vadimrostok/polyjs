define([
        'boilerplate',
        'models/picture'
    ], 
    function(boilerplate, Picture){
        var PicturesList = Backbone.Collection.extend({
            model: Picture
        });

        return PicturesList;
    }
);