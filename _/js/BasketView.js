define( [
    'jQuery', 'Backbone', 'Underscore', 'BasketCollection'
], function (
    jQuery, Backbone, _, BasketCollection
){
    'use strict';

    // BasketView
    return Backbone.View.extend({
        el: '#basket',

        initialize: function (options) {
            this.template   = _.template( jQuery('#basket-template').text() );
            this.collection = new BasketCollection();
        },

        render: function () {
            var self = this;
            this.collection.fetch({
                success: function (collection, response, options) {
                    console.log( 'Fetched:', arguments );
                    self.$el.html(
                        self.template({ dresses: self.collection.toJSON() })
                    );
                    self.$el.show();
                }
            });
        },

        remove: function () {
            this.$el.hide();
        }
    });
});
