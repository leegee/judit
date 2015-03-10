define( [
    'jQuery', 'Backbone', 'Underscore', 'Router', 'Language',
    'PictureFill'
], function (
    jQuery, Backbone, _, promiseToCreateRouter, Language
){
    'use strict';

    /* Create a copy of the menu for non-mobile */
    function setVariableHeader () {
        var MenuBar       = jQuery('header.nav-ctrl').clone(),
            MenuBarHeight = null,
            Scrolled      = false;

        MenuBar.removeClass('nav-ctrl');
        MenuBar.addClass('menubar');
        jQuery(document.body).prepend( MenuBar );
        MenuBarHeight = MenuBar.height();

        jQuery(window).on("scroll touchmove", function () {
            Scrolled = true;
        });
        setInterval( function () {
            if (Scrolled){
                Scrolled = false;
                jQuery(document.body).toggleClass(
                    'scrolled',
                    jQuery(document).scrollTop() > MenuBarHeight
                );
            }
        }, 333);
    }

    // view/Main
    return Backbone.View.extend({

        initialize: function (options) {
            promiseToCreateRouter.then(
                function (AppRouter) {
                    var router = new AppRouter();

                    setVariableHeader();

                    Language.init();
                    Language.set();

                    jQuery('.nav-ctrl').on('click', function (e) {
                        jQuery(document.body).toggleClass('nav-open');
                        if (! jQuery(document.body).hasClass('nav-open')){
                        }
                    });

                    jQuery('.search').on('submit', function () {
                        router.navigate( '#/search/' + jQuery('#q').val() );
                    });

                    Backbone.history.start({pushState: false});
                },

                function (err) {
                    console.error('Error initing router', err);
                }
            );
        },

        render: function (dressIdToShow) {
        }
    });
});
