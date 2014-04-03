/**
 * Т.к. во всех модулях используется
 * объект Backbone в коде выплнения самого 
 * модуля(а не в возвращаемой функции, например), 
 * Backbone должен быть загружен когда подключается 
 * модуль, так что я сделал своеобразный "фасад". Этот 
 * модуль будет подключаться вместо связки 
 * Backbone + jquery + unaerscore + может-что-то-еще.
 * 
 * UPD: Да, не очень хрошее решение. Дополнительное описание есть в /app/frontEnd.js
 */
define([
        'jquery',
        'underscore',
        'backbone',
        'views/common/notification'
    ], 
    function($, _, Backbone, notification) {
        window.notification = notification;
        return {};
    }
);