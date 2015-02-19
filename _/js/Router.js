define( [
    'Backbone', 'jQuery', 'VerticalSlideShow', 'Splash', 'GalleryView',
    'MenuItemView', 'ContactView',
    'SlickNav'
], function (
    Backbone, jQuery, VerticalSlideShow, Splash, GalleryView,
    MenuItemView, ContactView
){
    'use strict';

    setLanguage();

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
                // parentTag: 'ul'
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

    function setLanguage (lang) {
        lang = lang || navigator.language.match('^(..)')[1];
        var langSupported = ['en', 'hu'];
        if (! _.contains(langSupported, lang)){
            lang = langSupported[0];
        }
        var styles = [];
        for (var i=0; i<langSupported.length; i++){
            if (langSupported[i] != lang){
                styles.push( "[lang='"+langSupported[i]+"']" );
            }
        }
        jQuery('#set-languages').remove();
        var html = "<style id='set-languages'>" +
            styles.join(",") +
            " { display:none; background:yellow }</style>";
        jQuery(html).appendTo("head");

        jQuery("[data-setlang]").show();
        jQuery("[data-setlang="+lang+"]").hide();

        jQuery('.change-language').on('click', function (e) {
            var lang = 'en';
            if (this.dataset.setlang && _.contains(langSupported, this.dataset.setlang)){
                lang = this.dataset.setlang;
            }
            console.info('lang to ', lang )
            setLanguage( lang );
        });
    }

    return promiseToCreateRouter;
});
