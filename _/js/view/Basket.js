define( [
    'jQuery', 'Backbone', 'Underscore', 'Language', 'Config'
], function (
    jQuery, Backbone, _, Language, Config
){
    'use strict';

    // view/Basket
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

        isEmpty: function () {
            return this.collection.length === 0;
        },

        // callbacks.empty
        // callbacks.notEmpty
        render: function (callbacks) {
            var self = this;
            console.log("Basket.Render");

            // Global listen causes unhappy rendering
            if (Backbone.history.fragment !== 'basket') {
                console.log("Basket?!");
                return;
            }

            this.collection.fetch({
                success: function (collection, response, options) {
                    if (collection.length > 0){
                        self.renderPage();
                        callbacks.notEmpty.apply(this);
                    } else {
                        if (Backbone.history.fragment === 'basket') {
                            // Template handles 'empty' message
                            self.renderPage();
                        }
                        else {
                            alert("Your basket is empty, not in basket view");
                        }
                        // self.renderBubble();
                    }
                },

                error: function () {
                    console.error(arguments)
                }
            });
        },

        renderPage: function () {
            // Set item_name_X by locale
            var lang = Language.get();
            var payPalItemNames = [];
            this.collection.each( function (dress) {
                payPalItemNames.push(
                    dress.get( lang + '_name')
                );
            });

            this.$el.html(
                this.template({
                    dresses: this.collection.toJSON(),
                    config: Config,
                    item_names: payPalItemNames
                })
            );
            this.$el.show();
        },

        remove: function () {
            this.$el.hide();
        },

        removeItem: function (e) {
            console.log(arguments);
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
