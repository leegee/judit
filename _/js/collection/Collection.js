define( [
    'Backbone', 'model/Dress', 'collection/Basket'
], function (
    Backbone, DressModel, BasketCollection
){
    'use strict';
    // Collection
    return Backbone.Collection.extend({
        model: DressModel,
        basket: new BasketCollection()
    });
});
