define( [
    'Config',
    'Backbone', 'jQuery', 'Splash', 'GalleryView',
    'MenuItemView', 'ContactView', 'BasketView',
    'BackboneLocalForage', 'SlickNav'
], function (
    Config, Backbone, jQuery, Splash, GalleryView,
    MenuItemView, ContactView, BasketView
){
    'use strict';

    Backbone.localforage.localforageInstance.config({
        // driver: 'localStorageWrapper',
        name: "SzaboJudit",
        storeName: "SzaboJudit"
    });

    var promiseToCreateRouter = new Promise( function (resolve, reject) {
        jQuery.get(Config.collectionDir)

        .fail( function () {
            reject();
        })

        .done( function (responseText) {
            var links = responseText.match(/a href="([^"]+)\.json"/);
            for (var i=1; i<links.length; i++){
                var url = Config.collectionDir + links[i] + '.json';
                galleryView[ links[i] ] = new GalleryView({
                    url: url,
                    id: links[i]
                });
                new MenuItemView({id:links[i]}).render();
            }

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

            basket: function () {
                if (showing) {
                    showing.remove();
                }
                showing = basketView;
                showing.render();
            }
        });
    }

    function setLanguage (lang) {
        var qs = document.location.search.match(/^\?(..)/);
        if (qs != null && qs.length > 0) {
            qs = qs[1];
        }
        lang = lang || qs || navigator.language.match('^(..)')[1];

        if (!Config.langSupported[lang]){
            lang = Config.defaultLang;
        }

        var styles = [];
        Object.keys(Config.langSupported).forEach( function (i,j){
            if (i !== lang){
                styles.push( "[lang='"+i+"']" );
            }
        });
        jQuery('#set-languages').remove();
        var html = "<style id='set-languages'>" +
            styles.join(",") +
            " { display:none; background:yellow }</style>";
        jQuery(html).appendTo("head");

        jQuery("[data-setlang]").show();
        jQuery("[data-setlang="+lang+"]").hide();

        jQuery('.change-language').on('click', function (e) {
            var lang = 'en';
            if (this.dataset.setlang && Config.langSupported[ this.dataset.setlang ]){
                lang = this.dataset.setlang;
            }
            setLanguage( lang );
        });
    }

    setLanguage();

    jQuery('#loading').hide();
    jQuery('header').show();
    jQuery('footer').show();

    var splash           = new Splash({ el: '#home' }),
        contactView      = new ContactView(),
        basketView       = new BasketView(),
        galleryView      = {},
        showing          = null;

    // Backbone.localforage.config({name:'foo'});


    return promiseToCreateRouter;
});
