define( [
    'jQuery', 'Backbone', 'Underscore', 'Language', 'Config'
], function (
    jQuery, Backbone, _, Language, Config
){
    'use strict';

    // basket/View
    return Backbone.View.extend({
        el: '#basket',
        events: {
            'click .checkout': 'checkout',
            'click .remove': 'removeItem'
        },

        initialize: function (options) {
            this.template = _.template( jQuery('#basket-template').text() );
            this.listenTo( Language, 'change', this.render );
            this.listenTo( this.collection, 'remove', this.removedItem);
        },

        render: function () {
            var self = this;
            console.log("Basket.Render");

            // Global listen causes unhappy rendering
            if (Backbone.history.fragment !== 'basket') {
                console.log("Basket?!");
                return;
            }

            this.collection.fetch({
                success: function (collection, response, options) {

                    // Set item_name_X by locale
                    var lang = Language.get();
                    var payPalItemNames = [];
                    collection.each( function (dress) {
                        console.log(dress);
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
            console.log(this);
            this.collection.get( e.currentTarget.dataset.dressid ).destroy();
        },

        // Called from view/Modal
        removedItem: function (model) {
            // localForage does not have collection.remove
            var self = this;
            model.destroy({
                success: function () {
                    self.collection.sync('delete', model, {
                        success: function () {
                            self.render();
                        }
                    });
                }
            });
        },

        checkout: function () {
        }
    });
});
