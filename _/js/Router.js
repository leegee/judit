define( [
    'Config', 'Backbone', 'jQuery',
    'Collection', 'Splash', 'GalleryView',
    'MenuItemView', 'ContactView', 'BasketView',
    'Language',
    'BackboneLocalForage', 'SlickNav'
], function (
    Config, Backbone, jQuery,
    Collection, Splash, GalleryView,
    MenuItemView, ContactView, BasketView,
    Language
){
    'use strict';

    // Backbone.localforage.localforageInstance.config({
    //     driver: 'localStorageWrapper',
    //     name: "SzaboJudit",
    //     storeName: "SzaboJudit"
    // });

    jQuery('#loading').hide();
    jQuery('header').show();
    jQuery('footer').show();

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

            jQuery('#menu').slicknav({
                prependTo: 'body',
                label: '<span lang="en">MENU</span><span lang="hu">MENÜ</span>',
                closeOnClick: true
            });

            resolve( createRouter() );
        });
    });

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
