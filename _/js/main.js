requirejs.config({
    baseUrl: '_/js/',
    paths: {
        Underscore: '../../bower_components/underscore-amd/underscore', // -min
        Backbone: '../../bower_components/backbone-amd/backbone', // -min
        PictureFill: '../../bower_components/picturefill/dist/picturefill.min',
        SlickNav: '../../bower_components/slicknav/jquery.slicknav.min',
        VerticalSlideShow: "../../bower_components/js-vertical-slideshow/js/VerticalSlideShow",
        jQuery: "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min"
    },
    map: {
        '*': {
            jquery: 'jQuery',
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
        document.body.scrollTop = document.documentElement.scrollTop = 0;

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

