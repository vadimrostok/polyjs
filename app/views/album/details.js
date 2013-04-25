define([
        'boilerplate',
        'libs/require/text!templates/album/details.html'
    ], 
    function(boilerplate, detailsTmp){
        var details = Backbone.View.extend({
            id: 'albumDetails',
            attributes: {
                'class': 'details-box'
            },
            events: {
                'click .closefield': 'remove',
                'click #deleteAlbum': 'delete'
            },
            initialize: function(initData) {
                if(initData['albumView']) {
                    this.albumView = initData['albumView'];
                }
                this.render();
            },
            render: function() {
                this.remove();
                this.$el.html(_.template(detailsTmp, this.model.toJSON()));
                $('#page').append(this.el);
            },
            delete: function() {
                var that = this;
                require(['models/confirm', 'views/common/confirm'], function(confirmModel, confirmView) {
                    var confirmData = new confirmModel({
                        'header': 'Вы уверены?',
                        'body': 'Вы сейчас собираетесь удалить целый альбом.',
                        'negative_text': 'Ой, нет.',
                        'positive_text': 'Да!',
                        'negative': function() {
                            //that.remove();
                        },
                        'positive': function() {
                            that.model.destroy({error: function() {
                                alert('У Вас недостаточно прав для удаления альбома.');
                            }});
                            if(that.albumView) {
                                that.albumView.remove();
                            }
                            that.remove();
                        }
                    });
                    var confirm = new confirmView({model: confirmData});
                });
            }
        });

        return details;
    }
);