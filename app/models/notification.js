define([
        'boilerplate',
    ], 
    function(boilerplate){
        var NotificationModel = Backbone.Model.extend({
            defaults: {
                'title': 'Оповещение',
                'duration': 1500
            },
            'initialize': function() {
                //
            }
        });

        return NotificationModel;
    }
);