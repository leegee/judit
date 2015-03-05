define( [
    'Backbone', 'model/Basket', 'BackboneLocalForage'
], function (Backbone, BasketModel) {

    // collectin/Basket
    return Backbone.Collection.extend({
        sync: Backbone.localforage.sync('JuditCollection'),
        model: BasketModel
    });
});
