define([
        'boilerplate',
        'collections/pictures',
        'views/picture/icon',
        'models/picture',
    ], 
    function(boilerplate, PicturesList, pictureView, pictureModel) {
        var AlbumModel = Backbone.Model.extend({
            //просто счетчик
            fileId: 0,
            previewHeight: 0,
            toUploadFilesList: {},
            toUploadFileViews: {},
            //тут будут вьюшка и модель превьюшки
            toUpload: {},
            urlRoot: URLS.base + '/rest/album',
            defaults: {
                'title': ''
            },
            initialize: function(initData) {
                if(initData.pictures) {
                    var pictures = new PicturesList(initData.pictures);
                    this.set('pictures', pictures);
                    this.set('pictures_count', pictures.length);
                } else {
                    this.unset('pictures');
                    this.set('pictures_count', 0);
                }
                this.set('status_text', setatusTexts[this.get('status_id')]);
            },
            validate: function(attrs) {
                if(!_.isString(attrs.title)) {
                    return {field: 'title', text: 'Название альбома должно быть строкой'};
                } else if(attrs.title.replace(' ', '').length < 3) {
                    return {field: 'title', text: 'Длина названия альбома должна быть не менее 3-х символов'};
                }
            },
            addFileToUpload: function(file) {
                this.toUploadFilesList[this.fileId++] = file;
            },
            removeToUploadFile: function(fileId) {
                delete this.toUploadFilesList[fileId];
            },
            clearToUploadFileList: function() {
                this.toUploadFilesList = {};
            },
            handleFilesAdd: function(e, view) {
                var that = this;
                var files = e.target.files;
                var filesAddedCount = 0;

                // Показать превьюшки.
                for (var i = 0, f; f = files[i]; i++) {
                    if (!f.type.match('image.*')) {
                        continue;
                    }
                    filesAddedCount++;
                    this.addFileToUpload(f);
                    var reader = new FileReader();
                    // - 1 т.к. fileId инкрементируется ПОСЛЕ использования в качестве индекса в ф-ии addFileToUpload
                    reader.fileId = this.fileId - 1;
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
                            that.toUpload[reader.fileId] = {m: model, v: view};
                        };
                    })(f, view, pictureModel, pictureView);
                    reader.readAsDataURL(f);
                }
                return filesAddedCount;
            },
            uploadPictures: function() {
                var that = this;
                for(var i = 0; i < this.fileId; i++) {
                    if(!this.toUploadFilesList[i]) {
                        continue;
                    }
                    var file = this.toUploadFilesList[i];

                    //Очень удобный объект, мало распространен, но нужен только в админке.
                    var FD = new FormData();
                    FD.append('album_id', this.get('id'));
                    FD.append('pictures[]', file);
                     
                    var xhr = new XMLHttpRequest();
                    xhr.tmpFileId = i;

                    //пока не нужно
                    /*xhr.upload.addEventListener('progress', function(e) {
                        if (e.lengthComputable) {
                            var progress = (e.loaded * 100) / e.total;
                            console.log(progress);
                        }
                    }, false);*/

                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4) {
                            if(this.status == 200) {
                                //console.log('finish');
                            } else {
                                //console.log(arguments);
                            }
                            that.toUploadFileViews[this.tmpFileId].remove();
                            that.removeToUploadFile(this.tmpFileId);
                            delete that.toUpload.m;
                            delete that.toUpload.v;
                        }
                    };

                    xhr.open('POST', URLS.bay);
                    xhr.send(FD);
                }
            },
            /*
             * Делает эту модель обложкой альбома.
             */
            toggleMainPicture: function(id) {
                var currentMainPicture = this.get('main_picture_id');
                var successChangeMassage = '';
                if(currentMainPicture == id) {
                    this.set('main_picture_id', null);
                    successChangeMassage = 'Теперь у альбома нет обложки';
                } else {
                    this.set('main_picture_id', id);
                    successChangeMassage = 'Выбранное Вами изображение теперь является обложкой альбома.';
                }
                this.save({}, {
                    success: function(data) {
                        var ntf = new notification({modelAttrs: {text: successChangeMassage, duration: 5000}});
                        ntf.render();
                    },
                    error: function() {
                        app.log(arguments)
                    }
                });
            },
            /**
             * Установить рамер превьюшек. На него влияют параметр icon_size из модели, 
             * поле useBigPreviews во вьюшке, параметр useBigPreviews передаваемый в render вьюшки.
             */
            resolvePreviewsSize: function(view_useBigPreviews, useBigPreviews) {
                var icon_size = this.get('icon_size');
                var previewHeight = 100;
                //Установлено useBigPreviews в объекте вьюшки?
                if(typeof useBigPreviews == 'undefined' && view_useBigPreviews) {
                    useBigPreviews = view_useBigPreviews;
                }
                //Есть данные из БД.
                if(icon_size > 0) {
                    useBigPreviews = (icon_size == 100)? false: true;
                    previewHeight = icon_size;
                } else if(useBigPreviews == true) {
                    previewHeight = 400;
                } else {
                    useBigPreviews = false;
                }

                this.previewHeight = previewHeight;
                return useBigPreviews;
            }
        });

        return AlbumModel;
    }
);