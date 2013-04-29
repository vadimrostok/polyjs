define([
        'views/back/controls'
    ], 
    function(controlsView) {
        xdescribe("Представление controls", function() {
        	var view = new controlsView();
        	it('должно загрузить альбомы', function() {
	        	waitsFor(function() {
					return data.albums.list.length > 0;
				}, 'ожидание загрузки альбомов', 5000);
	        	runs(function() {
	        		expect(data.albums.list.length).toBeGreaterThan(0);
				});
        	});
        	it('должно отрисовать альбомы', function() {
        		view.render();
				expect($(view.el).find('.album').length).toBeGreaterThan(0);
			});
		});
    }
);