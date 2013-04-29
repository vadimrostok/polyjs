define([
        'boilerplate',
        'libs/require/text!templates/picture/icon.html'
    ], 
    function(boilerplate, pictureTmp) {
        var picture = Backbone.View.extend({
            events: {
                'click img': 'showPicture'
            },
            initialize: function(data) {
                this.container = data.container;
            },
            render: function(useBigPreviews) {
                if(useBigPreviews == true) {
                    $(this.el).attr('class', 'picture bigPictureIcon');
                    this.model.set('icon_prefix', '400_');
                } else {
                    $(this.el).attr('class', 'picture pictureIcon');
                    this.model.set('icon_prefix', '100_');
                }
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