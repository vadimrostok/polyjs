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
                view.remove();
                view = model = null;
            });
            it('должно рендерить в себе view, если в конструктор или render передан view', function() {
                var testView = new TestView();
                view = new notificationView({view: testView});
                view.render();

                expect($(view.el).find('#' + testView.id).length).toBeTruthy();
            });
        	it('должно отключаться через определенное время', function() {
                model = new notificationModel({text: 'test'});
                view = new notificationView({model: model});
                view.render();

                //default timeout = 1500
	        	waitsFor(function() {
                    return !view.isShowing;
                }, 'пока  отображается оповещение', 1501);
                runs(function() {
                    expect(view.isShowing).toBeFalsy();
                });
        	});
		});
    }
);
var currentContent = 'logo';
$(".flipPad a.viewSongList").click(function() {
var that = this;
var flipbox = $(that).parent().parent().find('.flipbox');
$(flipbox).flip({
        direction: 'lr',
        color: '#fff',
        content: function() {
            if(currentContent == 'logo') {
                $(flipbox).addClass("removeBkgrnd").html('<p>Here is the song list.</p>');
            } else {
                $(flipbox).removeClass("removeBkgrnd").html('');
            }                
        },
        onEnd: function() {
            if(currentContent == 'logo') {
                currentContent = 'songList';
                $(that).addClass("viewAlbumArt").html('View Album Art');
            } else {
                currentContent = 'logo';
                $(that).removeClass("viewAlbumArt").html('View Song List');
            }
        }
    })
    return false;
});