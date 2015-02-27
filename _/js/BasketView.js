define( [
    'jQuery', 'Backbone', 'Underscore', 'BasketCollection'
], function (
    jQuery, Backbone, _, BasketCollection
){
    'use strict';

    // BasketView
    return Backbone.View.extend({
        el: '#basket',
        events: {
            'click .checkout': 'checkout',
            'click .remove': 'removeItem'
        },

        initialize: function (options) {
            this.template = _.template( jQuery('#basket-template').text() );
            this.collection = new BasketCollection();
        },

        render: function () {
            var self = this;
            console.log('Render');
            this.collection.fetch({
                success: function (collection, response, options) {
                    console.log("Basket collection length:", collection.length);
                    self.$el.html(
                        self.template({ dresses: collection.toJSON() })
                    );
                    self.$el.show();
                },
                error: function () {
                    console.error(arguments)
                }
            });
        },

        remove: function () {
            this.$el.hide();
        },

        removeItem: function (e) {
            this.collection.get(
                e.currentTarget.dataset.dressid
            ).destroy({
                success: function () {
                    Backbone.history.loadUrl();
                }
            });
        },

        checkout: function () {
            alert(1)
        }
    });
});
