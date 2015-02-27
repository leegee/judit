define( ['Backbone', 'BackboneLocalForage'], function (Backbone) {
    // Backbone.localforage.configure({
    //     name        : 'Judit',
    //     version     : 1.0,
    //     storeName   : 'SzaboJudit',
    //     description : 'Clothes in your basket'
    // });

    return {
        defaultLang: 'en',
        langSupported: {
            en: 'English',
            hu: 'Hungarian'
        },
        collectionDir: '/_/collection/'
    };
});
