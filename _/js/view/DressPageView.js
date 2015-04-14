define( [
    'jQuery', 'Backbone', 'Underscore', 'view/Dress'
], function (
    jQuery, Backbone, _, DressModel
){
    'use strict';

    // view/DressPage
    return Backbone.View.extend({
        model: DressModel,
        events: {
            "click .basketToggle": "basketToggle"
        },

        initialize: function () {
            this.templates = {
                page:             _.template( jQuery('#modal-dress-template').text() ),
                addToBasket:      _.template( jQuery('#template-addToBasket').text() ),
                removeFromBasket: _.template( jQuery('#template-removeFromBasket').text() ),
            };
            this.$el = jQuery('#modal-dress');
            this.template = _.template( jQuery('#modal-dress-template').text() );
        },

        basketToggle: function () {
            var self = this;
            this.model.ifBasketed( function (baskted){
                if (baskted){
                    self.model.removeFromBasket();
                    jQuery('#basketCtrls').html( self.templates.removeFromBasket );
                } else {
                    self.model.addToBasket();
                    jQuery('#basketCtrls').html( self.templates.addToBasket );
                }
            });
        },

        updateBasket: function () {
            var self = this;
            var update = function (inBasket){
                if (inBasket){
                    jQuery('#basketCtrls').html( self.templates.removeFromBasket );
                } else {
                    jQuery('#basketCtrls').html( self.templates.addToBasket );
                }
            }
            if (typeof this.model.inBasket==='undefined'){
                this.model.ifBasketed( update );
            } else {
                update(this.model.inBasket);
            }
        },

        render: function (dressId) {
            var self = this;

            this.model.get(id, dressId);

            this.$el.html(
                this.templates.page( this.model.toJSON() )
            );
            window.scrollTo(0, 0);

            this.$dressInfo = jQuery('#dress-info');

            this.updateBasket();

            this.zoomContainer = { $el : jQuery('#zoom-container') };
            this.zoomContainer.width  = this.zoomContainer.$el.width();
            this.zoomContainer.height = this.zoomContainer.$el.height();
            this.zoomContainer.$el.hide();

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
                self.zoomContainer.$el.show();
                self.zoomed.$el.show();
                self.zoomable.pcWidth  = self.zoomable.$el.width()  / 100;
                self.zoomable.pcHeight = self.zoomable.$el.height() / 100;
                self.zoomed.pcWidth    = self.zoomed.$el.width()  / 100;
                self.zoomed.pcHeight   = self.zoomed.$el.height() / 100;
                self.zoomContainer.$el.hide();
                self.zoomed.$el.hide();
                self.zoomable.$el.on('mouseenter.zoom', function (e) {
                    self.$dressInfo.hide();
                    self.zoomContainer.$el.show();
                    self.zoomed.$el.show();
                    self.zoomable.$el.on('mousemove.zoom', function (e) {
                        self.zoom(e);
                    });
                });
                self.zoomable.$el.on('mouseleave.zoom', function (e) {
                    self.zoomable.$el.off('mousemove.zoom');
                    self.zoomContainer.$el.hide();
                    self.$dressInfo.show();
                });
            });
        },

        zoom: function (e) {
            // Position within the source image:
            // adding/removing a bit because of the *em offset caused
            // by the 'close' button :(
            var x  = e.pageX - this.zoomable.offset.left, // - 30,
                y  = e.pageY - this.zoomable.offset.top; // - 40;
            // As a percentage:
            x = x / this.zoomable.pcWidth;
            y = y / this.zoomable.pcHeight;
            // Position in the zoomed image:
            x = x * this.zoomed.pcWidth;
            y = y * this.zoomed.pcHeight;
            this.zoomed.$el.css({
                left: x * -1,
                top:  y * -1
            });
        }
    });
});
