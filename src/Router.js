import { Config } from './Config';

import jQuery from 'jquery';
import * as Backbone from 'backbone';

import { Collection } from './collection/Collection';

import { Splash } from './view/Splash';
import { GalleryView } from './view/Gallery';
import { DressModal } from './view/DressModal';
import { ContactView } from './view/Contact';
import { BasketView } from './view/Basket';
import { MenuItemView } from './view/MenuItem';

import { SearchCollection } from './collection/Search';
import { Bubble } from './view/Bubble';
import { Source } from './service/Google';

const collection = new Collection(),
    splash = new Splash({ el: '#home' }),
    contactView = new ContactView(),
    basketView = new BasketView({ collection: collection.basket }),
    basketEmptyBubble = new Bubble({
        menuItemSelector: '.menubar .menu-basket',
        templateSelector: '#basket-empty-bubble-template'
    }),
    galleryView = {};

let showing = null;

// Galleries are created based on stock.json
export const promiseToCreateRouter = new Promise((resolve, reject) => {
    const source = new Source();

    source.fetch()

        .fail((e) => {
            console.error("Failed to fetch collection source data", e);
            reject();
        })

        .done((responseData) => {
            // const galleryNames = {};

            responseData = source.parse(responseData);

            console.log('Got source data: ', responseData);

            collection.reset(responseData);

            // This could be a method of collection, called with
            // an 'injection' of the classe for Gallery and MenuItemView
            collection.each((model) => {
                const galleryName = model.get('gallery');
                if (typeof galleryName === 'undefined') {
                    model.set('gallery', Config.defaultGalleryName);
                    galleryName = Config.defaultGalleryName;
                }
                if (!galleryView[galleryName]) {
                    galleryView[galleryName] = new GalleryView({
                        id: galleryName,
                        collection: collection
                    });
                    new MenuItemView({ id: galleryName }).render();
                }
            });

            resolve(createRouter());
        });
});

function createRouter() {
    return Backbone.Router.extend({

        routes: {
            "contact": "contact",
            "gallery/:gallery": "gallery",
            "gallery/:gallery/:dress": "gallery",
            "dress/:dressId": "dress",
            "basket": "basket",
            "search/:query": "search",
            "*stuff": "default"
        },

        // For every route change
        execute: function (callback, args) {
            console.info("Route changed", callback ? 'with callback' : 'without callback');
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            if (callback) {
                console.info("Route changed", this, args, callback);
                callback.apply(this, args);
            }
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            jQuery('#loader').hide();
        },

        default: function () {
            console.log('Enter default route');
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
            if (galleryView.hasOwnProperty(galleryId)) {
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
            const searchCollection = new SearchCollection({
                stock: collection
            });
            console.log('search collection: ', searchCollection);
            searchCollection.search({ q: query });
            console.log('search collection after searching q=[%s]: ', query, searchCollection);
            showing = new GalleryView({
                collection: searchCollection
            });
            console.log('showing=', showing);
            showing.render();
        },

        dress: function (dressId) {
            if (showing) {
                showing.remove();
            }
            showing = new DressModal({
                model: collection.get(dressId)
            });
            showing.render();
        },

        basket: function () {
            basketView.isEmpty((empty) => {
                console.log("Router.basket empty?", empty);
                if (empty) {
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
