import { Backbone } from 'backbone';
import { Config } from '../Config';
import { BasketModel } from '../model/Basket';

export const DressModel = Backbone.Model.extend({
    // collection: Collection,
    ifBasketed: function (next) {
        var self = this;
        this.collection.basket.fetch({
            success: function (collection) {
                var found = collection.where({ id: self.get('id') });
                var rv = typeof found !== undefined && found.length > 0;
                self.set('inBasket', rv);
                if (next) {
                    next(rv);
                }
            }
        });
    },
    addToBasket: function () {
        var self = this;
        this.collection.basket.create(this.dataForStore(), {
            success: function () {
                self.set('inBasket', true);
            }
        });
    },
    removeFromBasket: function () {
        var self = this;
        console.log("Modal, remove");
        this.collection.basket.remove(this.dataForStore(), {
            success: function () {
                self.set('inBasket', false);
            }
        });
    },
    dataForStore: function () {
        return new BasketModel({
            collection: this.collection, // ?
            id: this.get('id'),
            gallery: this.get('gallery'),
            'en-name': this.get('en-name'),
            'hu-name': this.get('hu-name'),
            thumb: this.get('thumb'),
            price: this.get('price'),
            shipping: this.get('shipping')
        });
    },
    defaults: {
        inBasket: null,
        id: null,
        gallery: Config.defaultGalleryName,
        price: 100000,
        shipping: 10000,
        'en-name': "Default Name",
        'en-size': "Default Size",
        'en-tagline': "Default Tag Line",
        'en-standfirst': "Default Stand First",
        'en-blurb': "Default Blurb.",
        'hu-name': "Default Name",
        'hu-size': "Default Size",
        'hu-tagline': "Default Tag Line",
        'hu-standfirst': "Default Stand First",
        'hu-blurb': "Default Blurb.",
        thumb: "js-vertical-slideshow/eg/img/1.png",
        zoomable: "js-vertical-slideshow/eg/img/1.png"
    }
});