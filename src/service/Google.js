import { jQuery } from 'jquery';
import { _ } from 'underscore';
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
        var self = this, rv = [];
        _.each(gsx.feed.entry, function (entry) {
            var reformed = {}, m;
            _.each(entry, function (val, key) {
                if (m = key.match(self.matchKeys)) {
                    reformed[m[1]] = val['$t'];
                }
            });
            rv.push(reformed);
        });
        return rv;
    }
}

