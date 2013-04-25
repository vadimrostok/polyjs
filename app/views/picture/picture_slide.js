define([
        'boilerplate',
        'libs/require/text!templates/picture/picture_slide.html'
    ], 
    function(boilerplate, pictureTmp) {
        var picture = Backbone.View.extend({
            attributes: {
                'class': 'picture'
            },
            initialize: function(data) {
                this.container = data.container;
            },
            render: function() {
                this.model.setSizes();
                $(this.el).attr('prefix', this.model.get('prefix'));
                $(this.el).attr('item_id', this.model.get('id'));
                $(this.el).html(_.template(pictureTmp, this.model.toJSON()));
                if(this.container.find('.picture-viewport')) {
                    this.container.find('.picture-viewport').append(this.el);
                } else {
                    this.container.append(this.el);
                }

                $(this.el).find('img').css({'max-height': $(window).height() - 10 + 'px'});
                
                app.log('picture_slide render')
            },
        });

        return picture;
    }
);