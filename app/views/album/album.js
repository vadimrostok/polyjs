define([
        'boilerplate',
        'models/picture',
        'views/picture/icon',
        'libs/require/text!templates/album/album.html',
        'bootstrap',
        'jqueryui'
    ], 
    function(boilerplate, pictureModel, pictureView, albumTmp) {
        //Тут хранится последний раскрытый альбом. Для того, чтоб этот альбом 
        //закрылся, если юзер откроет новый нольбом не закрывая этот.
        if(!data.expandedAlbumView) {
            data.expandedAlbumView = false;
        }
        var album = Backbone.View.extend({
            //"Состяние" альбома, может быть в виде иконки и в развернутом виде.
            state: 'icon',
            //Высота блока со всем превьюшками.
            previewsHeight: 0,
            useBigPreviews: null,
            sliderInterval: null,
            //Для альбома в виде иконки сколько рендерить првьюшек?
            previewPicturesCount: 4,
            //А сколько вышло? А то может быть в альбоме меньше 4-и картинок.
            previewPicturesRendered: 0,
            //Выставляется после раскрытия альбома или если в альбоме меньше 4-и превьюшек.
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
                'mouseout .album-title': 'runSlider',
                'click .upload': function() {this.model.uploadPictures();},
                'click .saveOrder': 'saveOrder'
            },
            initialize: function(data) {
                data = data || {};
                if(data.container) {
                    this.container = data.container;
                }
                $(this.el).attr('album_id', this.model.get('id'));
                //К модели альбома прикреплены все можели его изображений.
                if(this.model.get('pictures')) {
                    $(this.el).attr('pictures_count', this.model.get('pictures').length);
                } else {
                    $(this.el).attr('pictures_count', 0);
                }
            },
            remove: function() {
                if(app.is_admin) {
                    $(this.el).find('.previews').sortable('destroy');
                }
                clearInterval(this.sliderInterval);
                this.renderedOnce = false;
                $(this.el).remove();
            },
            render: function(reRenderPictures, detailsMode, useBigPreviews) {
                this.previewPicturesRendered = 0;
                var id = this.model.get('id');

                //Размер иконок может быть предустановлен в админке.
                this.useBigPreviews = useBigPreviews = this.model.resolvePreviewsSize(this.useBigPreviews, useBigPreviews);
                $(this.el).html(_.template(albumTmp, this.model.toJSON()));
                if(!this.renderedOnce && !reRenderPictures && this.container) {
                    this.container.append(this.el);
                }
                //Это для админки разноцветные фоны у альбомов. 
                //Цвет фона в зависимости от статуса.
                $(this.el).find('.album')
                    .removeClass(statusColorClasses.all)
                    .addClass(statusColorClasses[this.model.get('status_id')]);

                data.pictures.views[id] = {};

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
                            data.pictures.views[id][pictures.at(i).get('id')] = 
                                new pictureView({
                                    model: pictures.at(i), 
                                    container: this.$('.previews')
                                });
                            data.pictures.views[id][pictures.at(i).get('id')].render(useBigPreviews);
                            this.previewPicturesRendered++;
                        }
                    }
                }
                this.previewsHeight = (this.previewPicturesRendered/2>>0)*this.model.previewHeight;
                if(detailsMode) {
                    this.showDetails();
                } else {
                    $(this.el).find('.previews').css({height: this.previewsHeight + 'px'});
                }
                this.renderedOnce = true;

                if(app.is_admin) {
                    $(this.el).find('.previews').sortable();
                }
            },
            /*
             * Не спеша спролистаем превьюшки в альбоме-иконке.
             */
            sliderAnimationUnComplete: 0,
            runSlider: function() {
                var that = this;
                var top, height, pictureHeight;
                var viewPortHeight = 200;
                //Эффект непредсказуемости.
                if(Math.random() > 0.5 || this.sliderAnimationUnComplete > 0) {
                    return true;
                }
                that.sliderAnimationUnComplete++;
                
                $(this.el).find('.previews').stop(true, true);
                //Эффект непредсказуемости в квадрате.
                setTimeout(function() {
                    var element = $(that.el).find('.previews');
                    top = parseInt($(element).css('top')) || 0;
                    pictureHeight = $(element).find('.picture').outerHeight();
                    height = $(element).innerHeight();

                    if($(that).hasClass('albumDetails')) {
                        return 1;
                    }

                    if(-top < height - viewPortHeight && height > $(element).parent().height()) {
                        $(element).stop(true, true).animate({top: top - pictureHeight - 6 + 'px'}, 1000, function() {
                            that.sliderAnimationUnComplete--;
                        });
                    } else {
                        $(element).stop(true, true).animate({top: '0px'}, 1500, function() {
                            that.sliderAnimationUnComplete--;
                        });
                    }
                }, Math.random()*5000);
            },
            unsetSlider: function() {
                $(this.el).find('.previews').stop(true, true);
                $(this.el).find('.previews').css({top: '0px'});
                clearInterval(this.sliderInterval);
            },
            /*
             * Разворачивает альбом. Из иконки в попап.
             */
            showDetails: function() {
                var id = this.model.get('id');
                if(data.expandedAlbumView) {
                    data.expandedAlbumView.hideDetails();
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
                                data.pictures.views[id][pictures.at(i).get('id')] = 
                                    new pictureView({
                                        model: pictures.at(i), 
                                        container: this.$('.previews')
                                    });
                                data.pictures.views[id][pictures.at(i).get('id')].render(this.useBigPreviews);
                            }
                        }
                    }
                    this.allPreviewPicturesRendered = true;
                }
                $(this.el).find('.previews').css({'height': 'auto'});
                this.unsetSlider();
                data.expandedAlbumView = this;
                window.mainRouter.navigate('album-' + id);
                this.state = 'details';
            },
            /*
             * Соответственно сворачивает. Из попапа в иконку.
             */
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
                window.mainRouter.navigate('init');
                this.state = 'icon';
            },
            /*
             * Отобразить вьюшку редактирования альбома.
             */
            showEdit: function() { 
                var that = this;
                require(['views/common/popup', 'views/album/edit'], function(popupView, editAlbumView) {
                    var editAlbum = new editAlbumView({model: that.model, view: that});
                    var popup = new popupView({innerView: editAlbum});
                    popup.render();
                });
            },
            handleFilesAdd: function(e) {
                var filesAddedCount = this.model.handleFilesAdd(e, this);
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
            },
            /**
             * Сохраняет порядок изображений.
             */
            saveOrder: function() {
                var ids = $(this.el).find('.previews').sortable('toArray', {attribute: 'item_id'});
                $.post(URLS.saveOrder, {ids: ids}, function() {
                    var ntf = new notification({modelAttrs: {text: 'Порядок изображений сохранен успешно.'}});
                    ntf.render();
                });
            }
        });

        return album;
    }
);