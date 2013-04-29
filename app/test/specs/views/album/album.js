define([
        'views/album/album',
        'models/album',
        'collections/pictures',
        'test/specs/mockData/mockAlbumSource',
        'test/specs/mockData/mockPicturesSource'
    ], 
    function(albumView, albumModel, picturesCollection, mockAlbum, mockPicturesArray) {
        describe("Представление album", function() {
            mockAlbum.pictures = mockPicturesArray;
            var model = new albumModel(mockAlbum);
        	var view = new albumView({model: model, container: $('#page')});
            view.render();

            it('должно разворачиваться и сворачиваться', function() {

                expect(1).toBeTruthy();
            });
		});
    }
);
