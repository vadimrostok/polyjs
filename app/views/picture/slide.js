define([
        'boilerplate',
        'libs/require/text!templates/picture/slide.html'
    ], 
    function(boilerplate, pictureTmp) {
        var picture = Backbone.View.extend({
            attributes: {
                'class': 'picture'
            },
            initialize: function(data) {
                this.model.setSizes();
                $(this.el).attr('prefix', this.model.get('prefix'));
                $(this.el).attr('item_id', this.model.get('id'));
                
                $(this.el).html(_.template(pictureTmp, this.model.toJSON()));

                this.container = data.container;

                this.preload();
            },
            render: function() {

                $(this.el).find('img').on('load', function() {
                    $('.picture-loading-text').addClass('hide');
                });

                if(this.container.find('.picture-wrapper')) {
                    this.container.find('.picture-wrapper').append(this.el);
                } else {
                    this.container.append(this.el);
                }

                $(this.el).find('img').css({'max-height': $(window).height() - 10 + 'px'});

                window.mainRouter.navigate('album-' + this.model.get('album_id') + '/picture-' + this.model.get('id'));
            },
            /**
             * Этих действий достаточно, бразуер начнет загружать изображение и, когда загрузит, поместит его в кэш.
             */
            preload: function() {
                var image = new Image();
                image.src = this.model.get('client_path') + this.model.get('prefix') + this.model.get('filename');
            }
        });

        return picture;
    }
);