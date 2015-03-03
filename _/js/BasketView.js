define( [
    'jQuery', 'Backbone', 'Underscore', 'Language', 'Config', 'BasketCollection'
], function (
    jQuery, Backbone, _, Language, Config, BasketCollection
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

                    // Set item_name_X by locale
                    var lang = Language.get();
                    alert(lang)
                    var payPalItemNames = [];
                    collection.each( function (dress) {
                        payPalItemNames.push(
                            dress.get( lang + '_name')
                        );
                    });

                    self.$el.html(
                        self.template({
                            dresses: collection.toJSON(),
                            config: Config,
                            item_names: payPalItemNames
                        })
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
        }
    });
});
