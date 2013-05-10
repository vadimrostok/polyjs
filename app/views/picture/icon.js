define([
        'boilerplate',
        'libs/require/text!templates/picture/icon.html'
    ], 
    function(boilerplate, pictureTmp) {
        var picture = Backbone.View.extend({
            events: {
                'click img': 'showPicture',
                'click .closefield': 'remove'
            },
            initialize: function(initData) {
                this.container = initData.container;
                if(initData['parentView']) {
                    this.parentView = initData['parentView'];
                }
            },
            remove: function(e) {
                if(e) {
                    e.stopPropagation();
                }
                if(this.model.mode == 'upload-preview') {
                    if($(this.el).parent().find('.picture').length == 1) {
                        $(this.el).parent().parent().find('.upload').addClass('hide');
                        this.parentView.clearInput();
                    }
                    this.model.trigger('remove:upload-preview');
                }
                $(this.el).remove();
            },
            render: function(useBigPreviews) {
                window.el = this.el;
                var prefix = '';
                if(useBigPreviews == true) {
                    $(this.el).attr('class', 'picture bigPictureIcon');
                    prefix = '400_';
                } else {
                    $(this.el).attr('class', 'picture pictureIcon');
                    prefix = '100_';
                }
                if(this.model.get('isLocal') != true) {
                    this.model.set('icon_prefix', prefix);
                } else {
                    this.model.set('icon_prefix', '');
                    $(this.el).addClass('local_preview');
                }
                $(this.el).html(_.template(pictureTmp, this.model.toJSON()));
                this.container.append(this.el);
            },
            showPicture: function() {
                var albumModel = data.albums.list.get(this.model.get('album_id'));
                var that = this;
                require(['views/common/gallery', 'jqueryui'], function(galleryView) {
                    var gallery = new galleryView({model: albumModel, selectedPictureModel: that.model});
                    gallery.render();
                });
            }
        });

        return picture;
    }
);
