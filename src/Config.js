import { Backbone } from 'backbone';

Backbone.localforage.localforageInstance.config({
    driver: 'localStorageWrapper',
    name: "SzaboJudit",
    storeName: "SzaboJudit",
    version: 1.0,
    description: 'Clothes in your basket'
});

export const Config = {
    localStockJson: '/_/stock.json',
    googleJson: {
        uri: null,
        pre: 'https://spreadsheets.google.com/feeds/list/',
        key: '1S18SDKfweYtikvyiwUUuLeoDjVXT_k6q4b00f8LUsXs',
        post: '/od6/public/values',
        data: {
            alt: 'json-in-script',
            callback: 'callback'
        },
    },
    defaultLang: 'en',
    defaultGalleryName: 'Gallery',
    langSupported: {
        en: 'English',
        hu: 'Magyar'
        // de: 'Deutsche'
    },
    paypalEmail: 'paypal-facilitator@leegoddard.net'
};

Config.googleJson.uri = Config.googleJson.pre + Config.googleJson.key + Config.googleJson.post;

