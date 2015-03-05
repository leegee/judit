define( [
    'Backbone', 'BackboneLocalForage'
], function (Backbone) {
    // model/Basket
    return Backbone.Model.extend({
        sync: Backbone.localforage.sync('JuditModel')
    });
});
