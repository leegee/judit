import * as Backbone from 'backbone';
import { Config } from '../Config';
import { BasketModel } from '../model/Basket';

export const DressModel = Backbone.Model.extend({
    // collection: Collection,
    ifBasketed: function (next) {
        this.collection.basket.fetch({
            success: (collection) => {
                const found = collection.where({ id: this.get('id') });
                const rv = typeof found !== undefined && found.length > 0;
                this.set('inBasket', rv);
                if (next) {
                    next(rv);
                }
            }
        });
    },
    addToBasket: function () {
        this.collection.basket.create(this.dataForStore(), {
            success: () => {
                this.set('inBasket', true);
            }
        });
    },
    removeFromBasket: function () {
        console.log("Modal, remove");
        this.collection.basket.remove(this.dataForStore(), {
            success: () => {
                this.set('inBasket', false);
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