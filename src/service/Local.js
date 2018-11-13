import jQuery from 'jquery';

import { Config } from '../Config';

// source/Local
class SourceLocal {
    constructor() { }
    fetch() {
        return jQuery.get(Config.localStockJson);
    }
    parse(responseData) {
        return responseData;
    }
}

export const Source = new SourceLocal();
