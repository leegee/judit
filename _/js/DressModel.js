define( [
    'Backbone'
], function (
    Backbone
){
    // DressModel
    return Backbone.Model.extend({
        defaults: {
            name: "Name",
            size: "Size",
            tagline: "Tag Line",
            standfirst: "Stand First",
            blurb: "Blurb.",
            thumb: "/bower_components/js-vertical-slideshow/eg/img/1.png",
            zoomable: "/bower_components/js-vertical-slideshow/eg/img/1.png"
        }
    });
});
