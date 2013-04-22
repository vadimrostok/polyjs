define([
        'boilerplate',
        'views/picture/picture',
        'libs/text!templates/album/album_icon.html'
    ], 
    function(boilerplate, picture, albumTmp){
        var album = Backbone.View.extend({
            attributes: {
                'class': 'album'
            },
            initialize: function(data) {
                if(data.container) {
                    this.container = data.container;
                }
                $(this.el).attr('album_id', this.model.get('id'));
                if(this.model.get('pictures')) {
                    $(this.el).attr('pictures_count', this.model.get('pictures').length);   
                } else {
                    $(this.el).attr('pictures_count', 0);
                }
                this.model.on('change', this.render, this);
                this.render();
            },
            render: function() {
                $(this.el).html(_.template(albumTmp, this.model.toJSON()));
                if(this.container) {
                    this.container.append(this.el);
                }
                data.pictures.views[this.model.get('id')] = {};

                var pictures = this.model.get('pictures');
                if(pictures) {
                    for(var i = 0; i < 4; i++) {
                        if(pictures.at(i)) {
                            data.pictures.views[this.model.get('id')][pictures.at(i).get('id')] = 
                                new picture({
                                    model: pictures.at(i), 
                                    container: this.$('.previews')
                                });
                        }
                    }
                }
            }
        });

        return album;
    }
);