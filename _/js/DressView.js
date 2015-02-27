define( [
    'jQuery', 'Backbone', 'Underscore', 'Modal', 'DressViewModal'
], function (
    jQuery, Backbone, _, Modal, DressViewModal
){
    'use strict';

    var THUMBS_MADE = 0;

    var DressView =  Backbone.View.extend({
        thumbLoaded: function () { throw new Error("Override me"); },
        className: 'dress grow',
        galleryId: null,
        events: {
            click: "showModal"
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

        showModal: function () {
            new DressViewModal({
                model:   this.model,
                baseUrl: this.url
            }).render();
        }
    });

    return DressView;
});
