define( [
    'Backbone', 'model/Dress', 'collection/Basket'
], function (
    Backbone, DressModel, BasketCollection
){
    'use strict';

    function isaNumber (v) {
        return Number( parseFloat(v) ) == v;
    }

    // \Q...\E Via MDN
    function escapeRegExp (string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    // collection/Search - use the Collection interface
    return Backbone.Collection.extend({
        basket: new BasketCollection(),

        initialize: function (options) {
            this.stock = options.stock;
        },

        search: function (options){
            options.q = options.q || '';

            var self = this,
                numberSearch =  isaNumber( options.q ),
                re = new RegExp( escapeRegExp( options.q ), 'ig' );

            console.log( "Search: numberSearch? %s. Re: ", numberSearch, re);

            // Backbone.Collection.where is vague:
            this.stock.forEach( function (dress){
                _.every(dress.attributes, function (value, attr) {
                    var found = false;
                    if (numberSearch){
                        if (isaNumber(value) && value == options.q ){
                            console.info("Number match: ", options.q);
                            found = true;
                        }
                    }
                    else {
                        var v = new String(value).toString();
                        if (re.test(v)){
                            console.info("Str match: ", value);
                            found = true;
                        }
                    }
                    if (found) {
                        self.add( dress );
                        return false;
                    } else {
                        return true;
                    }
                });
            });
        }
    });
});
