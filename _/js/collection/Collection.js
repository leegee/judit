define( [
    'Backbone', 'Model/Dress', 'collection/Basket'
], function (
    Backbone, DressModel, BasketCollection
){
    'use strict';

    // Collection
    return Backbone.Collection.extend({
        model: DressModel,
        basket: new BasketCollection(),
        initialize: function (options) {
          //  this.url = options.url;
        }
    });
});
