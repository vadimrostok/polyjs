define([
        'boilerplate',
        'models/picture'
    ], 
    function(boilerplate, Picture){
        var PicturesList = Backbone.Collection.extend({
            model: Picture,
            comparator: function(el) {
                if(el.get('position') > 0) {
                    return parseInt(el.get('position'));
                } else {
                    return el.get('id');
                }
            }
        });

        return PicturesList;
    }
);