define([
        'boilerplate',
        'models/picture'
    ], 
    function(boilerplate, Picture){
        var PicturesList = Backbone.Collection.extend({
            model: Picture,
            comparator: function(el) {
                return el.get('id')*(-1)
            }
        });

        return PicturesList;
    }
);