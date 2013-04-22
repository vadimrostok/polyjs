/**
 * Т.к. во всех модулях используется
 * объект Backbone в коде выплнения самого 
 * модуля(а не в возвращаемой функции, например), 
 * Backbone должен быть загружен когда подключается 
 * модуль, так что я сделал своеобразный "фасад". Этот 
 * модуль будет подключаться вместо связки 
 * Backbone + jquery + unaerscore + может-что-то-еще.
 */
define([
        'jquery',
        'underscore',
        'backbone'
    ], 
    function($, _, Backbone){
        return {};
    }
);
/*
define([
        'boilerplate'
    ], 
    function(boilerplate) {
        
    }
);
*/