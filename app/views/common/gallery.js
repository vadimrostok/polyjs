
define([
        'boilerplate',
        'views/picture/slide',
        'libs/require/text!templates/common/gallery.html',
        'libs/require/text!templates/common/pictureCloudInfo.html',
        'bootstrap'
    ], 
    function(boilerplate, pictureSlideView, galleryTmp, pictureCloudInfoTmp) {
        /**
         * Управление галереей клавишами.
         */
        var handleKeyPressForGallsery = function(e) {
            var keyCode = e.keyCode;
            // 40 down
            // 39 right
            // 38 up
            // 37 left
            // 13 enter
            // 27 escape
            if(window.currentGallery) {
                switch(keyCode) {
                    case 27:
                        window.currentGallery.remove();
                        break;
                    case 39:
                        window.currentGallery.move(1, true);
                        break;
                    case 37:
                        window.currentGallery.move(-1, true);
                        break;
                }
            }
        }
        $(document).on('keyup', handleKeyPressForGallsery);

        var gallery = Backbone.View.extend({
            commentsOpened: false,
            attributes: {
                'class': 'gallery'
            },
            events: {
                'click .closefield': 'remove',
                'click .goright': 'nextPicture',
                'click .goleft': 'prevPicture',
                'click .show-comments': 'commentsToggle',
                'click .rolldown': 'cloudRolldownToggle',
                'click .edit-comment': 'showEditPicture',
                'click .delete': 'deletePicture',
                'click .main-picture': 'toggleMainPicture'
            },
            initialize: function(data) {
                this.selectedPictureModel = data['selectedPictureModel'];
                //Предзагрузка изображений для удобства, тут будут 
                //хранится вьюшки, сама загрузка запускается в модели picture.
                this.preloaded = {};
                this.on('change:picture', function() {
                    var model = this.selectedPictureModel;
                    $('.cloud .picture-info').html(_.template(pictureCloudInfoTmp, model.toJSON()));
                }, this);
                window.currentGallery = this;
            },
            remove: function() {
                //Восстанавливаем скролл.
                $('body').css({'overflow': 'auto'});
                if(this.commentsOpened) {
                    this.hideComments();
                }
                window.mainRouter.navigate('album-' + this.selectedPictureModel.get('album_id'));
                $(this.el).remove();
                window.currentGallery = null;
            },
            render: function() {
                $(this.el).html(_.template(galleryTmp, this.model.toJSON()));
                $('#page').append(this.el);

                var that = this;
                var picturesList = this.model.get('pictures');
                var id = this.selectedPictureModel.get('id');
                //В галерее есть маленькая менюшка, её можно таскать по экрану.
                $(this.el).find('.cloud').draggable({
                    containment: 'parent', 
                    cursor: 'move',
                    start: function() {
                        $(that.el).find('.cloud').css({'opacity': '1'});
                    },
                    stop: function() {
                        $(that.el).find('.cloud').css({'opacity': ''});
                        //запоминаем положение
                        if(window.localStorage) {
                            var position = $(that.el).find('.cloud').offset();
                            window.localStorage.setItem('galleryMenuPosition.left', position.left + 'px');
                            window.localStorage.setItem('galleryMenuPosition.top', position.top + 'px');
                        }
                    },
                    cancel: '.btn'
                });
                //Восстанавливаем из памяти позиции менюшек.
                if(window.localStorage) {
                    var positionLeft = window.localStorage.getItem('galleryMenuPosition.left');
                    var positionTop = window.localStorage.getItem('galleryMenuPosition.top');
                    if(parseInt(positionLeft) > $(window).width() - $(this.el).find('.cloud').width() 
                        || parseInt(positionTop) > $(window).height() - $(this.el).find('.cloud').height()) 
                    {
                        $(this.el).find('.cloud').css({
                            left: '0px', 
                            top: $(window).height() - $(this.el).find('.cloud').outerHeight() + 'px'
                        });
                    } else {
                        if(positionLeft) {
                            $(this.el).find('.cloud').css({
                                left: positionLeft, 
                                top: window.localStorage.getItem('galleryMenuPosition.top')
                            });
                        }
                    }
                    var isRolldowned = window.localStorage.getItem('cloudrolldowned');
                    if(isRolldowned && isRolldowned == 'true') {
                        $(this.el).find('.rolldowned-menu').removeClass('hide');
                        $(this.el).find('.rolluped').addClass('hide');
                    }
                }

                this.containerForPicture = $(this.el).find('.gallery-viewport');

                //сразу закидываем в загруженное
                this.preloaded[id] = new pictureSlideView({
                    model: this.selectedPictureModel, 
                    container: this.containerForPicture
                });
                //Основная картинка. Модель найдена, рендерим.
                this.selectedPictureView = this.preloaded[id];
                this.selectedPictureView.render();
                //Подгружаем несколько картинок сразу, и потом после каждого переключения картинок.
                //Чтоб в при переключении не было тормозов и при просмотре старых картинок не
                //создавались новые модели.
                this.processPreload();
                that.trigger('change:picture');

                //Прячем скролл.
                $('body').css({'overflow': 'hidden'});

                //Прячем стрелки если всего 1 картинка.
                if(picturesList.length < 2)  {
                    this.$('.goright, .goleft').hide();
                }
            },
            processPreload: function(preloadCount) {
                var picturesList = this.model.get('pictures');
                var currentIndex = picturesList.indexOf(this.selectedPictureModel);
                //Для предзагружаемой картинки.
                var tmpModel;
                var tmpIndex;

                if(picturesList.length == 1) {
                    return false;
                }

                var preloadNextItems = preloadCount || 3;
                var preloadPrevItems = preloadCount || 3;
                //Подгружаем "вперед".
                for(var i = 1; i <= preloadNextItems; i++) {
                    tmpIndex = (!picturesList.at(currentIndex + i))? -1: currentIndex;
                    tmpModel = picturesList.at(tmpIndex + i);
                    if(!tmpModel || !this.preloaded[tmpModel.get('id')]) {
                        this.preloaded[tmpModel.get('id')] = new pictureSlideView({
                            model: tmpModel, 
                            container: this.containerForPicture
                        });
                    }
                }
                //Подгружаем "назад".
                for(var i = 1; i <= preloadPrevItems; i++) {
                    if(!picturesList.at(currentIndex - i)) {
                        tmpIndex = picturesList.length;
                        tmpModel = picturesList.at(tmpIndex - i - currentIndex);
                    } else {
                        tmpIndex = currentIndex;
                        tmpModel = picturesList.at(tmpIndex - i);
                    }

                    if(tmpModel && !this.preloaded[tmpModel.get('id')]) {
                        this.preloaded[tmpModel.get('id')] = new pictureSlideView({
                            model: tmpModel, 
                            container: this.containerForPicture
                        });
                    }
                }
            },
            nextPicture: function() {
                this.move(1);
            },
            prevPicture: function() {
                this.move(-1);
            },
            move: function(step, isKeyPressed) {
                //Показываем совет, что удобно использовать клавиши.
                if(!isKeyPressed && window.localStorage) {
                    var lastKeysNotice = window.localStorage.getItem('lastKeysNotice');
                    if(!lastKeysNotice || lastKeysNotice < 1) {
                        var ntf = new notification({modelAttrs: {text: 'Для перелистывания изображений удобно<br/>'
                            + 'использовать клавиши управления курсором.<br/>'
                            + 'Для закрытия галереи нажмите Esc.', duration: 30000}});
                        ntf.render();
                        window.localStorage.setItem('lastKeysNotice', 200);
                    } else {
                        window.localStorage.setItem('lastKeysNotice', lastKeysNotice - 1);
                    }
                } else if(isKeyPressed && window.localStorage) {
                    window.localStorage.setItem('lastKeysNotice', 2000);
                }
                var that = this;
                var picturesList = that.model.get('pictures');
                var currentIndex = picturesList.indexOf(that.selectedPictureModel);

                if(picturesList.length == 1) {
                    //Нечего листать, всего 1 картинка уже открыта.
                    that.trigger('break:onepic');
                    return false;
                }

                if(!picturesList.at(currentIndex + step)) {
                    if(currentIndex + step < 0) {
                        //Выход за левую границу.
                        //Чтоб следующий индекс был 0.
                        currentIndex = picturesList.length;
                    } else {
                        //Выход за правую границу.
                        currentIndex = - 1;
                    }
                    that.trigger('change:newlap');
                }

                that.selectedPictureModel = picturesList.at(currentIndex + step);
                that.trigger('change:picture');

                that.selectedPictureView.remove();

                if(that.preloaded[that.selectedPictureModel.get('id')]) {
                    that.selectedPictureView = that.preloaded[that.selectedPictureModel.get('id')];
                    that.selectedPictureView.render();
                } else {
                    that.selectedPictureView = new pictureSlideView({
                        model: that.selectedPictureModel, 
                        container: that.containerForPicture
                    });
                    that.selectedPictureView.render();
                }

                that.processPreload();

                if(this.commentsOpened) {
                    this.loadCommentsModule();
                }
            },
            /**
             * Свернуть/развернуть плавающую менюшку в галерее.
             */
            cloudRolldownToggle: function() {
                var isRolldowned = 'false';
                if($(this.el).find('.rolldowned-menu').is(':visible')) {
                    //Развернуть.
                    $(this.el).find('.rolldowned-menu').addClass('hide');
                    $(this.el).find('.rolluped').removeClass('hide');
                } else {
                    //Свернуть.
                    isRolldowned = 'true';
                    $(this.el).find('.rolldowned-menu').removeClass('hide');
                    $(this.el).find('.rolluped').addClass('hide');
                }
                if(window.localStorage) {
                    window.localStorage.setItem('cloudrolldowned', isRolldowned);
                }
            },
            /**
             * Свернуть/развернуть комментарии.
             */
            commentsToggle: function() {
                if(this.commentsOpened) {
                    this.hideComments();
                } else {
                    this.loadCommentsModule(this.selectedPictureModel.get('id'));
                    $(this.el).find('.comments')
                        .removeClass('hide')
                        .append($('#disqus_thread'));
                    $(this.el).find('.show-comments').text('Спрятать комментарии');
                }
                this.commentsOpened = !this.commentsOpened;
            },
            /**
             * Эта ф-ия выделена из предидущей т.к. комментарии 
             * надо восстанавливать при закрытии галереи.
             */
            hideComments: function() {
                $('.hypercomments-script').remove();
                $(this.el).find('#hypercomments_widget').html('');
                $(this.el)
                    .find('.comments')
                    .addClass('hide')
                    .find('#disqus_thread')
                    .appendTo($('#comments-box'));
                $(this.el).find('.show-comments').text('Комментарии');
                DISQUS.reset({
                    reload: true,
                    config: function () {
                        this.page.identifier = 'main';  
                        this.page.url = 'http://shepi.poly-js.com/init';
                    }
                });
            },
            /**
             * Перезагрузить модуль комментариев для нужной страницы(фотографии).
             */
            loadCommentsModule: function(uniqId) {
                disqus_identifier = 'picture' + uniqId;
                disqus_title = 'Picture';
                disqus_url = 'http://shepi.poly-js.com/p' + uniqId;
                DISQUS.reset({
                    reload: true,
                    config: function () {
                        this.page.identifier = 'picture' + uniqId;  
                        this.page.url = 'http://shepi.poly-js.com/p' + uniqId;
                    }
                });
            },
            /**
             * Показать вьюшку редактирования изображения.
             */
            showEditPicture: function() {
                var that = this;
                require(['views/common/popup', 'views/picture/edit'], function(popupView, editPictureView) {
                    var editPicture = new editPictureView({model: that.selectedPictureModel, view: that.selectedPictureView});
                    var popup = new popupView({innerView: editPicture});
                    popup.render();
                });
            },
            deletePicture: function() {
                var that = this;
                require(['models/confirm', 'views/common/confirm', 'views/common/notification'], function(confirmModel, confirmView, notification) {
                    var confirmData = new confirmModel({
                        'header': 'Вы уверены?',
                        'body': 'Вы сейчас собираетесь удалить фотографию. Возможно, она не так плоха, как Вам кажется?',
                        'negative_text': 'Еще подумаю.',
                        'positive_text': 'Удалить!',
                        'negative': function() {
                            //
                        },
                        'positive': function() {
                            //переходим на след. картинку т.к. после удаления этого сделать по-нормальному 
                            //не получится т.к. при переходе используется можель которую мы собираемся удалять
                            var model = that.selectedPictureModel;
                            that.move(1);
                            model.destroy({
                                error: function() {
                                    var ntf = new notification({modelAttrs: {text: 'У Вас недостаточно прав для удаления этого изображения.'}});
                                    ntf.render();
                                },
                                success: function() {
                                    var ntf = new notification({modelAttrs: {text: 'Изображение удалено успешно', duration: 100000}});
                                    ntf.render();
                                    //перерисовываем альбом, удаленной картинки там уже не будет
                                    data.albums.views[model.get('album_id')].render(/* don't append? -> */true);
                                }
                            });                            
                        }
                    });
                    var confirm = new confirmView({model: confirmData});
                });
            },
            /**
             * Сделать текущее изображение обложкой текущего альбома.
             */
            toggleMainPicture: function() {
                var albumModel = data.albums.list.get(this.selectedPictureModel.get('album_id'));
                albumModel.toggleMainPicture(this.selectedPictureModel.get('id'));
            }
        });

        return gallery;
    }
);