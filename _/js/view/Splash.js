define( [
    'jQuery', 'Backbone', 'VerticalSlideShow'
], function (
    jQuery, Backbone, VerticalSlideShow
){
    'use strict';

    // Splash
    return Backbone.View.extend({
        el: "#home",

        initialize: function (options) {
            this.el = options.el;

            this.verticalSlideShow = new VerticalSlideShow({
                // container: this.el,
                selector: '#home article',
                offset: 30
            });
        },

        render: function () {
            if (jQuery.contains(document, this.$el[0])) {
                this.$el.show();
            } else {
                this.$el.insertAfter('header');
            }
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.verticalSlideShow.start();
        },

        remove: function () {
            this.$el.hide();
            this.verticalSlideShow.stop();
        }
    });
});
