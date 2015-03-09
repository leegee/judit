define( [
    'jQuery', 'Backbone', 'Underscore'
], function (
    jQuery, Backbone, _
){
    'use strict';

    // view/BasketEmptyBubble
    return Backbone.View.extend({
        el: '#bubble-outter',

        initialize: function (options) {
            this.template = _.template( jQuery('#basket-empty-bubble-template').text() );
            this.menuItem = null; // Lazy load
        },

        render: function (callbacks) {
            this.$el.html(
                this.template()
            );
            this.menuItem = this.menuItem || jQuery('.menubar .menu-basket');
            var offset = this.menuItem.offset();
            this.$el.css({
                left: offset.left - (this.menuItem.width() / 2),
                top:  offset.top + this.menuItem.height()
            });
            this.$el.show();
            this.$el.delay(3000).fadeOut();
        }
    });
});
