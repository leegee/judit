define( ['jQuery', 'Underscore', 'Config'], function (jQuery, _, Config){

    // source/Google
    var Source = function () {
        this.matchKeys = /^gsx\$(.+)$/;
    };

    Source.prototype.fetch = function () {
        return jQuery.ajax({
            url: Config.googleJson.uri,
            jsonp: false,
            jsonpCallback: 'callback',
            dataType: 'jsonp',
            data: Config.googleJson.data,
            cache: true
        })
    };

    Source.prototype.parse = function (gsx) {
        var self = this,
            rv = [];

        _.each( gsx.feed.entry, function (entry) {
            var reformed = {},
                m;
            _.each( entry, function (val, key) {
                if (m = key.match( self.matchKeys )){
                    reformed[ m[1] ] = val['$t'];
                }
            });
            rv.push(reformed);
        });
        console.log(rv);
        return rv;
    };

    // Singleton
    var Instance;
    return function() {
        if (! Instance) {
            Instance = new Source();
        }
        return Instance;
    }

    return Source;
});
