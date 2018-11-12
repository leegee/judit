import { jQuery } from 'jquery';
import { Config } from '../Config';


// source/Local
const Source = function () { };

Source.prototype.fetch = function () {
    return jQuery.get(Config.localStockJson);
};

Source.prototype.parse = function (responseData) {
    return responseData;
};

export const Instance = new Source();

// TODO Test singleton
