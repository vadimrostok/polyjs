/**
сделай фон альбома в зависимости от статуса
*/
define([
        'boilerplate',
        'models/picture',
        'views/picture/icon',
        'libs/require/text!templates/album/album.html',
        'bootstrap'
    ], 
    function(boilerplate, pictureModel, pictureView, albumTmp) {
        if(!data.expandedAlbusViews) {
            data.expandedAlbusViews = [];
        }
        window.de = data.expandedAlbusViews;
        var album = Backbone.View.extend({
            previewsHeight: 0,
            useBigPreviews: null,
            sliderInterval: null,
            previewPicturesCount: 10,
            previewPicturesRendered: 0,
            allPreviewPicturesRendered: false,
            renderedOnce: false,
            attributes: {
                'class': 'album-wrapper'
            },
            events: {
                'click .showDetails': 'showDetails',
                'click .showEdit': 'showEdit',
                'click .delete': 'delete',
                'click .close, .closefield': 'hideDetails',
                'change .files': 'handleFilesAdd',
                'click .upload': function() {this.model.uploadPictures();}
            },
            initialize: function(data) {
                data = data || {};
                if(data.container) {
                    this.container = data.container;
                }
                $(this.el).attr('album_id', this.model.get('id'));
                if(this.model.get('pictures')) {
                    $(this.el).attr('pictures_count', this.model.get('pictures').length);
                } else {
                    $(this.el).attr('pictures_count', 0);
                }
            },
            remove: function() {
                clearInterval(this.sliderInterval);
                this.renderedOnce = false;
                $(this.el).remove();
            },
            render: function(reRenderPictures, detailsMode, useBigPreviews) {
                this.previewPicturesRendered = 0;
                var that = this;
                if(typeof useBigPreviews == 'undefined' && this.useBigPreviews) {
                    useBigPreviews = this.useBigPreviews;
                }
                if(useBigPreviews == true) {
                    var previewHeight = 400;
                    this.useBigPreviews = useBigPreviews;
                } else {
                    useBigPreviews = false;
                    var previewHeight = 100;
                    this.useBigPreviews = useBigPreviews;
                }
                $(this.el).html(_.template(albumTmp, this.model.toJSON()));
                if(!this.renderedOnce && !reRenderPictures && this.container) {
                    this.container.append(this.el);
                }
                $(this.el).find('.album')
                    .removeClass(statusColorClasses.all)
                    .addClass(statusColorClasses[this.model.get('status_id')]);

                data.pictures.views[this.model.get('id')] = {};

                var pictures = this.model.get('pictures');
                if(detailsMode) {
                    var showPicturesCount = pictures.length;
                } else {
                    var showPicturesCount = this.previewPicturesCount;
                }
                if(showPicturesCount >= pictures.length) {
                    this.allPreviewPicturesRendered = true;
                }
                if(pictures && pictures.length > 0) {
                    for(var i = 0; i < showPicturesCount; i++) {
                        if(pictures.at(i)) {
                            data.pictures.views[this.model.get('id')][pictures.at(i).get('id')] = 
                                new pictureView({
                                    model: pictures.at(i), 
                                    container: this.$('.previews')
                                });
                            data.pictures.views[this.model.get('id')][pictures.at(i).get('id')].render(/*use big previews?no*/useBigPreviews);
                            this.previewPicturesRendered++;
                        }
                    }
                }
                this.previewsHeight = (this.previewPicturesRendered/2>>0)*previewHeight;
                if(detailsMode) {
                    this.showDetails();
                } else {
                    $(this.el).find('.previews').css({height: this.previewsHeight + 'px'});
                }
                this.renderedOnce = true;
                
                this.setSlider();
            },
            setSlider: function() {
                var that = this;
                var top, height, pictureHeight;
                var viewPortHeight = 200;
                setTimeout(function() {
                    that.sliderInterval = setInterval(function() {
                        $(that.el).find('.previews').each(function(index, element) {
                            if($(that).hasClass('albumDetails')) {
                                return 1;
                            }
                            top = parseInt($(element).css('top')) || 0;
                            pictureHeight = $(element).find('.picture').outerHeight();
                            height = $(element).innerHeight();
                            if(-top < height - viewPortHeight && height > $(element).parent().height()) {
                                $(element).css({top: top - pictureHeight - 6 + 'px'});
                            } else {
                                $(element).css({top: '0px'});
                            }
                        });
                    }, Math.random()*5000 + 5000);
                }, Math.random()*5000);
            },
            unsetSlider: function() {
                $(this.el).find('.previews').stop(true, true);
                $(this.el).find('.previews').css({top: '0px'});
                clearInterval(this.sliderInterval);
            },
            showDetails: function() {
                for(var i = 0; i < data.expandedAlbusViews.length; i++) {
                    if(data.expandedAlbusViews[i]) {
                        data.albums.views[data.expandedAlbusViews[i]].hideDetails();
                    }
                }
                var scrollTop = $(window).scrollTop() + 50;
                $(this.el)
                    .find('.album')
                        .removeClass('albumIcon')
                        .addClass('albumDetails')
                        .css({top: scrollTop + 'px'})
                    .find('.album-title').hide();
                $(this.el).find('.bground').removeClass('hide');
                if(!this.allPreviewPicturesRendered) {
                    var pictures = this.model.get('pictures');
                    if(pictures && pictures.length > 0) {
                        for(var i = this.previewPicturesCount; i < pictures.length; i++) {
                            if(pictures.at(i)) {
                                data.pictures.views[this.model.get('id')][pictures.at(i).get('id')] = 
                                    new pictureView({
                                        model: pictures.at(i), 
                                        container: this.$('.previews')
                                    });
                                data.pictures.views[this.model.get('id')][pictures.at(i).get('id')].render(this.useBigPreviews);
                            }
                        }
                    }
                    this.allPreviewPicturesRendered = true;
                }
                $(this.el).find('.previews').css({'height': 'auto'});
                this.unsetSlider();
                data.expandedAlbusViews.push(this.model.get('id'));
            },
            hideDetails: function() {
                //this.model.clearToUploadFileList();
                $(this.el)
                    .find('.album')
                        .removeClass('albumDetails')
                        .addClass('albumIcon')
                        .css({top: ''})
                    .find('.album-title').show();
                $(this.el).find('.bground').addClass('hide');
                $(this.el).find('.previews').css({'height': this.previewsHeight + 'px'});
                this.setSlider();
                var index = _.indexOf(data.expandedAlbusViews, this.model.get('id'));
                delete data.expandedAlbusViews[index];
            },
            showEdit: function() { 
                var that = this;
                require(['views/common/popup', 'views/album/edit'], function(popupView, editAlbumView) {
                    var editAlbum = new editAlbumView({model: that.model, view: that});
                    var popup = new popupView({innerView: editAlbum});
                    popup.render();
                });
            },
            handleFilesAdd: function(e) {
                var files = e.target.files; // FileList object
                var filesAddedCount = 0;

                // Loop through the FileList and render image files as thumbnails.
                for (var i = 0, f; f = files[i]; i++) {
                    if (!f.type.match('image.*')) {
                        continue;
                    }
                    filesAddedCount++;
                    this.model.addFileToUpload(f);
                    var reader = new FileReader();
                    // - 1 т.к. fileId инкрементируется ПОСЛЕ использования в качестве индекса в ф-ии addFileToUpload
                    reader.fileId = this.model.fileId - 1;
                    reader.onload = (function(file, parentView, pictureModel, pictureView) {
                        return function(e) {
                            var model = new pictureModel({
                                src: e.target.result,
                                comment: file.name,
                                fileId: this.fileId,
                                albumModel: parentView.model,
                                //не будет обработки src специфичной для картинок с сервера
                                local: true,
                                mode: 'upload-preview'
                            });
                            var view = new pictureView({
                                model: model, 
                                container: parentView.$('.uploaded-files'),
                                parentView: parentView
                            });
                            parentView.model.toUploadFileViews[this.fileId] = view;
                            view.render();
                        };
                    })(f, this, pictureModel, pictureView);
                    reader.readAsDataURL(f);
                }
                if(filesAddedCount > 0) {
                    this.$('.upload').removeClass('hide');
                }
            },
            clearInput: function() {
                this.$('input.files').val(null);
            },
            delete: function() {
                var that = this;
                require(['models/confirm', 'views/common/confirm', 'views/common/notification'], function(confirmModel, confirmView, notification) {
                    var confirmData = new confirmModel({
                        'header': 'Вы уверены?',
                        'body': 'Вы сейчас собираетесь удалить целый альбом.',
                        'negative_text': 'Ой, нет.',
                        'positive_text': 'Да!',
                        'negative': function() {
                            //remove для confirm вызывается автоматически
                        },
                        'positive': function() {
                            that.model.destroy({
                                error: function() {
                                    var ntf = new notification({modelAttrs: {text: 'У Вас недостаточно прав для удаления альбома.'}});
                                    ntf.render();
                                },
                                success: function() {
                                    var ntf = new notification({modelAttrs: {text: 'Альбом удален успешно.'}});
                                    ntf.render();
                                }
                            });
                            that.remove();
                        }
                    });
                    var confirm = new confirmView({model: confirmData});
                });
            }
        });

        return album;
    }
);