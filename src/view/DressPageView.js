import jQuery from 'jquery';
import _ from 'underscore';
import { DressModel } from '../model/Dress';
import * as Backbone from 'backbone';

export const DressPage = Backbone.View.extend({
    model: DressModel,
    events: {
        "click .basketToggle": "basketToggle"
    },

    initialize: function () {
        this.templates = {
            page: _.template(jQuery('#modal-dress-template').text()),
            addToBasket: _.template(jQuery('#template-addToBasket').text()),
            removeFromBasket: _.template(jQuery('#template-removeFromBasket').text()),
        };
        this.$el = jQuery('#modal-dress');
        this.template = _.template(jQuery('#modal-dress-template').text());
    },

    basketToggle: function () {
        this.model.ifBasketed((baskted) => {
            if (baskted) {
                this.model.removeFromBasket();
                jQuery('#basketCtrls').html(this.templates.removeFromBasket);
            } else {
                this.model.addToBasket();
                jQuery('#basketCtrls').html(this.templates.addToBasket);
            }
        });
    },

    updateBasket: function () {
        const update = (inBasket) => {
            if (inBasket) {
                jQuery('#basketCtrls').html(this.templates.removeFromBasket);
            } else {
                jQuery('#basketCtrls').html(this.templates.addToBasket);
            }
        }
        if (typeof this.model.inBasket === 'undefined') {
            this.model.ifBasketed(update);
        } else {
            update(this.model.inBasket);
        }
    },

    render: function (dressId) {
        this.model.get('id', dressId); // TODO CHECK What is 'id' ?

        this.$el.html(
            this.templates.page(this.model.toJSON())
        );
        window.scrollTo(0, 0);

        this.$dressInfo = jQuery('#dress-info');

        this.updateBasket();

        this.zoomContainer = { $el: jQuery('#zoom-container') };
        this.zoomContainer.width = this.zoomContainer.$el.width();
        this.zoomContainer.height = this.zoomContainer.$el.height();
        this.zoomContainer.$el.hide();

        this.zoomable = { $el: jQuery('#zoomable') };
        this.zoomable.offset = this.zoomable.$el.offset();

        this.zoomed = { $el: jQuery('#zoomed') };
        this.zoomed.$el.attr('src', this.model.get('zoomed'));
        jQuery.when(
            this.zoomable.$el.load(),
            this.zoomed.$el.load(),
            jQuery.Deferred((promise) => {
                jQuery(promise.resolve);
            })
        ).done(() => {
            this.zoomable.$el.css(
                this.zoomable.$el.width() > this.zoomable.$el.height ? 'width' : 'height',
                '100%'
            );
            this.zoomContainer.$el.show();
            this.zoomed.$el.show();
            this.zoomable.pcWidth = this.zoomable.$el.width() / 100;
            this.zoomable.pcHeight = this.zoomable.$el.height() / 100;
            this.zoomed.pcWidth = this.zoomed.$el.width() / 100;
            this.zoomed.pcHeight = this.zoomed.$el.height() / 100;
            this.zoomContainer.$el.hide();
            this.zoomed.$el.hide();
            this.zoomable.$el.on('mouseenter.zoom', () => {
                this.$dressInfo.hide();
                this.zoomContainer.$el.show();
                this.zoomed.$el.show();
                this.zoomable.$el.on('mousemove.zoom', (e) => {
                    this.zoom(e);
                });
            });
            this.zoomable.$el.on('mouseleave.zoom', () => {
                this.zoomable.$el.off('mousemove.zoom');
                this.zoomContainer.$el.hide();
                this.$dressInfo.show();
            });
        });
    },

    zoom: function (e) {
        // Position within the source image:
        // adding/removing a bit because of the *em offset caused
        // by the 'close' button :(
        const x = e.pageX - this.zoomable.offset.left, // - 30,
            y = e.pageY - this.zoomable.offset.top; // - 40;
        // As a percentage:
        x = x / this.zoomable.pcWidth;
        y = y / this.zoomable.pcHeight;
        // Position in the zoomed image:
        x = x * this.zoomed.pcWidth;
        y = y * this.zoomed.pcHeight;
        this.zoomed.$el.css({
            left: x * -1,
            top: y * -1
        });
    }
});
