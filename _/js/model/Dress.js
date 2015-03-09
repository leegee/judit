define( [
    'Backbone', 'Config', 'model/Basket'
], function (
    Backbone, Config, BasketModel
){
    // DressModel
    return Backbone.Model.extend({
        // collection: Collection,
        ifBasketed: function (next) {
            var self = this;
            this.collection.basket.fetch({
                success: function (collection) {
                    var found = collection.where({ id: self.get('id') });
                    var rv = typeof found !== undefined && found.length >0;
                    self.set('inBasket', rv);
                    next( rv );
                }
            });
        },
        addToBasket: function () {
            var self = this;
            this.collection.basket.create( this.dataForStore(), {
                success: function () {
                    self.set('inBasket', true);
                }
            } );
        },
        removeFromBasket: function () {
            var self = this;
            console.log("Modal, remove");
            this.collection.basket.remove( this.dataForStore(), {
                success: function () {
                    self.set('inBasket', false);
                }
            } );
        },
        dataForStore: function () {
            return new BasketModel({
                collection: this.collection, // ?
                id:       this.get('id'),
                gallery:  this.get('gallery'),
                en_name:  this.get('en_name'),
                hu_name:  this.get('hu_name'),
                thumb:    this.get('thumb'),
                price:    this.get('price'),
                shipping: this.get('shipping')
            });
        },
        defaults: {
            inBasket: null,
            id: null,
            gallery: Config.defaultGalleryName,
            price: 100000,
            shipping: 10000,
            en_name: "Default Name",
            en_size: "Default Size",
            en_tagline: "Default Tag Line",
            en_standfirst: "Default Stand First",
            en_blurb: "Default Blurb.",
            hu_name: "Default Name",
            hu_size: "Default Size",
            hu_tagline: "Default Tag Line",
            hu_standfirst: "Default Stand First",
            hu_blurb: "Default Blurb.",
            thumb: "/bower_components/js-vertical-slideshow/eg/img/1.png",
            zoomable: "/bower_components/js-vertical-slideshow/eg/img/1.png"
        }
    });
});
