define([
        'boilerplate',
        'libs/require/text!templates/common/popup.html'
    ], 
    function(boilerplate, popupTmp) {
        var popupWin = Backbone.View.extend({
            attributes: {
                'class': 'popup-wrapper'
            },
            events: {
                'click .closefield': 'remove'
            },
            initialize: function(data) {
                if(data['innerView']) {
                    this.innerView = data['innerView'];
                }
                if(!this.model) {
                    this.model = new (Backbone.Model.extend({}));
                }
            },
            render: function() {
                $(this.el).html(_.template(popupTmp, this.model.toJSON()));
                if(this.innerView) {
                    this.innerView.render($(this.el).find('.content'));
                }
                $('#page').append(this.el);
            }
        });

        return popupWin;
    }
);