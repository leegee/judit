define( [
    'Backbone', 'DressModel'
], function (
    Backbone, DressModel
){
    'use strict';

    // Collection
    return Backbone.Collection.extend({
        model: DressModel,
        initialize: function (options) {
            this.id = options.id;
            this.url = options.url;
        }
    });
});
