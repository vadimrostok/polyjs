define([
        'views/common/notification',
        'models/notification',
        'test/specs/mockData/testView'
    ], 
    function(notificationView, notificationModel, TestView) {
        describe("Представление notification", function() {
            var model = null;
        	var view = null;
            afterEach(function() {
                if(view) {
                    view.remove();
                }
                view = model = null;
            });
            it('должно рендерить в себе view, если в конструктор или render передан view', function() {
                var testView = new TestView();
                view = new notificationView({view: testView});
                view.render();

                expect($(view.el).find('#' + testView.id).length).toBeTruthy();
            });
        	it('должно отключаться через определенное время', function() {
                jasmine.Clock.useMock();

                model = new notificationModel({text: 'test'});
                view = new notificationView({model: model});
                view.render();
                //default timeout = 1500
                jasmine.Clock.tick(1501);

                expect(view.isShowing).toBeFalsy();

                /*waitsFor(function() {
                    return !view.isShowing;
                }, 'пока  отображается оповещение', 1501);
                runs(function() {
                    expect(view.isShowing).toBeFalsy();
                });*/
            });
            xit('должно быть красиво', function() {
                model = new notificationModel({text: 'test', duration: 5000});
                view = new notificationView({model: model});
                view.render();
                waitsFor(function() {
                    return !view.isShowing;
                }, 'Слишком долго смотрим. не красиво?', 5000)
            });
            xit('должно показывать несколько оповещений сразу', function() {
                var models = [];
                var views = [];
                for(var i = 0; i < 10; i++) {
                    models[i] = new notificationModel({text: i, duration: /*Math.random()*/(10 - i)*3000});
                    views[i] = new notificationView({model: models[i]});
                    views[i].render();
                }
            });
		});
    }
);
