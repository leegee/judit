import * as jQuery from 'jquery';
import _ from 'underscore';
import { Config } from '../Config';
import Backbone from 'backbone';
import { Languages } from '../service/Language';


export const BasketView = Backbone.View.extend({
    el: '#basket',
    selector: '#basket',
    events: {
        'click .checkout': 'checkout',
        'click .remove': 'removeItem'
    },

    initialize: function() {
        this.template = _.template(
            jQuery('#basket-template').text()
        );
        this.listenTo(this.collection, 'remove', this.removedItem);
    },

    isEmpty: function (then) {
        this.collection.fetch({
            success: function (collection) {
                then(collection.length === 0);
            }
        });
    },

    // callbacks.empty
    // callbacks.notEmpty
    render: function (callbacks) {
        this.listenTo(Languages, 'change', this.render);
        console.log("Basket.Render");

        // Global listen causes unhappy rendering
        if (Backbone.history.fragment !== 'basket') {
            console.log("Basket?!");
            return;
        }

        this.collection.fetch({
            success: (collection) => {
                if (collection.length > 0) {
                    this.renderPage();
                    if (callbacks) {
                        callbacks.notEmpty.apply(this);
                    }
                } else if (Backbone.history.fragment === 'basket') {
                    // Template handles 'empty' message
                    this.renderPage();
                    window.scrollTo(0, 0);
                } else {
                    console.error("Unexpecte");
                    console.trace();
                }
            },

            error: function () {
                console.error(arguments)
            }
        });
    },

    renderPage: function () {
        // Set item_name_X by locale
        const lang = Languages.get();
        const payPalItemNames = [];
        this.collection.each((dress) => {
            payPalItemNames.push(
                dress.get(lang + '-name')
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
        document.querySelector(this.selector).style.display = 'block';
    },

    remove: function () {
        this.$el.hide();
        document.querySelector(this.selector).style.display = 'none';
        this.stopListening(Languages);
    },

    removeItem: function (arg) {
        console.log('remove', arg);
        this.collection.get(arg.currentTarget.dataset.dressid).destroy();
    },

    // Called from view/Modal
    removedItem: function (model) {
        // localForage does not have collection.remove
        model.destroy({
            success: () => {
                this.collection.sync('delete', model, {
                    success: () => {
                        this.render();
                    }
                });
            }
        });
    },

    checkout: function () {
        console.warn('CALLED CHECKOUT');
    }
});
