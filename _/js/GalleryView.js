define( [
    'jQuery', 'Backbone', 'Underscore', 'Collection',
    'DressView', 'Loader', "FluidMasonry"
], function (
    jQuery, Backbone, _, Collection,
    DressView, Loader, FluidMasonry
){
    'use strict';

    // GalleryView
    return Backbone.View.extend({
        tagName: "section",
        className: "gallery",
        loaded: false,

        initialize: function (options) {
            this.id = options.id;
            this.rendered = false;
            this.collection = new Collection({ url: options.url });
            this.template = _.template( jQuery('#gallery-template').text() );
        },

        render: function (dressIdToShow) {
            var self = this;
            this.$el.empty();

            this.$el.html(
                this.template(
                    this.model? this.model.toJSON() : null
                )
            );

            if (! jQuery.contains(document, self.$el[0])) {
                self.$el.insertAfter('header');
            }

            this.$dressContainer = jQuery('#dresses');
            self.$el.show();

            var masonry = new FluidMasonry( self.$dressContainer.get(0), {
                minColumnWidth: '200px',
                itemSelector: '.dress'
            });

            this.collection.fetch({
                reset: true,
                error: function (collection, response, options) {
                    console.error('Error loading or parsing collection ', self.collection.id, collection, response);
                },
                success: function (collection, response, options) {
                    var showDressAsModal;
                    var promiseToLoadAllImages = [];
                    var loader = new Loader({ total: self.collection.length });
                    if (! self.loaded) {
                        loader.show();
                    }
                    self.collection.each( function (dress) {
                            promiseToLoadAllImages.push( new Promise ( function (resolve, reject) {
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
                            }
                        ));
                    });

                    Promise.all( promiseToLoadAllImages )
                    .then(
                        function () {
                            self.$el.append( self.$dressContainer );
                            loader.hide();
                            self.loaded = true;
                            if (showDressAsModal) {
                                showDressAsModal.showModal();
                            }
                        },
                        function (reason) {
                            console.error(reason);
                            self.$el.append( self.$dressContainer );
                            loader.hide();
                            self.loaded = true;
                            showDressAsModal.showModal();
                        }
                    );
                }
            });
        }
    });
});
