<script type="text/javascript">
function go() {
	Album = Backbone.Model.extend({
		'urlRoot': '<?=$this->createUrl('rest/album') ?>',
		'defaults': {
			'title': ''
		},
		'initialize': function(initData) {
			if(!initData) {
				throw 'В конструктор необходимо передавать начальные данные';
			}
			if(!initData.title) {
				throw 'Параметр title необходим';
			}
			this.on('change:title', function(model) {
				console.log('Vahhh ' + model.get('title'));
			});
		},
		'validate': function(attrs) {
			if(!_.isString(attrs.title)) {
				return {title: 'Название альбома должно быть строкой'};
			} else if(attrs.title.replace(' ', '').length < 3) {
				return {title: 'Длина названия альбома должна быть не менее 3-х символов'};
			}
		}
	});
	AlbumsList = Backbone.Collection.extend({
		'model': Album
	});

	albumsList = new AlbumsList();

	albumsList.reset(<?=CJSON::encode($albums)?>);

}
$(go);
</script>