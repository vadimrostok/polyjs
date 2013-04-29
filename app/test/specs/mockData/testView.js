define([
        'boilerplate',
        'libs/require/text!test/specs/mockData/testViewTmp.html'
    ], 
    function(boilerplate, viewTmp){
        var testView = Backbone.View.extend({
            id: 'testView',
            initialize: function(data) {
                if(data && data['container']) {
                    this.container = data['container'];
                }
            },
            render: function(container, params) {
                if(!params) {
                    var params = {text: 'test view'};
                }
                this.$el.html(_.template(viewTmp, params));
                if(this.container) {
                    this.container.append(this.el);
                } else if(container) {
                    container.append(this.el);
                } else {
                    $('#page').append(this.el);  
                }
            },
        });

        return testView;
    }
);