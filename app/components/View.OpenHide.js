define([
        'boilerplate'
    ],
    function(boilerplate) {
        return {
            events: {
                //open-block на одном уровне или выше чем toopen
                'click .open-block': 'openBlock',
                //open-block на одном уровне или ниже чем toopen
                'click .hide-block': 'hideBlock'
            },
            openBlock: function(e) {
                $('.openhide-block[content-alias]').addClass('hide');
                $('.open-block[content-alias]').show();

                var element = $('.openhide-block[content-alias=' + $(e.currentTarget).attr('content-alias') + ']');
                element.removeClass('hide');
                $(e.currentTarget).hide();
                return false;
            },
            hideBlock: function(e) {
                var element = $('.openhide-block[content-alias=' + $(e.currentTarget).attr('content-alias') + ']');
                element.addClass('hide');
                $('.open-block[content-alias=' + $(e.currentTarget).attr('content-alias') + ']').show();
                return false;
            }
        };
    }
);