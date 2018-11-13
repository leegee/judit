import jQuery from 'jquery';
import * as Backbone from 'backbone';
import { VerticalSlideShow } from '../VerticalSlideshow';

export const Splash = Backbone.View.extend({
    initialize: function (options) {
        this.selector = this.el = options.el;
        this.verticalSlideShow = new VerticalSlideShow({
            selector: this.selector + ' article', // TODO
            offset: 30
        });
    },

    render: function () {
        if (jQuery.contains(document, this.$el[0])) {
            this.$el.show();
        } else {
            this.$el.insertAfter('header');
        }
        document.querySelector(this.selector).style.display = 'block';
        window.scrollTo(0, 0);
        this.verticalSlideShow.start();
    },

    remove: function () {
        this.$el.hide();
        document.querySelector(this.selector).style.display = 'none';
        this.verticalSlideShow.stop();
    }
});
