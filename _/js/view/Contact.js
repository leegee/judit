define( [
    'jQuery', 'Backbone', 'Underscore'
], function (
    jQuery, Backbone, _
){
    'use strict';

    // view/Contact
    return Backbone.View.extend({
        el: '#contact',
        render: function () {
            this.$el.show();
        },

        remove: function () {
            this.$el.hide();
        }
    });
});
