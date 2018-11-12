import * as Backbone from 'backbone';
import { DressModel } from '../model/Dress';
import { BasketCollection } from './Basket';

export const Collection = Backbone.Collection.extend({
    model: DressModel,
    basket: new BasketCollection()
});
