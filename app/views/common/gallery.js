/**
 * при открытии галереи появляется и медленно расворяется менюшка внизу, чтоб было понятно, что при наведении она появится снова.
 */
define([
        'boilerplate',
        'views/picture/picture_slide',
        'libs/require/text!templates/common/gallery.html',
        'libs/require/text!templates/common/pictureCloudInfo.html',
        'bootstrap'
    ], 
    function(boilerplate, pictureSlideView, galleryTmp, pictureCloudInfoTmp){
        var gallery = Backbone.View.extend({
            attributes: {
                'class': 'gallery'
            },
            events: {
                'click .closefield': 'remove',
                'click .goright': 'nextPicture',
                'click .goleft': 'prevPicture',
                'click .show-comments': 'commentsToggle',
                'click .rolldown': 'cloudRolldownToggle',
                'click .edit-comment': 'showEditAuthorComment',
                'click .delete': 'deletePicture',
            },
            initialize: function(data) {
                this.selectedPictureModel = data['selectedPictureModel'];
                this.preloaded = {};
                this.on('change:picture', function() {
                    var model = this.selectedPictureModel;
                    $('.cloud .picture-info').html(_.template(pictureCloudInfoTmp, model.toJSON()));
                }, this);

                this.render();
            },
            render: function() {
                $(this.el).html(_.template(galleryTmp, this.model.toJSON()));
                $('#page').append(this.el);

                var that = this;
                //можно таскать по экрану
                $(this.el).find('.cloud').draggable({
                    containment: 'parent', 
                    cursor: 'move',
                    start: function() {
                        $(that.el).find('.cloud').css({'opacity': '1'});
                    },
                    stop: function() {
                        $(that.el).find('.cloud').css({'opacity': ''});
                        //запоминаем положение
                        if(window.sessionStorage) {
                            var position = $(that.el).find('.cloud').offset();
                            window.sessionStorage.setItem('galleryMenuPosition.left', position.left + 'px');
                            window.sessionStorage.setItem('galleryMenuPosition.top', position.top + 'px');
                        }
                    },
                    cancel: '.btn'
                });
                if(window.sessionStorage) {
                    var positionLeft = window.sessionStorage.getItem('galleryMenuPosition.left');
                    if(positionLeft) {
                        $(this.el).find('.cloud').css({
                            left: positionLeft, 
                            top: window.sessionStorage.getItem('galleryMenuPosition.top')
                        });
                    }
                    var isRolldowned = window.sessionStorage.getItem('cloudrolldowned');
                    if(isRolldowned && isRolldowned == 'true') {
                        $(this.el).find('.rolldowned').removeClass('hide');
                        $(this.el).find('.rolluped').addClass('hide');
                    }
                }

                this.containerForPicture = $(this.el).find('.gallery-viewport');

                //подгружаем несколько картинок сразу, и потом после каждого переключения картинок.
                //чтоб в при переключении не было тормозов и при просмотре старых картинок не
                //создавались новые модели
                this.processPreload();
                //сразу закидываем в загруженное
                this.preloaded[this.selectedPictureModel.get('id')] = new pictureSlideView({
                    model: this.selectedPictureModel, 
                    container: this.containerForPicture
                });
                //основная картинка. модель найдена, рендерим
                this.selectedPictureView = this.preloaded[this.selectedPictureModel.get('id')];
                this.selectedPictureView.render();
                that.trigger('change:picture');
            },
            processPreload: function() {
                var picturesList = this.model.get('pictures');
                var currentIndex = picturesList.indexOf(this.selectedPictureModel);
                var tmpModel;
                var tmpIndex;

                if(picturesList.length == 1) {
                    return false;
                }

                var preloadNextItems = 2;
                var preloadPrevItems = 2;
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

                for(var i = 1; i <= preloadPrevItems; i++) {
                    if(!picturesList.at(currentIndex - i)) {
                        tmpIndex = picturesList.length;
                        tmpModel = picturesList.at(tmpIndex - i - currentIndex);
                    } else {
                        tmpIndex = currentIndex;
                        tmpModel = picturesList.at(tmpIndex - i);
                    }

                    if(!this.preloaded[tmpModel.get('id')]) {
                        this.preloaded[tmpModel.get('id')] = new pictureSlideView({
                            model: tmpModel, 
                            container: this.containerForPicture
                        });
                    }
                }
            },
            nextPicture: function() {
                app.log('gallery nextPicture')
                this.move(1);
            },
            prevPicture: function() {
                app.log('gallery prevPicture')
                this.move(-1);
            },
            move: function(step) {
                var that = this;
                $(that.el).find('.gallery-viewport .picture').remove();

                var picturesList = that.model.get('pictures');
                var currentIndex = picturesList.indexOf(that.selectedPictureModel);

                if(picturesList.length == 1) {
                    //нечего листать, всего 1 картинка уже открыта
                    that.trigger('break:onepic');
                    return false;
                }
                if(!picturesList.at(currentIndex + step)) {
                    if(currentIndex + step < 0) {
                        //выход за левую границу
                        //чтоб следующий индекс был 0
                        currentIndex = picturesList.length;
                    } else {
                        //выход за правую границу
                        currentIndex = - 1;
                    }
                    that.trigger('change:newlap');
                }

                that.selectedPictureModel = picturesList.at(currentIndex + step);
                //console.log(that.selectedPictureModel)
                that.trigger('change:picture');

                if(that.preloaded[that.selectedPictureModel.get('id')]) {
                    that.preloaded[that.selectedPictureModel.get('id')].render();
                    app.log('preloaded data used')
                } else {
                    that.selectedPictureView = new pictureSlideView({
                        model: that.selectedPictureModel, 
                        container: that.containerForPicture
                    });
                    that.selectedPictureView.render();
                }

                that.processPreload();
            },
            cloudRolldownToggle: function() {
                var isRolldowned = 'false';
                if($(this.el).find('.rolldowned').is(':visible')) {
                    //развернуть
                    $(this.el).find('.rolldowned').addClass('hide');
                    $(this.el).find('.rolluped').removeClass('hide');
                } else {
                    //свернуть
                    isRolldowned = 'true';
                    $(this.el).find('.rolldowned').removeClass('hide');
                    $(this.el).find('.rolluped').addClass('hide');
                }
                if(window.sessionStorage) {
                    window.sessionStorage.setItem('cloudrolldowned', isRolldowned);
                }
            },
            commentsToggle: function() {

            },
            showEditAuthorComment: function() {

            },
            deletePicture: function() {
                this.selectedPictureModel.des
                var that = this;
                require(['models/confirm', 'views/common/confirm'], function(confirmModel, confirmView) {
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
                            model.destroy({error: function() {
                                alert('У Вас недостаточно прав для удаления альбома.');
                            }});
                            
                        }
                    });
                    var confirm = new confirmView({model: confirmData});
                });
            }
        });

        return gallery;
    }
);