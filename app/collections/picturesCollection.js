define([
		'models/picture'
	], 
	function(Picture){
		var PicturesList = Backbone.Collection.extend({
			model: Picture
		});

		return PicturesList;
	}
);