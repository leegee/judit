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
        this.title = this.id ? this.id.replace(/_/, ' ') : '';
        // this.selector = '#' + this.id;
        this.rendered = false;
        this.template = _.template(
            jQuery('#gallery-template').text()
        );
    },

    remove: function () {
        this.$el.hide();
        jQuery('#galleries').hide();
    },

    render: function (dressIdToShow) {
        console.info("Gallery render", dressIdToShow);

        if (!jQuery.contains(document, this.$el[0])) {
            console.log('no %s in doc, adding', this.$el[0]);
            jQuery('#galleries').append(this.$el);
            this.$el.empty();
            this.$el.html(
                this.template({title: this.title})
            );
        } else {
            console.log('doc conatins %s, not adding', this.$el[0]);
            jQuery('#galleries').show();
            this.$el.show();
            return;
        }

        this.$dressContainer = jQuery('#dresses');
        this.$el.show();

        let showDressAsModal;
        const promiseToLoadAllImages = [],
            loader = new Loader({ total: this.collection.length }).show(),
            masonry = new Masonry(this.$dressContainer.get(0), {
                minColumnWidth: '20%',
                itemSelector: '.dress'
            });

        const perDress = (dress) => {
            promiseToLoadAllImages.push(
                new Promise((resolve) => {
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
                    console.log('done render');
                    next();
                },
                (reason) => {
                    console.error(reason);
                    next();
                }
            );
    }
});
