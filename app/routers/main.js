define([
        'boilerplate',
    ],
    function(boilerplate) {
        var Workspace = Backbone.Router.extend({
            nothingWasRouted: true,
            routes: {
                'album-:id': 'album',
                'album-:aid/picture-:pid': 'picture',
                'init': 'init'
            },
            album: function(id) {
                this.nothingWasRouted = false;
                if(!(id && data && data.albums && data.albums.list)) {
                    return false;
                }
                var f = function() {
                    var album = data.albums.list.get(id);
                    if(!album) {
                        return false;
                    }
                    data.albums.views[id].showDetails();
                }
                if(data.albums.list.length < 1) {
                    data.albums.list.on('render:albums', f);
                } else f();
            },
            picture: function(aid, pid) {
                this.nothingWasRouted = false;
                if(!(aid && pid && data && data.albums && data.albums.list)) {
                    return false;
                }
                var f = function() {
                    var album = data.albums.list.get(aid);
                    if(!album) {
                        return false;
                    }
                    if(data.albums.views[aid]) {
                        data.albums.views[aid].showDetails();
                        if(data.pictures.views[aid][pid]) {
                            data.pictures.views[aid][pid].showPicture();
                        }
                    }
                }
                if(data.albums.list.length < 1) {
                    data.albums.list.on('render:albums', f);
                } else f();
            },
            init: function() {
                //donothing
            }
        });
        return Workspace;
    }
);