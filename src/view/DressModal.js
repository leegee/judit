import jQuery from 'jquery';
import _ from 'underscore';
import * as Backbone from 'backbone';
import { Modal } from './Modal';

export const DressModal = Backbone.View.extend({
    events: {
        "click .basketToggle": "basketToggle",
        "click .viewBasket": "close"
    },

    initialize: function () {
        this.templates = {
            page: _.template(jQuery('#modal-dress-template').text()),
            addToBasket: _.template(jQuery('#template-addToBasket').text()),
            removeFromBasket: _.template(jQuery('#template-removeFromBasket').text()),
        };
        this.$el = jQuery('#modal-dress');
        this.modal = new Modal();
    },

    close: function () {
        this.modal.close();
    },

    // To allow calling directly from the router
    remove: function () {
        console.warn('called remove');
    },

    basketToggle: function () {
        this.model.ifBasketed((baskted) => {
            if (baskted) {
                this.model.removeFromBasket();
                jQuery('#basketCtrls').html(this.templates.addToBasket);
            } else {
                this.model.addToBasket();
                jQuery('#basketCtrls').html(this.templates.removeFromBasket);
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

    render: function () {
        this.$el.html(
            this.templates.page(this.model.toJSON())
        );

        // If linked to directly (/dress/:sku), make the
        // closeUrl be the homepage; otherwise, create a showUrl
        const closeUrl = Backbone.history.fragment;
        const showUrl = Backbone.history.fragment + '/' + this.model.id;
        if (Backbone.history.fragment.match('/' + this.model.id + '$')) {
            closeUrl = null;
            showUrl = Backbone.history.fragment;
        }

        this.modal.show({
            templateCompiled: _.template(jQuery('#modal-dress-template').text()),
            $el: this.$el,
            model: this.model.toJSON(),
            showUrl: showUrl,
            closeUrl: closeUrl
        });

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
            if (this.zoomable.$el.css('width') > this.zoomable.$el.css('height')) {
                this.zoomable.$el.addClass('lanscape');
            } else {
                this.zoomable.$el.addClass('portrait');
            }

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
        let x = e.pageX - this.zoomable.offset.left,
            y = e.pageY - this.zoomable.offset.top;
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
