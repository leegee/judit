import { _ } from 'underscore';
import { DressModal } from './DressModal';
import { Backbone } from 'backbone';

var THUMBS_MADE = 0;

// view Dress
export const DressView = Backbone.View.extend({
    thumbLoaded: function () { throw new Error("Override me"); },
    className: 'dress grow',
    galleryId: null,
    events: {
        "click .basket-icon": "openBasket",
        "click": "showModal",
    },

    initialize: function (options) {
        this.galleryId = options.galleryId;
        this.thumbLoaded = options.thumbLoaded;
        this.url = '#/gallery/' + options.galleryId;
        this.template = _.template(jQuery('#dress-template').text());
        this.thumbId = 'thumb' + (++THUMBS_MADE);
        this.render();
    },

    openBasket: function (e) {
        e.stopPropagation();
        Backbone.history.navigate('basket', { trigger: true });
    },

    render: function () {
        var self = this;
        this.el.id = this.model.get('id');
        this.model.set('thumbId', this.thumbId);

        this.model.ifBasketed(function (isBasketed) {
            if (isBasketed) {
                self.$el.addClass('in-basket');
            }
        });

        var img = new Image();
        img.src = this.model.get('thumb');
        img.onload = function () {
            self.thumbLoaded();
            self.$el.html(
                self.template(self.model.toJSON())
            );
        };
    },

    showDressPage: function () {
        Backbone.history.navigate(
            '#/dress/' + this.model.get('id'),
            { trigger: true }
        );
    },

    showModal: function () {
        new DressModal({
            model: this.model
        }).render();
    }
});
