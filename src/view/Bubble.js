import { jQuery } from 'jquery';
import { _ } from 'underscore';
import { Backbone } from 'backbone';

export const Bubble = Backbone.View.extend({
    el: '#bubble-outter',

    /*  @param {Object} options
        @param {string} options.menuItemSelector Selector for the menu item under which to display the bubble
        @param {string} options.templateSelector Selector for the template for the bubble.
    */
    initialize: function (options) {
        this.menuItemSelector = options.menuItemSelector || '.menubar .menu-basket';
        this.template = _.template(jQuery(
            options.templateSelector || '#basket-empty-bubble-template'
        ).text());
        this.menuItem = null; // Lazy load
    },

    render: function (callbacks) {
        this.$el.html(
            this.template()
        );
        this.menuItem = this.menuItem || jQuery(this.menuItemSelector);
        var offset = this.menuItem.offset();
        this.$el.css({
            left: offset.left - (this.menuItem.width() / 2),
            top: offset.top + this.menuItem.height()
        });
        this.$el.show();
        this.$el.delay(3000).fadeOut();
    }
});