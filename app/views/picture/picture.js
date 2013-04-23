define([
        'boilerplate',
        'libs/require/text!templates/picture/picture_icon.html'
    ], 
    function(boilerplate, pictureTmp) {
        var picture = Backbone.View.extend({
            attributes: {
                'class': 'picture'
            },
            initialize: function(data) {
                if(data.container) {
                    this.container = data.container;
                }
                this.model.set('src', URLS['picBase'] + this.model.get('src'));
                this.model.on('change', this.render, this);
                this.render();
            },
            render: function() {
                $(this.el).html(_.template(pictureTmp, this.model.toJSON()));
                if(this.container) {
                    this.container.append(this.el);
                }
            }
        });

        return picture;
    }
);