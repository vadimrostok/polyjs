define([
        'boilerplate',
        'collections/albums',
        'views/album/album',
        'libs/require/text!templates/back/controls.html'
    ], 
    function(boilerplate, AlbumsList, album, controlsTmp){
        var controls = Backbone.View.extend({
            id: 'adminControls',
            /**
             * можно и так использовать:
             * result = _.template(templateContents, context);
             * но у меня так:
             * template = _.template(templateContents);
             * result = template(context);
             */
            initialize: function() {
                this.on('load:albums', this.onAlbumsLoaded);
                this.fetchAlbums();
            },
            fetchAlbums: function() {
                data.albums.list = new AlbumsList();
                var that = this;
                data.albums.list.fetch({success: function() {
                    that.trigger('load:albums');
                }});
            },
            onAlbumsLoaded: function() {
                //render вызывается по событию load:albums, прописаоно это в threshold
                //this.render();
            },
            render: function() {
                this.$el.html(_.template(controlsTmp));
                /**
                 * jQuery append не будет создавать новый 
                 * элемент после первого вызова render т.к.
                 * el в этом объекте и в документе один и тот же,
                 * однако если удалить el из документа при следующем
                 * вызове render он вновь append-ится в документ, вот так-то.
                 */
                $('#page').append(this.el);

                this.renderAlbums();    
            },
            renderAlbums: function() {
                data.albums.list.forEach(function(element, index) {
                    data.albums.views[element.get('id')] = 
                        new album({
                            model: element, 
                            container: this.$('.controls')
                        });
                    data.albums.views[element.get('id')].render();
                });
            }
        });

        return controls;
    }
);