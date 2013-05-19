/*
 * Этот обеъект наследуется вьюшкой, реализует функционал 
 * открытия и скрывания некого блока по событиям клика на кнопки "открыть" и "закрыть". 
 * Кнопки и блок находят друг друга по аттрибуту content-alias.
 * У блока, который надо показывать и скрывать дожен быть класс openhide-block,
 * у кнопок "открыть" и "закрыть" должны быть классы open-block и hide-block соответственно.
 *
 * В данном случе наследование не самое удобное решение, но в будущем может пригодится в качестве образца.
 */
define([
        'boilerplate'
    ],
    function(boilerplate) {
        return {
            events: {
                'click .open-block': 'openBlock',
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