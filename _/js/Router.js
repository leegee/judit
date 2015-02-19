define( [
    'Backbone', 'jQuery', 'VerticalSlideShow', 'Splash', 'GalleryView',
    'MenuItemView', 'ContactView',
    'SlickNav'
], function (
    Backbone, jQuery, VerticalSlideShow, Splash, GalleryView,
    MenuItemView, ContactView
){
    'use strict';

    var collectionDir = '/_/collection/';

    var showing = null;

    var splash = new Splash({ el: '#home' });
    var galleryView = {};
    var contactView = new ContactView();

    var promiseToCreateRouter = new Promise( function (resolve, reject) {
        jQuery.get(collectionDir)
        .fail( function () {
            reject();
        })
        .done( function (responseText) {
            var links = responseText.match(/a href="([^"]+)\.json"/);
            for (var i=1; i<links.length; i++){
                var url = collectionDir + links[i] + '.json';
                galleryView[ links[i] ] = new GalleryView({
                    url: url,
                    id: links[i]
                });
                new MenuItemView({id:links[i]}).render();
            }

            jQuery('#menu').slicknav({
                prependTo: 'body'
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
                if (galleryView.hasOwnProperty(galleryId)){
                    if (showing) {
                        showing.remove();
                    }
                    showing = galleryView[galleryId];
                    showing.render(dressId);
                }
            },

            search: function (query, page) {
                console.log('Search ', query, page)
            }
        });
    };

    return promiseToCreateRouter;
});
