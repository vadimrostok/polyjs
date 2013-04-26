/**
сделай фон альбома в зависимости от статуса
*/
define([
        'boilerplate',
        'views/picture/icon',
        'libs/require/text!templates/album/icon.html'
    ], 
    function(boilerplate, picture, albumTmp){
        var album = Backbone.View.extend({
            attributes: {
                'class': 'album'
            },
            events: {
                //'click .picture img': 'showPicture'
                'click .showDetails': 'showAlbumDetails',
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
                //this.model.on('change', this.render, this);
                this.render();
            },
            render: function(dontAppend) {
                $(this.el).html(_.template(albumTmp, this.model.toJSON()));
                if(!dontAppend && this.container) {
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
            },
            showAlbumDetails: function() {
                var model = this.model;
                var that = this;
                require(['views/album/details'], function(detailsView) {
                    var details = new detailsView({model: model, albumView: that});
                });
            }
        });

        return album;
    }
);