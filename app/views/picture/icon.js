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
                //Надо остановить "всплывание", а то альбом-хост так же удаляется.
                if(e) {
                    e.stopPropagation();
                }
                //Случай для картинки - превью во время загрузки новых изображений.
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
                var prefix = '';
                if(useBigPreviews == true) {
                    $(this.el).attr('class', 'picture bigPictureIcon');
                    prefix = '200_';
                } else {
                    $(this.el).attr('class', 'picture pictureIcon');
                    prefix = '100_';
                }
                //Превью во время загрузки новых изображений: не нужно добавлять префикс.
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
                var id = this.model.get('album_id');
                var albumModel = data.albums.list.get(id);
                if(data.albums.views[id].state == 'icon') {
                    data.albums.views[id].showDetails();
                }
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
