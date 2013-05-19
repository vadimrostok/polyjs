define([
        'models/picture'
    ], 
    function(picture) {
        //  describe('Модель picture', function() {
        var requestFinished = false;
        var executed = 0;
        $.ajax({
            url: 'test/getPictures',
            type: 'POST',
            data: {count: 10},
            async: false,
            dataType: 'json',
            success: function(response) {
                describe('Модель picture', function() {
                    it('должна устанавливать префикс существующего файла.', function() {
                        var models = {};
                        var recProcess = function(i) {
                            if(i > 9) {
                                return true;
                            }
                            models[i] = new picture({id: response[i].id});
                            runs(function() {
                                requestFinished = false;
                                var model = models[i];
                                model.fetch({success: function() {
                                    requestFinished = true;
                                    var pathToFile = model.get('path').replace(model.get('filename'), model.get('prefix') + model.get('filename'));
                                    $.ajax({
                                        url: 'test/checkFile',
                                        data: {path: pathToFile},
                                        async: false,
                                        type: 'POST',
                                        success: function(response) {
                                            expect(response).toMatch('true');
                                            //Шаг.
                                            executed++;
                                            recProcess(executed);
                                        }, 
                                        error: function() {
                                            //
                                        }
                                    });
                                }});
                            });
                            waitsFor(function() {
                                return requestFinished == true;
                            }, 'model fetch', 1000);
                        }
                        recProcess(executed);
                    });
                });
            }
        });
    }
);