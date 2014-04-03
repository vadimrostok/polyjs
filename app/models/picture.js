define([
        'boilerplate'
    ], 
    function(boilerplate) {
        var PictureModel = Backbone.Model.extend({
            mode: 'simple',
            urlRoot: URLS.base + '/rest/picture',
            defaults: {
                'title': ''
            },
            initialize: function(initData) {
                if(initData['mode']) {
                    this.mode = initData['mode'];
                }
                //Файл грузится с ФС клиента?
                this.set('isLocal', (this.mode in {'upload-preview': true}));
                if(this.mode == 'upload-preview') {
                    this.set('prefix', '');
                    this.set('client_path', '');
                    this.set('filename', initData['src']);
                    this.set('fileId', initData['fileId']);
                    this.albumModel = initData['albumModel'];
                } else {
                    this.fixModels();
                    this.on('sync', this.fixModels, this);
                }
                this.on('remove:upload-preview', this.removeFromUploadFileFist);
            },
            setSizes: function() {
                if(!this.get('file_info')) {
                    this.set('prefix', '');
                    return 1;
                }
                //Выберем оптимальное разрешение!
                var win_width = $(window).width();
                var win_height = $(window).height();
                var pic_max_side = (this.get('file_info').width > this.get('file_info').height)? 
                    this.get('file_info').width
                    : this.get('file_info').height;
                var prefix = '200_';
                if(win_width > 200 && pic_max_side > 200) {
                    if(pic_max_side < 1300) {
                        prefix = '';
                    } else {
                        prefix = '1300_';
                    }
                    if(win_width > 1300 && pic_max_side > 1300) {
                        if(pic_max_side < 1700) {
                            prefix = '';
                        } else {
                            prefix = '1700_';
                        }
                    }
                }
                this.set('prefix', prefix);
            },
            /*
             * Актуально для домашнего компьютера, добавляет к адресам прставку, равную Yii::app()->baseUrl.
             */
            fixModels: function() {
                this.set('client_path', URLS['picBase'] + this.get('client_path'));
                this.setSizes();
            },
            /*  
             * Событие "повешено" на вьюшку картинки, но логика находится в модели альбома. Передаем "сигнал".
             */
            removeFromUploadFileFist: function() {
                this.albumModel.removeToUploadFile(this.get('fileId'));
            }
        });

        return PictureModel;
    }
);