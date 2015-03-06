define( [
    'Config', 'Backbone', 'jQuery',
    'collection/Collection', 'view/Splash', 'view/Gallery',
    'view/MenuItem', 'view/Contact', 'view/Basket',
    'Language', 'view/DressModal',
    'BackboneLocalForage'
], function (
    Config, Backbone, jQuery,
    Collection, Splash, GalleryView,
    MenuItemView, ContactView, BasketView,
    Language, DressModal
){
    'use strict';

    var collection       = new Collection(),
        splash           = new Splash({ el: '#home' }),
        contactView      = new ContactView(),
        basketView       = new BasketView({ collection: collection }),
        // dressPageView    = new DressPageView({ collection: collection }),
        galleryView      = {},
        showing          = null,
        NavShow          = null,
        NavCtrl          = null,
        MenuBar          = null,
        MenuBarHeight    = null;


    var promiseToCreateRouter = new Promise( function (resolve, reject) {
        jQuery.get( Config.stockJson )

        .fail( function () {
            reject();
        })

        .done( function (responseText) {
            var galleryNames = {};
            collection.reset( responseText );
            collection.each( function (model) {
                var galleryName = model.get('gallery');
                if (typeof galleryName === 'undefined'){
                    model.set('gallery', Config.defaultGalleryName);
                    galleryName = Config.defaultGalleryName;
                };
                if (! galleryView[ galleryName ] ){
                    galleryView[ galleryName ] = new GalleryView({
                        id: galleryName,
                        collection: collection
                    });
                    new MenuItemView({id:galleryName}).render();
                }
            });

            jQuery('.nav-ctrl').on('click', function () {
                jQuery(document.body).toggleClass('nav-open');
            });

            resolve( createRouter() );
        });
    });

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
        console.log("Set nav");
        if (! jQuery(document.body).hasClass('nav-open')){
            console.log("Not av-open");
            if (jQuery(document).scrollTop() > MenuBarHeight ){
                console.log("scrollTop > MenuBarHeight");
                // MenuBar.hide();
                NavCtrl.show();
                NavShow.show();
            } else {
                console.log("scrollTop < MenuBarHeight");
                // MenuBar.show();
                NavCtrl.hide();
                NavShow.hide();
            }
        }
    }

    function createRouter () {
        return Backbone.Router.extend({
            routes: {
                "contact":                  "contact",
                "gallery/:gallery":         "gallery",
                "gallery/:gallery/:dress":  "gallery",
                "dress/:dressId":           "dress",
                "basket":                   "basket",
                "search/:query":            "search",
                "*stuff":                   "default"
            },

            // For every route change
            execute: function (callback, args) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                if (callback) {
                    callback.apply(this, args);
                }
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                jQuery('#loader').hide();
                setNav();
            },

            default: function () {
                if (showing) {
                    showing.remove();
                }
                showing = splash;
                showing.render();
            },

            contact: function () {
                if (showing) {
                    showing.remove();
                }
                showing = contactView;
                showing.render();
            },

            gallery: function (galleryId, dressId) {
                if (galleryView.hasOwnProperty(galleryId)){
                    if (showing) {
                        showing.remove();
                    }
                    showing = galleryView[galleryId];
                    showing.render(dressId);
                }
            },

            search: function (query) {
                console.log('Search ', query, page);
            },

            dress: function (dressId) {
                if (showing) {
                    showing.remove();
                }
                showing = new DressModal ({
                    model: collection.get(dressId)
                });
                showing.render();
            },

            basket: function () {
                if (showing) {
                    showing.remove();
                }
                showing = basketView;
                showing.render();
            }
        });
    }

    setVariableHeader();
    Language.init();
    Language.set();

    return promiseToCreateRouter;
});
