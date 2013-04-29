define([
        'boilerplate',
        'libs/require/text!templates/album/edit.html'
    ], 
    function(boilerplate, editTmp){
        var menu = Backbone.View.extend({
            id: 'albumDetails',
            attributes: {
                'class': 'edit'
            },
            events: {
                'click .closefield .close': 'remove',
                'click .save': 'save'
            },
            initialize: function(initData) {
                if(initData['view']) {
                    this.albumView = initData['view'];
                }
                if(initData['container']) {
                    this.container = initData['container'];
                }
                this.render();
            },
            render: function(container) {
                this.$el.html(_.template(editTmp, this.model.toJSON()));
                if(container) {
                    container.append(this.el);
                } else if(this.container) {
                    this.container.append(this.el);
                } else {
                    $('#page').append(this.el);
                }
                $(this.el).find('select').each(function(index, element) {
                    if($(element).attr('value')) {
                        $(element).find('option[value=' + $(element).attr('value') + ']').attr('selected', 'selected');
                    }
                });
            },
            save: function() {
                var that = this;
                $(this.el).find('.model-field').each(function(index, element) {
                    that.model.set($(element).attr('field'), $(element).val());
                });
                this.model.save({}, {
                    success: function() {
                        var ntf = new notification({modelAttrs: {text: 'Изменения сохранены успешно.', duration: 5000}});
                        ntf.render();
                    }
                });
                if(this.albumView) {
                    this.albumView.render(false, true);
                }
            }
        });

        return menu;
    }
);