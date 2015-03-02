define( [
    'jQuery', 'Backbone', 'Underscore', 'Modal'
], function (
    jQuery, Backbone, _, Modal
){
    'use strict';

    // DressViewModal
    return Backbone.View.extend({
        events: {
            "click .basketToggle": "basketToggle",
            "click .viewBasket": "close"
        },

        initialize: function (options) {
            this.baseUrl = options.baseUrl;
            this.url = this.baseUrl +'/'+ this.model.id;
            this.templates = {
                page:             _.template( jQuery('#modal-dress-template').text() ),
                addToBasket:      _.template( jQuery('#template-addToBasket').text() ),
                removeFromBasket: _.template( jQuery('#template-removeFromBasket').text() ),
            };
            this.$el = jQuery('#modal-dress');
            this.model.on('change', this.updateBasket, this);
            this.MODAL = new Modal({
                templateCompiled: _.template( jQuery('#modal-dress-template').text() ),
                $el: this.$el
            });
        },

        close: function () {
            this.MODAL.close();
        },

        basketToggle: function () {
            var self = this;
            this.model.ifBasketed( function (baskted){
                if (baskted){
                    console.log('in basket already');
                    self.model.removeFromBasket();
                    console.log('change text');
                    jQuery('#basketCtrls').html( self.templates.addToBasket );
                } else {
                    self.model.addToBasket();
                    jQuery('#basketCtrls').html( self.templates.removeFromBasket );
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

        render: function () {
            var self = this;
            this.$el.html(
                this.templates.page( this.model.toJSON() )
            );

            this.MODAL.show({
                model: this.model.toJSON(),
                showUrl: this.baseUrl+'/'+this.model.id,
                closeUrl: this.baseUrl
            });

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
                if (self.zoomable.$el.css('width') > self.zoomable.$el.css('height')){
                    self.zoomable.$el.addClass('lanscape');
                } else {
                    self.zoomable.$el.addClass('portrait');
                }

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
