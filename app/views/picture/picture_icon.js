define([
        'boilerplate',
        'libs/require/text!templates/picture/picture_icon.html'
    ], 
    function(boilerplate, pictureTmp) {
        var picture = Backbone.View.extend({
            attributes: {
                'class': 'picture'
            },
            events: {
                'click img': 'showPicture'
            },
            initialize: function(data) {
                this.container = data.container;
                //this.model.on('change', this.render, this);
                this.render();
            },
            render: function() {
                $(this.el).html(_.template(pictureTmp, this.model.toJSON()));
                this.container.append(this.el);
            },
            showPicture: function() {
                var albumModel = data.albums.list.get(this.model.get('album_id'));
                var that = this;
                require(['views/common/gallery', 'jqueryui'], function(galleryView) {
                    var gallery = new galleryView({model: albumModel, selectedPictureModel: that.model});
                });
            }
        });

        return picture;
    }
);