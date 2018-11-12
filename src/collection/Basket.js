import { Backbone } from 'backbone';
import { BasketModel } from '../model/Basket';

export const BasketCollection = Backbone.Collection.extend({
    sync: Backbone.localforage.sync('JuditCollection'),
    model: BasketModel
});
