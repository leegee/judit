define( [
    'jQuery', 'Backbone', 'Underscore', 'Modal'
], function (
    jQuery, Backbone, _, Modal
){
    'use strict';

    var MODAL = new Modal({
        templateCompiled: _.template( jQuery('#modal-dress-template').text()),
        $el: jQuery('#modal-dress')
    });

    var THUMBS_MADE = 0;

    var DressView =  Backbone.View.extend({
        thumbLoaded: function () { throw new Error("Override me") },
        className: 'dress grow',
        galleryId: null,
        events: {
            click: "showModal",
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
            };

            this.$el.html(
                this.template( this.model.toJSON() )
            );
        },

        showModal: function () {
            var self = this;

            MODAL.show({
                model: this.model.toJSON(),
                showUrl: this.url+'/'+this.model.id,
                closeUrl: this.url
            });

            this.$dressInfo = jQuery('#dress-info');

            this.zoomContainer = { $el : jQuery('#zoom-container') };
            this.zoomContainer.width  = this.zoomContainer.$el.width();
            this.zoomContainer.height = this.zoomContainer.$el.height();

            this.zoomable = { $el : jQuery('#zoomable') };
            this.zoomable.offset = this.zoomable.$el.offset();

            this.zoomed = { $el : jQuery('#zoomed') };
            this.zoomed.$el.attr('src', this.model.get('zoomed') );
            jQuery.when(
                this.zoomable.$el.load(),
                this.zoomed.$el.load(),
                jQuery.Deferred( function (promise) {
                    jQuery(promise.resolve);
                })
            ).done(function() {
                self.zoomable.$el.css(
                    self.zoomable.$el.width() > self.zoomable.$el.height? 'width' : 'height',
                    '100%'
                );
                self.zoomable.pcWidth  = self.zoomable.$el.width()  / 100;
                self.zoomable.pcHeight = self.zoomable.$el.height() / 100;
                self.zoomed.pcWidth    = self.zoomed.$el.width()  / 100;
                self.zoomed.pcHeight   = self.zoomed.$el.height() / 100;
                self.zoomable.$el.on('mouseenter.zoom', function (e) {
                    self.$dressInfo.hide();
                    self.zoomed.$el.show();
                    self.zoomable.$el.on('mousemove.zoom', function (e) {
                        self.zoom(e);
                    });
                });
                self.zoomable.$el.on('mouseleave.zoom', function (e) {
                    self.zoomable.$el.off('mousemove.zoom');
                    self.zoomed.$el.hide();
                    self.$dressInfo.show();
                });
            });
        },

        zoom: function (e) {
            // Position within the source image:
            // adding/removing a bit because of the *em offset caused
            // by the 'close' button :(
            var x  = e.pageX - this.zoomable.offset.left - 30,
                y  = e.pageY - this.zoomable.offset.top - 40;
            // As a percentage:
            x = x / this.zoomable.pcWidth;
            y = y / this.zoomable.pcHeight;
            // Position in the zoomed image:
            x = x * this.zoomed.pcWidth;
            y = y * this.zoomed.pcHeight;
            this.zoomed.$el.css({
                left: x * -1,
                top:  y * -1
            })
        }
    });

    return DressView;
});
