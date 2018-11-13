import Backbone from 'backbone';

export const ContactView = Backbone.View.extend({
    selector: '#contact',
    el: '#contact',
    render: function () {
        this.$el.show();
        document.querySelector(this.selector).style.display = 'block';
    },

    remove: function () {
        this.$el.hide();
        document.querySelector(this.selector).style.display = 'none';
    }
});