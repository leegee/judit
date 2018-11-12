import { jQuery } from 'jquery';
import { _ } from 'underscore';
import { Backbone } from 'backbone';

export const MenuItem = Backbone.View.extend({
    tagName: 'li',

    initialize: function (options) {
        this.template = _.template(jQuery('#menu-gallery-item-template').text());
        this.model = options;
    },

    render: function () {
        this.$el.html(
            this.template(this.model)
        );
        this.$el.insertBefore('.menu-contact');
        window.scrollTo(0, 0);
    }
});
