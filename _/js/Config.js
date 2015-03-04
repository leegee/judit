define( ['Backbone', 'BackboneLocalForage'], function (Backbone) {

    Backbone.localforage.localforageInstance.config({
        driver      : 'localStorageWrapper',
        name        : "SzaboJudit",
        storeName   : "SzaboJudit",
        version     : 1.0,
        description : 'Clothes in your basket'
    });

    return {
        stockJson: '/_/stock.json',
        defaultLang: 'en',
        defaultGalleryName: 'Gallery',
        langSupported: {
            en: 'English',
            hu: 'Magyar'
            // de: 'Deutsche'
        },
        paypalEmail: 'paypal-facilitator@leegoddard.net'
    };
});
