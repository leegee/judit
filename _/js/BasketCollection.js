define( [
    'Backbone', 'BasketModel', 'BackboneLocalForage'
], function (Backbone, BasketModel) {

    // BasketCollection
    return Backbone.Collection.extend({
        sync: Backbone.localforage.sync('JuditCollection'),
        model: BasketModel
    });
});
