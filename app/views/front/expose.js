define([
        'boilerplate',
        'collections/albums',
        'views/album/album',
        'libs/require/text!templates/front/expose.html'
    ], 
    function(boilerplate, AlbumsList, albumView, exposeTmp){
        var expose = Backbone.View.extend({
            params: {},
            id: 'adminControls',
            attributes: {
                'class': 'hide'
            },
            initialize: function() {
                progressBar(60);

                this.on('load:albums', this.render);
                this.fetchAlbums();

                progressBar(80);
            },
            fetchAlbums: function() {
                data.albums.list = new AlbumsList();
                var that = this;
                data.albums.list.fetch({success: function() {
                    that.trigger('load:albums');
                    data.albums.list.trigger('load:albums');
                }});
            },
            render: function() {
                var that = this;
                this.$el.html(_.template(exposeTmp, this.params));
                this.$el.find('.albums-box').height(Math.ceil(data.albums.list.length / 4) * 220);
                $('#page').append(this.el);

                this.renderAlbums();
                
                progressBar(100);

                setTimeout(function() {
                    $('#mainProgressBar').parent().parent().addClass('hide');
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
                    data.albums.views[element.get('id')].render(false, false /*, true*/);
                });
                data.albums.list.trigger('render:albums');
            }
        })

        return expose;
    }
);