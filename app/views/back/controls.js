define([
        'boilerplate',
        'components/View.OpenHide',
        'collections/albums',
        'views/album/album',
        'models/album',
        'libs/require/text!templates/back/controls.html'
    ], 
    function(boilerplate, OpenHide, AlbumsList, albumView, albumModel, controlsTmp){
        var controls = {
            params: {},
            newAlbumModel: null,
            mainProgressBar: null,
            id: 'adminControls',
            attributes: {
                'class': 'controls hide'
            },
            events: _.extend(OpenHide.events, {
                'click .create': 'createNewAlbum'
            }),
            initialize: function() {
                this.mainProgressBar = $('#mainProgressBar');
                progressBar(60);

                this.on('load:albums', this.render);
                this.fetchAlbums();

                progressBar(80);

                this.setNewAlbumModel();
            },
            setNewAlbumModel: function() {
                this.newAlbumModel = new albumModel({});
                this.newAlbumModel.on('invalid', this.newAlbumErrorHandler, this);
                this.params = _.extend(this.params, {
                    newAlbum: this.newAlbumModel
                });
            },
            fetchAlbums: function() {
                data.albums.list = new AlbumsList();
                var that = this;
                data.albums.list.fetch({success: function() {
                    that.trigger('load:albums');
                }});
            },
            render: function() {
                var that = this;
                this.$el.html(_.template(controlsTmp, this.params));
                /**
                 * jQuery append не будет создавать новый 
                 * элемент после первого вызова render т.к.
                 * el в этом объекте и в документе один и тот же,
                 * однако если удалить el из документа при следующем
                 * вызове render он вновь append-ится в документ, вот так-то.
                 */
                $('#page').append(this.el);

                this.renderAlbums();
                progressBar(100);
                setTimeout(function() {
                    $(that.mainProgressBar).parent().addClass('hide');
                    $(that.el).removeClass('hide');
                }, 300);
            },
            renderAlbums: function() {
                data.albums.list.forEach(function(element, index) {
                    data.albums.views[element.get('id')] = 
                        new albumView({
                            model: element, 
                            container: this.$('.albums-box')
                        });
                    data.albums.views[element.get('id')].render(false, false, true);
                });
            },
            createNewAlbum: function() {
                var that = this;
                $(this.el).find('.newalbum .model-field').attr('required', null);
                $(this.el).find('.newalbum .model-field').each(function(index, element) {
                    that.newAlbumModel.set($(element).attr('field'), $(element).val());
                });
                this.newAlbumModel.save({}, {
                    success: function() {
                        var ntf = new notification({modelAttrs: {text: 'Новый альбом сохранен успешно.', duration: 5000}});
                        ntf.render();

                        that.fetchAlbums();
                        that.render();
                        that.setNewAlbumModel();
                    }
                });
                return false;
            },
            newAlbumErrorHandler: function(model, error, options) {
                var field = $(this.el).find('.newalbum .model-field[field=' + error.field + ']');
                field.attr('required', 'true');
                field.focus();
                var ntf = new notification({modelAttrs: {text: error.text, duration: 5000}});
                ntf.render();
            }
        }
        return Backbone.View.extend(_.extend(OpenHide, controls));
    }
);