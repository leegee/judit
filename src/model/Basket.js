import { Backbone } from 'backbone';

export const BasketModel = Backbone.Model.extend({
    sync: Backbone.localforage.sync('JuditModel')
});
