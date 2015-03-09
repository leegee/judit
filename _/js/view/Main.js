define( [
    'jQuery', 'Backbone', 'Underscore', 'Router', 'Language',
    'PictureFill'
], function (
    jQuery, Backbone, _, promiseToCreateRouter, Language
){
    'use strict';

    var NavShow          = null,
        NavCtrl          = null,
        MenuBar          = null,
        MenuBarHeight    = null;

    function setVariableHeader () {
        NavShow          = jQuery('#nav-show');
        NavCtrl          = jQuery('header.nav-ctrl');
        MenuBar          = NavCtrl.clone();
        MenuBarHeight    = null;
        MenuBar.removeClass('nav-ctrl');
        MenuBar.addClass('menubar');
        jQuery(document.body).prepend( MenuBar );
        MenuBarHeight = MenuBar.height();

        var Scrolled = false;
        jQuery(window).on("scroll touchmove", function () {
            Scrolled = true;
        });
        setInterval( function () {
            if (Scrolled){
                Scrolled = false;
                // jQuery('header').toggleClass('small', jQuery(document).scrollTop() > 0);
                setNav();
            }
        }, 333);
    }

    function setNav () {
        if (! jQuery(document.body).hasClass('nav-open')){
            if (jQuery(document).scrollTop() > MenuBarHeight ){
                // MenuBar.hide();
                NavCtrl.show();
                NavShow.show();
            } else {
                // MenuBar.show();
                NavCtrl.hide();
                NavShow.hide();
            }
        }
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

                    jQuery('.nav-ctrl').on('click', function () {
                        jQuery(document.body).toggleClass('nav-open');
                    });

                    jQuery('#search').on('submit', function () {
                        alert(1)
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
