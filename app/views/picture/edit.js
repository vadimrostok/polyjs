define([
        'boilerplate',
        'views/common/notification',
        'libs/require/text!templates/picture/edit.html'
    ], 
    function(boilerplate, notification, editTmp) {
        var editWin = Backbone.View.extend({
            attributes: {
                'class': 'edit-win'
            },
            events: {
                'click .save': 'saveData'
            },
            initialize: function(data) {
                if(data['container']) {
                    this.container = data['container'];
                }
                if(data['view']) {
                    this.relatedPictureView = data['view'];
                }
            },
            render: function(container) {
                if(container) {
                    this.container = container;
                }
                if(this.container) {
                    $(this.el).html(_.template(editTmp, this.model.toJSON()));
                    this.container.append(this.el);
                    $(this.el).find('select').each(function(index, element) {
                        if($(element).attr('value')) {
                            $(element).find('option[value=' + $(element).attr('value') + ']').attr('selected', 'selected');
                        }
                    });
                }
            },
            saveData: function() {
                //В шаблоне у всех полей есть аттрибут model-field
                //по нему собираются данные в модель.
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
                if(this.relatedPictureView) {
                    this.relatedPictureView.render();
                }
            }
        });

        return editWin;
    }
);