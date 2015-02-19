define( [
    'Backbone'
], function (
    Backbone
){
    // DressModel
    return Backbone.Model.extend({
        defaults: {
            name: "Default Name",
            size: "Default Size",
            tagline: "Default Tag Line",
            standfirst: "Default Stand First",
            blurb: "Default Blurb.",
            thumb: "/bower_components/js-vertical-slideshow/eg/img/1.png",
            zoomable: "/bower_components/js-vertical-slideshow/eg/img/1.png"
        }
    });
});
