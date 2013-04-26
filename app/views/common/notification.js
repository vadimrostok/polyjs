define([
        'boilerplate',
        'libs/require/text!templates/common/notification.html'
    ], 
    function(boilerplate, notificationTmp) {
        var notificationWin = Backbone.View.extend({
            timeoutObject: false,
            attributes: {
                'class': 'notification-wrapper'
            },
            events: {
                'click .closefield': 'remove'
            },
            initialize: function(data) {
                //
            },
            render: function() {
                $(this.el).html(_.template(notificationTmp, this.model.toJSON()));
                $('#page').append(this.el);
                var that = this;
                this.timeoutObject = setTimeout(function() {
                    that.remove();
                }, this.model.get('duration'));
            }
        });

        return notificationWin;
    }
);