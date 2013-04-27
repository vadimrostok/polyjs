define([
        'boilerplate',
        'models/notification',
        'libs/require/text!templates/common/notification.html'
    ], 
    function(boilerplate, notificationModel, notificationTmp) {
        var notificationWin = Backbone.View.extend({
            isShowing: false,
            timeoutObject: false,
            attributes: {
                'class': 'notification-wrapper'
            },
            events: {
                'click .closefield': 'remove'
            },
            initialize: function(data) {
                if(data['view']) {
                    this.useView = true;
                    this.view = data['view'];
                }
            },
            remove: function() {
                $(this.el).remove();
                this.isShowing = false;
            },
            render: function() {
                if(this.useView) {
                    this.model = new notificationModel({text: ''});
                    $(this.el).html(_.template(notificationTmp, this.model.toJSON()));
                    this.view.render($(this.el).find('.modal-body'));
                } else {
                    $(this.el).html(_.template(notificationTmp, this.model.toJSON()));
                }
                
                $('#page').append(this.el);
                this.isShowing = true;
                var that = this;
                this.timeoutObject = setTimeout(function() {
                    that.remove();
                }, this.model.get('duration'));
            }
        });

        return notificationWin;
    }
);