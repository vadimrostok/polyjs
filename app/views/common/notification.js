var notificationsCounter = 0;
var notifications = {};
define([
        'jquery',
        'underscore',
        'backbone',
        'models/notification',
        'libs/require/text!templates/common/notification.html'
    ], 
    function($, _, Backbone, notificationModel, notificationTmp) {
        var notificationWin = Backbone.View.extend({
            padding: 40,
            notificationId: null,
            isShowing: false,
            timeoutObject: false,
            attributes: {
                'class': 'notification'
            },
            events: {
                'click .closefield, .close': 'remove'
            },
            initialize: function(initData) {
                if(initData['view']) {
                    this.useView = true;
                    this.view = initData['view'];
                }
                if(initData['modelAttrs']) {
                    this.createModel(initData['modelAttrs']);
                }
                this.notificationId = notificationsCounter++;
                notifications[this.notificationId] = this;
            },
            remove: function() {
                //если есть другие оповещения то их надо поднять повыше
                for(var i = 0; i <= notificationsCounter; i++) {
                    if(i < this.notificationId && notifications[i]) {
                        notifications[i].heft($(this.el).height() + this.padding);
                    }
                }
                delete notifications[this.notificationId];
                $(this.el).remove();
                this.isShowing = false;
            },
            render: function() {
                if(this.useView) {
                    this.createModel({});
                    $(this.el).html(_.template(notificationTmp, this.model.toJSON()));
                    this.view.render($(this.el).find('.modal-body'));
                } else {
                    $(this.el).html(_.template(notificationTmp, this.model.toJSON()));
                }
                
                $('#page').append(this.el);

                for(var i = 0; i <= notificationsCounter; i++) {
                    if(i < this.notificationId && notifications[i]) {
                        notifications[i].sink($(this.el).height() + this.padding);
                    }
                }

                this.isShowing = true;
                var that = this;
                this.timeoutObject = setTimeout(function() {
                    //а может уже крестиком remove-нули?
                    if(notifications[that.notificationId]) {
                        that.remove();
                    }
                }, this.model.get('duration'));
            },
            sink: function(px) {
                $(this.el).css({top: $(this.el).offset().top + px + 'px'});
            },
            heft: function(px) {
                $(this.el).css({top: $(this.el).offset().top - px + 'px'});
                //console.log('helt ' + px);
            },
            createModel: function(initData) {
                if(!initData) {
                    initData = {};
                }
                this.model = new notificationModel(initData);
            }
        });

        return notificationWin;
    }
);