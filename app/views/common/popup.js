define([
        'boilerplate',
        'libs/require/text!templates/common/popup.html'
    ], 
    function(boilerplate, popupTmp) {
        var popupWin = Backbone.View.extend({
            params: {},
            attributes: {
                'class': 'popup-wrapper'
            },
            events: {
                'click .closefield': 'remove'
            },
            initialize: function(initData) {
                if(initData['innerView']) {
                    this.innerView = initData['innerView'];
                }
            },
            render: function() {
                $(this.el).html(_.template(popupTmp, this.params));
                if(this.innerView) {
                    this.innerView.render($(this.el).find('.content'));
                }
                $('#page').append(this.el);
            }
        });

        return popupWin;
    }
);