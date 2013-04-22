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
				//log('picture init')
			},
			'validate': function(attrs) {
				if(!_.isString(attrs.title)) {
					return {title: 'Имя изображения должно быть строкой'};
				} else if(attrs.title.replace(' ', '').length < 3) {
					return {title: 'Длина имени изображения должна быть не менее 3-х символов'};
				}
			}
		});

		return PictureModel;
	}
);