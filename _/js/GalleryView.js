define( [
    'jQuery', 'Backbone', 'Underscore', 'Collection', 'DressView',
    'Loader', "FluidMasonry"
], function (
    jQuery, Backbone, _, Collection, DressView,
    Loader, FluidMasonry
){
    'use strict';

    // GalleryView
    return Backbone.View.extend({
        tagName: "section",
        className: "gallery",

        initialize: function (options) {
            this.id = options.id;
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

            this.collection.fetch({
                reset: true,
                error: function (collection, response, options) {
                    console.error('Error loading or parsing collection ', self.collection.id, collection, response);
                },
                success: function (collection, response, options) {
                    var promiseToLoadAllImages = [];
                    var loader = new Loader({ total: self.collection.length });
                    loader.show();
                    self.collection.each( function (dress) {
                        promiseToLoadAllImages.push( new Promise ( function (resolve, reject) {
                            if (dressIdToShow == dress.id){
                                dressView.showModal();
                            }
                            var dressView = new DressView({
                                model: dress,
                                galleryId: self.id,
                                thumbLoaded: function (){
                                    self.$dressContainer.append( dressView.el );
                                    loader.increment();
                                    resolve();
                                }
                            });
                        }));
                    });

                    Promise.all( promiseToLoadAllImages )
                    .then(
                        function () {
                            self.$el.append( self.$dressContainer );
                            new FluidMasonry( self.$dressContainer.get(0), {
                                minColumnWidth: '200px',
                                itemSelector: '.dress'
                            });
                            self.$el.show();
                            loader.hide();
                        },
                        function (reason) {
                            alert("There was a problem loading the dresses");
                            console.error(reason);
                        }
                    );
                }
            });
        }
    });
});
