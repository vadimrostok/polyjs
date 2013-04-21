define([
		'models/album'
	], 
	function(Album){
		var AlbumsList = Backbone.Collection.extend({
			url: URLS.base + '/rest/albumsWithPictures',
			model: Album,
			comparator: function(el) {
				return el.get('id')*(-1)
			}
		});

		return AlbumsList;
	}
);