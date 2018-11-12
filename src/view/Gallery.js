import jQuery from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import { DressView } from './Dress';
import { Loader } from './Loader';

import Masonry from 'masonry-layout';

export const GalleryView = Backbone.View.extend({
    tagName: "section",
    className: "gallery",
    loaded: false,

    initialize: function (options) {
        this.id = options.id;
        this.rendered = false;
        this.template = _.template(jQuery('#gallery-template').text());
    },

    render: function (dressIdToShow) {
        console.info("Gallery render", dressIdToShow);

        if (!jQuery.contains(document, this.$el[0])) {
            jQuery('#galleries').append(this.$el);
            this.$el.empty();
            this.$el.html(this.template());
        }

        this.$dressContainer = jQuery('#dresses');
        this.$el.show();
        jQuery('#galleries').show();

        let showDressAsModal;
        const promiseToLoadAllImages = [],
            loader = new Loader({ total: this.collection.length }).show(),
            masonry = new Masonry(this.$dressContainer.get(0), {
                minColumnWidth: '20%',
                itemSelector: '.dress'
            });

        const perDress = (dress) => {
            promiseToLoadAllImages.push(
                new Promise( (resolve) => {
                    const dressView = new DressView({
                        model: dress,
                        collection: this.collection,
                        galleryId: this.id,
                        thumbLoaded: () => {
                            this.$dressContainer.append(dressView.el);
                            loader.increment();
                            masonry.addItems(dressView.el);
                            masonry.layout();
                            resolve();
                        }
                    });
                    if (dressIdToShow === dress.id) {
                        showDressAsModal = dressView;
                    }
                })
            )
        };

        const next = () => {
            loader.hide();
            this.loaded = true;
            if (showDressAsModal) {
                showDressAsModal.showModal();
            }
            window.scrollTo(0, 0);
        };

        // Should be a Search sub-class :(
        // Is a search call or a gallery with an id?
        if (typeof this.id === 'undefined') {
            this.collection.each(perDress);
        }

        else {
            _.each(this.collection.where({ gallery: this.id }), perDress);
        }

        Promise.all(promiseToLoadAllImages)
            .then(
                () => {
                    console.log('ok');
                    next();
                },
                (reason) => {
                    console.error(reason);
                    next();
                }
            );
    }
});
