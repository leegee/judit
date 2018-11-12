import { Backbone } from 'backbone';
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

        var self = this,
            numberSearch = isaNumber(options.q),
            re = new RegExp(escapeRegExp(options.q), 'ig');

        this.reset();

        // Backbone.Collection.where has no regexp:
        this.stock.forEach(function (dress) {
            _.every(dress.attributes, function (value, attr) {
                var found = false;
                if (numberSearch) {
                    if (isaNumber(value) && value == options.q) {
                        console.info("Number match: ", options.q);
                        found = true;
                    }
                }
                else {
                    var v = new String(value).toString();
                    if (re.test(v)) {
                        console.info("Str match: ", value);
                        found = true;
                    }
                }
                if (found) {
                    self.add(dress);
                    return false;
                } else {
                    return true;
                }
            });
        });

    }
});
