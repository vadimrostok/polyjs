define([
		'boilerplate',
		'collections/albumsCollection',
		'views/album/album',
		'libs/text!templates/back/controls.html'
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
				data.albums.list = new AlbumsList();
				var that = this;
				data.albums.list.fetch({success: function() {
					that.trigger('load:albums');
				}});
			},
			onAlbumsLoaded: function() {
				//deprecated наверно
				this.render();
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

				data.albums.list.forEach(function(element, index) {
					data.albums.views[element.get('id')] = 
						new album({
							model: element, 
							container: this.$('.controls')
						});
				});
			}
		});

		return controls;
	}
);