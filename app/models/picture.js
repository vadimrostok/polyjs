define([
        'boilerplate'
    ], 
    function(boilerplate) {
        var PictureModel = Backbone.Model.extend({
            'urlRoot': URLS.base + '/rest/picture',
            'defaults': {
                'title': ''
            },
            'initialize': function(initData) {
                this.set('client_path', URLS['picBase'] + this.get('client_path'));
                this.setSizes();
            },
            'validate': function(attrs) {
                if(!_.isString(attrs.title)) {
                    return {title: 'Имя изображения должно быть строкой'};
                } else if(attrs.title.replace(' ', '').length < 3) {
                    return {title: 'Длина имени изображения должна быть не менее 3-х символов'};
                }
            },
            setSizes: function() {
                var win_width = $(window).width();
                var win_height = $(window).height();
                var pic_width = this.get('file_info').width;
                var pic_height = this.get('file_info').height;
                var prefix = '400_';
                //выберем оптимальное разрешение!
                if(win_width > 400 && pic_width > 400) {
                    if(pic_width < 1300) {
                        prefix = '';
                    } else {
                        prefix = '1300_';
                    }
                    if(win_width > 1300 && pic_width > 1300) {
                        if(pic_width < 1300) {
                            prefix = '';
                        } else {
                            prefix = '1700_';
                        }
                    }
                }
                /*_.each([1300, 1700], function(element, index) {
                    if(win_width > element/2 && pic_width > element/2) {
                        prefix = element + '_';
                    }
                });*/
                this.set('prefix', prefix);
            }
        });

        return PictureModel;
    }
);