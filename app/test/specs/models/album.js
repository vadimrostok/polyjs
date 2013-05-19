define([
        'models/album',
        'collections/pictures',
        'test/specs/mockData/mockAlbumSource',
        'test/specs/mockData/mockPicturesSource'
    ], 
    function(album, picturesCollection, mockAlbum, mockPicturesArray) {
        describe("Модель album", function() {
            mockAlbum.pictures = mockPicturesArray;
            var model = new album(mockAlbum);

            it('должна по умолчанию устанавливать размер превьюшек равным 100.', function() {
                model.resolvePreviewsSize();
                expect(model.previewHeight).toEqual(100);
            });
        });
    }
);