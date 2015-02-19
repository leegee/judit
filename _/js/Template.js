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
        if (options.el){
            text = jQuery( options.el ).text()
        }
        console.info("Template ", options.el + '-' + Template.lang );
        return _.template(text);
    }

    return Template;
});
