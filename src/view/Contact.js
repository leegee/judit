import { _ } from 'underscore';
import { Backbone } from 'backbone';

export const ContactView = Backbone.View.extend({
    el: '#contact',
    render: function () {
        this.$el.show();
        window.scrollTo(0, 0);
    },

    remove: function () {
        this.$el.hide();
    }
});