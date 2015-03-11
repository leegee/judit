define( ['jQuery', 'Config'], function (jQuery, Config){

    // source/Local
    var Source = function () {

    };

    Source.prototype.fetch = function () {
        return jQuery.get(Config.localStockJson);
    };

    Source.prototype.parse = function (responseData) {
        return responseData;
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
