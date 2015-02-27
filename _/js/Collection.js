define( [
    'Backbone', 'DressModel', 'BasketCollection'
], function (
    Backbone, DressModel, BasketCollection
){
    'use strict';

    // Collection
    return Backbone.Collection.extend({
        model: DressModel,
        basket: new BasketCollection(),
        initialize: function (options) {
            // this.id = options.id;
            this.url = options.url;
        }
    });
});
