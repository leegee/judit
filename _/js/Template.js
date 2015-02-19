define( [
    'jQuery', 'Backbone', 'Underscore', 'Modal'
], function (
    jQuery, Backbone, _, Modal
){

    var Template = {
        lang: navigator.language.match('^(..)')[1],
        supported: [
            'en', 'hu'
        ]
    };

    if (! _.contains(Template.supported, 'en')){
        Template.lang = Template.supported[0];
    }

    Template.template = function (options) {
        var text = '';
        var id = options.el + '-' + Template.lang;
        console.info("Template ", id );
        if (options.el){
            text = jQuery( id ).text()
        }
        return _.template(text);
    }

    return Template;
});
