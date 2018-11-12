import Backbone from 'backbone';
import * as _ from 'underscore';
import { DressModel } from '../model/Dress';
import { BasketCollection } from './Basket';

function isaNumber(v) {
    return Number(parseFloat(v)) == v;
}

// \Q...\E Via MDN
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// collection/Search - use the Collection interface
export const SearchCollection = Backbone.Collection.extend({
    basket: new BasketCollection(),
    model: DressModel,

    initialize: function (options) {
        this.stock = options.stock;
    },

    search: function (options) {
        options.q = options.q || '';

        const numberSearch = isaNumber(options.q),
            re = new RegExp(escapeRegExp(options.q), 'ig');

        this.reset();

        // Backbone.Collection.where has no regexp:
        this.stock.forEach((dress) => {
            _.every(dress.attributes, (value) => {
                let found = false;
                if (numberSearch) {
                    if (isaNumber(value) && value == options.q) {
                        console.info("Number match: ", options.q);
                        found = true;
                    }
                }
                else {
                    const v = new String(value).toString();
                    if (re.test(v)) {
                        console.info("Str match: ", value);
                        found = true;
                    }
                }
                if (found) {
                    this.add(dress);
                    return false;
                } else {
                    return true;
                }
            });
        });

    }
});
