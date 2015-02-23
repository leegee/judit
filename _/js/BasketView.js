define( [
    'jQuery', 'Backbone', 'Underscore'
], function (
    jQuery, Backbone, _
){
    'use strict';

    // BasketView
    return Backbone.View.extend({
        el: '#basket',
        render: function () {
            this.$el.show();
        },

        remove: function () {
            this.$el.hide();
        }
    });
});
