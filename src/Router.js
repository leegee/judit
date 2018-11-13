import { Config } from './Config';

import jQuery from 'jquery';
import Backbone from 'backbone';

import { Splash } from './view/Splash';
import { GalleryView } from './view/Gallery';
import { DressModal } from './view/DressModal';
import { ContactView } from './view/Contact';
import { BasketView } from './view/Basket';
import { MenuItemView } from './view/MenuItem';
// import { Bubble } from './view/Bubble';

import { Collection } from './collection/Collection';
import { SearchCollection } from './collection/Search';

import { Source } from './service/Google';

const collection = new Collection(),
    splashView = new Splash({ el: '#home' }),
    contactView = new ContactView(),
    basketView = new BasketView({ collection: collection.basket }),
    // basketEmptyBubble = new Bubble({
    //     menuItemSelector: '.menubar .menu-basket',
    //     templateSelector: '#basket-empty-bubble-template'
    // }),
    galleryView = {};

let showing = null;
let showingSelector;

const _show = (what) => {
    if (showing) {
        console.log('_show is hiding', showingSelector);
        showing.remove();
        document.querySelector(showingSelector).style.display = 'none';
    }
    showing = what.child || what;
    showingSelector = showing.selector;
    showing.render();
    document.querySelector(showingSelector).style.display = 'block';
    console.log('_show has shown ', showingSelector);
};


export const promiseToCreateRouter = new Promise((resolve, reject) => {
    const source = new Source();

    source.fetch()
        .fail((e) => {
            console.error("Failed to fetch collection source data", e);
            reject();
        })

        .done((responseData) => {
            const collectionFeed = source.parse(responseData);
            console.log('Got collection data: ', collectionFeed);
            collection.reset(collectionFeed);

            // This could be a method of collection, called with
            // an injection of the classe for Gallery and MenuItemView
            collection.each((model) => {
                const galleryName = model.get('gallery');
                if (typeof galleryName === 'undefined') {
                    console.log('set default gallery');
                    model.set('gallery', Config.defaultGalleryName);
                    galleryName = Config.defaultGalleryName;
                }
                if (!galleryView[galleryName]) {
                    console.log('new gallery:', galleryName);
                    galleryView[galleryName] = new GalleryView({
                        id: galleryName,
                        collection: collection
                    });
                    new MenuItemView({
                        id: galleryName,
                        title: galleryView[galleryName].title
                    }).render();
                    
                    galleryView[galleryName].render();
                    // document.querySelector(this.selector).style.display = 'block';
                } else {
                    console.log('duplicate gallery,', galleryName);
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
            showing = splashView;
            showing.render();
        },

        contact: function () {
            console.log('enter contact');
            if (showing) {
                showing.remove();
            }
            showing = contactView;
            showing.render();
        },

        gallery: function (galleryId, dressId) {
            console.log('routed to gallery', galleryId, dressId)
            if (galleryView.hasOwnProperty(galleryId)) {
                if (showing) {
                    showing.remove();
                }
                showing = galleryView[galleryId];
                console.log('set gallery to ', galleryView[galleryId]);
                showing.render(dressId);
            } else {
                console.log('no such gallery as ', galleryId);
            }
        },

        search: function (query) {
            console.log('routed to search', query);
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
                id: 'search_results',
                collection: searchCollection
            });
            showing.render();
        },

        dress: function (dressId) {
            console.log('routed to dress', dressId);
            if (showing) {
                showing.remove();
            }
            showing = new DressModal({
                model: collection.get(dressId)
            });
            showing.render();
        },

        basket: function () {
            console.log('routed to basket');
            basketView.isEmpty((empty) => {
                console.log("Router.basket empty?", empty);
                // if (empty) {
                //     basketEmptyBubble.render();
                //     Backbone.history.history.back();
                // } else {
                if (showing) {
                    showing.remove();
                }
                showing = basketView;
                showing.render();
                // }
            });
        }
    });
}
