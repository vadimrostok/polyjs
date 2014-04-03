define([
        'boilerplate',
    ], 
    function(boilerplate){
        var ConfirmModel = Backbone.Model.extend({
            defaults: {
                'header': 'Подтвердите',
                'negative_text': 'Ой, нет',
                'positive_text': 'Да!'
            },
            'initialize': function() {
                //
            }
        });

        return ConfirmModel;
    }
);