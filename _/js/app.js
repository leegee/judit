/* global requirejs */

requirejs.config({
    baseUrl: '_/js/',
    paths: {
        Underscore: '../../bower_components/underscore-amd/underscore-min',
        Backbone: '../../bower_components/backbone/backbone',
        localforage: '../../bower_components/localforage/dist/localforage',
        BackboneLocalForage: '../../bower_components/localforage-backbone/dist/localforage.backbone',
        PictureFill: '../../bower_components/picturefill/dist/picturefill.min',
        SlickNav: '../../bower_components/slicknav/jquery.slicknav.min',
        VerticalSlideShow: "../../bower_components/js-vertical-slideshow/js/VerticalSlideShow",
        jQuery: "../../bower_components/jquery/dist/jquery.min", // "//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
        Masonry: "../../bower_components/fluid-masonry/fluid-masonry",
        FluidMasonry: "../../bower_components/jquery-masonry/masonry",
        outlayer: '../../bower_components/outlayer/',
        'get-size': '../../bower_components/get-size/',
        eventie: '../../bower_components/eventie/',
        'doc-ready': '../../bower_components/doc-ready/',
        'eventEmitter': '../../bower_components/eventEmitter/',
        'matches-selector': '../../bower_components/matches-selector/',
        'get-style-property': '../../bower_components/get-style-property/'
    },
    map: {
        '*': {
            jquery: 'jQuery',
            backbone: 'Backbone',
            underscore: 'Underscore'
        }
    },
    shim: {
        jQuery: {
            exports: 'jQuery'
        },
        SlickNav: {
            deps: ['jQuery']
        },
        Backbone: {
            deps: ['Underscore']
        },
        Underscore: {
            exports: '_'
        },
        localforage: {
            deps: ['Backbone']
        },
        BackboneLocalForage: {
            deps: ['Backbone', 'localforage']
        }
    }
});

requirejs([
    'jQuery', 'Backbone', 'Router', 'PictureFill'
], function (
    jQuery, Backbone, promiseToCreateRouter
) {
    'use strict';
    jQuery(document).ready( function () {
        promiseToCreateRouter.then(
            function (Router) {
                new Router();
                Backbone.history.start({pushState: false});
            },
            function (err) {
                console.error('Error initing router', err);
            }
        );
    });
});

