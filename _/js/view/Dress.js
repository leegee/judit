define( [
    'jQuery', 'Backbone', 'Underscore', 'view/Modal', 'view/DressModal'
], function (
    jQuery, Backbone, _, Modal, DressModal
){
    'use strict';

    // Use classProperties
    var THUMBS_MADE = 0;

    // view Dress
    return Backbone.View.extend({
        thumbLoaded: function () { throw new Error("Override me"); },
        className: 'dress grow',
        galleryId: null,
        events: {
            click: "showModal"
            // click: "showDressPage"
        },

        initialize: function (options) {
            this.galleryId = options.galleryId;
            this.thumbLoaded = options.thumbLoaded;
            this.url = '#/gallery/' + options.galleryId;
            this.template = _.template( jQuery('#dress-template').text() );
            this.thumbId = 'thumb' + (++THUMBS_MADE);
            this.render();
        },

        render: function () {
            var self = this;
            this.el.id = this.model.get('id');
            this.model.set('thumbId', this.thumbId);

            var img = new Image ();
            img.src = this.model.get('thumb');
            img.onload = function () {
                self.thumbLoaded();
                self.$el.html(
                    self.template( self.model.toJSON() )
                );
            };
        },

        showDressPage: function () {
            Backbone.history.navigate('#/dress/' + this.model.get('id'));
        },

        showModal: function () {
            new DressModal({
                model: this.model
            }).render();
        }
    });
});
