define( [
    'jQuery', 'Backbone', 'Underscore', 'Collection', 'DressView',
    "FluidMasonry"
], function (
    jQuery, Backbone, _, Collection, DressView,
    FluidMasonry
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
                    //this.model.toJSON()
                )
            );

            this.$dressContainer = jQuery('<div id="#dresses"></div>');

            this.collection.fetch({
                reset: true,
                error: function (collection, response, options) {
                    console.error('Error loading or parsing collection ', self.collection.id, collection, response);
                },
                success: function (collection, response, options) {
                    self.collection.each( function (dress) {
                        var dressView = new DressView({
                            model: dress,
                            galleryId: self.id
                        });
                        self.$dressContainer.append( dressView.el );
                        if (dressIdToShow == dress.id){
                            dressView.showModal();
                        }
                    });
                    if (! jQuery.contains(document, self.$el[0])) {
                        self.$el.insertAfter('header');
                    }
                    self.$el.append( self.$dressContainer );

                    new FluidMasonry( self.$dressContainer.get(0), {
                        minColumnWidth: '200px',
                        itemSelector: '.dress'
                    });

                    self.$el.show();
                }
            });
        }
    });
});
