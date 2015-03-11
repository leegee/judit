define( [
    'Config', 'Backbone', 'jQuery',
    'collection/Collection', 'view/Splash', 'view/Gallery',
    'view/MenuItem', 'view/Contact', 'view/Basket',
    'view/DressModal', 'collection/Search', 'view/Bubble',
    'service/Google' //  'service/Local' //
], function (
    Config, Backbone, jQuery,
    Collection, Splash, GalleryView,
    MenuItemView, ContactView, BasketView,
    DressModal, SearchCollection, Bubble,
    Source
){
    'use strict';

    var collection        = new Collection(),
        splash            = new Splash({ el: '#home' }),
        contactView       = new ContactView(),
        basketView        = new BasketView({ collection: collection.basket }),
        basketEmptyBubble = new Bubble({
            menuItemSelector: '.menubar .menu-basket',
            templateSelector: '#basket-empty-bubble-template'
        }),
        galleryView       = {},
        showing           = null;

    // Galleries are created based on stock.json
    var promiseToCreateRouter = new Promise( function (resolve, reject) {
        var source = new Source();

        source.fetch()

        .fail( function () {
            console.error("Failed to fetch collection source data");
            console.error(arguments);
            reject();
        })

        .done( function (responseData) {
            var galleryNames = {};

            responseData = source.parse(responseData);

            collection.reset( responseData );

            // This could be a method of collection, called with
            // an 'injection' of the classe for Gallery and MenuItemView
            collection.each( function (model) {
                var galleryName = model.get('gallery');
                if (typeof galleryName === 'undefined'){
                    model.set('gallery', Config.defaultGalleryName);
                    galleryName = Config.defaultGalleryName;
                }
                if (! galleryView[ galleryName ] ){
                    galleryView[ galleryName ] = new GalleryView({
                        id: galleryName,
                        collection: collection
                    });
                    new MenuItemView({id:galleryName}).render();
                }
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
                "*stuff":                   "default"
            },

            // For every route change
            execute: function (callback, args) {
                console.info("Route changed");
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
                if (galleryView.hasOwnProperty(galleryId)){
                    if (showing) {
                        showing.remove();
                    }
                    showing = galleryView[galleryId];
                    showing.render(dressId);
                }
            },

            search: function (query) {
                if (showing) {
                    showing.remove();
                }
                var searchCollection = new SearchCollection({
                    stock: collection
                });
                searchCollection.search({ q: query });
                showing = new GalleryView({
                    collection: searchCollection
                });
                showing.render();
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
                basketView.isEmpty( function (empty) {
                    console.log("Router.basket empty?", empty);
                    if (empty){
                        basketEmptyBubble.render();
                        Backbone.history.history.back();
                    } else {
                        if (showing) {
                            showing.remove();
                        }
                        showing = basketView;
                        showing.render();
                    }
                });
            }
        });
    }

    return promiseToCreateRouter;
});
