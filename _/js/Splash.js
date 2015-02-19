define( [
    'Backbone', 'VerticalSlideShow'
], function (
    Backbone, VerticalSlideShow
){
    'use strict';

    // Splash
    return Backbone.View.extend({
        el: "#home",

        initialize: function (options) {
            this.verticalSlideShow = new VerticalSlideShow({
                container: '#home',
                selector: 'picture'
            });
        },

        render: function () {
            if (jQuery.contains(document, this.$el[0])) {
                this.$el.show();
                this.verticalSlideShow.start();
            } else {
                this.$el.insertAfter('header');
            }
        },

        remove: function () {
            this.$el.hide();
            this.verticalSlideShow.stop();
        }
    });
});
