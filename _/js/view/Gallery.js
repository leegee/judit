define( [
    'jQuery', 'Backbone', 'Underscore', 'collection/Collection',
    'view/Dress', 'view/Loader', "FluidMasonry"
], function (
    jQuery, Backbone, _, Collection,
    DressView, Loader, FluidMasonry
){
    'use strict';

    // view/Gallery
    return Backbone.View.extend({
        tagName: "section",
        className: "gallery",
        loaded: false,

        initialize: function (options) {
            this.id = options.id;
            this.rendered = false;
            console.log('Collection',this.collection);
            this.template = _.template( jQuery('#gallery-template').text() );
        },

        render: function (dressIdToShow) {
            var self = this;

            if (! jQuery.contains(document, self.$el[0])) {
                jQuery('#galleries').append( this.$el );
                this.$el.empty();
                this.$el.html( this.template() );
            }

            this.$dressContainer = jQuery('#dresses');
            this.$el.show();
            jQuery('#galleries').show();

            var masonry = new FluidMasonry( self.$dressContainer.get(0), {
                    minColumnWidth: '20%',
                    itemSelector: '.dress'
                }),
                showDressAsModal,
                promiseToLoadAllImages = [],

                loader = new Loader({ total: self.collection.length }).show();

            var perDress =function (dress) {
                promiseToLoadAllImages.push(
                    new Promise ( function (resolve, reject) {
                        console.log( 'DRESS', dress );
                        var dressView = new DressView({
                            model: dress,
                            collection: self.collection,
                            galleryId: self.id,
                            thumbLoaded: function (){
                                self.$dressContainer.append( dressView.el );
                                loader.increment();
                                masonry.addItems( dressView.el );
                                masonry.layout();
                                resolve();
                            }
                        });
                        if (dressIdToShow === dress.id){
                            showDressAsModal = dressView;
                        }
                    })
                )
            };

            var done = function () {
                loader.hide();
                self.loaded = true;
                if (showDressAsModal) {
                    showDressAsModal.showModal();
                }
            };

            // Should be a sub-class :(
            if (typeof self.id === 'undefined'){
                console.log("No id, using collection ", this.collection);
                // _.each( this.collection, perDress );
                this.collection.each( perDress );
                console.log("Done loop")
            }

            else {
                _.each( this.collection.where({ gallery : self.id }), perDress );
            }

            Promise.all( promiseToLoadAllImages )
            .then(
                function () {
                    console.log("OK");
                    done();
                },
                function (reason) {
                    console.error(reason);
                    done();
                }
            );
        }
    });
});
