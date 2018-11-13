import jQuery from 'jquery';
import _ from 'underscore';
import { Config } from '../Config';

export class Source {
    constructor() {
        this.matchKeys = /^gsx\$(.+)$/;
    }
    fetch() {
        return jQuery.ajax({
            url: Config.googleJson.uri,
            jsonp: false,
            jsonpCallback: 'callback',
            dataType: 'jsonp',
            data: Config.googleJson.data,
            cache: true
        });
    }
    parse(gsx) {
        const rv = [];
        _.each(gsx.feed.entry, (entry) => {
            const reformed = {};
            _.each(entry, (val, key) => {
                let m;
                if (m = key.match(this.matchKeys)) {
                    reformed[m[1]] = val['$t'];
                }
            });
            rv.push(reformed);
        });
        console.log('parsed', rv);
        return rv;
    }
}

