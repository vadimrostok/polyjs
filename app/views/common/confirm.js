define([
        'boilerplate',
        'libs/require/text!templates/common/confirm.html'
    ], 
    function(boilerplate, confirmTmp){
        var confirm = Backbone.View.extend({
            attributes: {
                'class': 'confirm-box'
            },
            events: {
                'click .closefield': 'remove',
                'click .negative': 'negative',
                'click .positive': 'positive'
            },
            initialize: function(initData) {
                this.render();
            },
            render: function() {
                $(this.el).html(_.template(confirmTmp, this.model.toJSON()));
                $('#page').append(this.el);
            },
            negative: function() {
                this.model.get('negative').call(this);
                this.remove();
                return false;
            },
            positive: function() {
                this.model.get('positive').call(this);
                this.remove();
                return false;
            },
        });

        return confirm;
    }
);