define([
        'boilerplate',
        'collections/pictures',
    ], 
    function(boilerplate, PicturesList) {
        var AlbumModel = Backbone.Model.extend({
            fileId: 0,
            toUploadFilesList: {},
            toUploadFileViews: {},
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
                //alert(fileId)
                this.toUploadFilesList[this.fileId++] = file;
                //this.fileId = this.fileId + 1;
                //alert(this.toUploadFilesList[0])
                app.toUploadFilesList = this.toUploadFilesList;
                app.toUploadFileViews = this.toUploadFileViews;
            },
            removeToUploadFile: function(fileId) {
                delete this.toUploadFilesList[fileId];
            },
            clearToUploadFileList: function() {
                this.toUploadFilesList = {};
            },
            uploadPictures: function() {

                var that = this;
                for(var i = 0; i < this.fileId; i++) {
                    if(!this.toUploadFilesList[i]) {
                        continue;
                    }
                    var file = this.toUploadFilesList[i];

                    var FD = new FormData();
                    FD.append('album_id', this.get('id'));
                    FD.append('pictures[]', file);
                     
                    var xhr = new XMLHttpRequest();
                    xhr.tmpFileId = i;

                    xhr.upload.addEventListener('progress', function(e) {
                        if (e.lengthComputable) {
                            var progress = (e.loaded * 100) / e.total;
                            console.log(progress);
                        }
                    }, false);

                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4) {
                            if(this.status == 200) {
                                console.log('finish');
                            } else {
                                console.log(arguments);
                            }
                            that.toUploadFileViews[this.tmpFileId].remove();
                            that.removeToUploadFile(this.tmpFileId);
                        }
                    };

                    xhr.open('POST', URLS.bay);
                    xhr.send(FD);
                }
            }
        });

        return AlbumModel;
    }
);