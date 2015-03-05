define( [
    'Backbone', 'BackboneLocalForage'
], function (Backbone) {
    // BasketModel
    return Backbone.Model.extend({
        sync: Backbone.localforage.sync('JuditModel')
    });
});
