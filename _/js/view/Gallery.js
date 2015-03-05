define( [
    'jQuery', 'Backbone', 'Underscore', 'collection/Collection',
    'view/DressView', 'view/Loader', "FluidMasonry"
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
            this.collection = options.collection;
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
            });

            var loader = new Loader({ total: self.collection.length });
            // if (! this.loaded) {
                loader.show();
            // }

            var showDressAsModal;
            var promiseToLoadAllImages = [];
            _.each( this.collection.where({ gallery : self.id }), function (dress) {
                promiseToLoadAllImages.push(
                    new Promise ( function (resolve, reject) {
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
            });

            var done = function () {
                loader.hide();
                self.loaded = true;
                if (showDressAsModal) {
                    showDressAsModal.showModal();
                }
            };

            Promise.all( promiseToLoadAllImages )
            .then(
                function () {
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