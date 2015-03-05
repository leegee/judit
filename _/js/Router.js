define( [
    'Config', 'Backbone', 'jQuery',
    'Collection', 'Splash', 'GalleryView',
    'MenuItemView', 'ContactView', 'BasketView',
    'Language',
    'BackboneLocalForage'
], function (
    Config, Backbone, jQuery,
    Collection, Splash, GalleryView,
    MenuItemView, ContactView, BasketView,
    Language
){
    'use strict';

    var collection       = new Collection(),
        splash           = new Splash({ el: '#home' }),
        contactView      = new ContactView(),
        basketView       = new BasketView({ collection: collection }),
        // dressPageView    = new DressPageView({ collection: collection }),
        galleryView      = {},
        showing          = null;

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
        var Scrolled = false;
        jQuery(window).on("scroll touchmove", function () {
            Scrolled = true;
        });
        setInterval( function () {
            if (Scrolled){
                jQuery('header').toggleClass('small', $(document).scrollTop() > 0);
                Scrolled = false;
            }
        }, 333);
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
                "search/:query/:page":      "search",
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
                console.log("Router to galleryId: ", galleryId, galleryView);
                if (galleryView.hasOwnProperty(galleryId)){
                    if (showing) {
                        showing.remove();
                    }
                    showing = galleryView[galleryId];
                    showing.render(dressId);
                }
            },

            search: function (query, page) {
                console.log('Search ', query, page);
            },

            // dress: function (dressId) {
            //     if (showing) {
            //         showing.remove();
            //     }
            //     showing = dressPageView;
            //     showing.render(dressId);
            // },

            basket: function () {
                if (showing) {
                    showing.remove();
                }
                showing = basketView;
                showing.render();
            }
        });
    }

    Language.init();
    Language.set();

    return promiseToCreateRouter;
});
