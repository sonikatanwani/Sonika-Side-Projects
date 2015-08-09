geoLocationApp.factory('geoLocationSVC', function($http, $q) {

        return {
            getPosition: function (domainName) {
                var deffered = $q.defer();

                var url = '';

                if (domainName) {
                    url = "http://freegeoip.net/json/" + domainName;
                }
                else{
                    url = "http://freegeoip.net/json/";
                }

                $http.get(url).success(function(result){
                    deffered.resolve(result);
                }).error(function(error){
                    deffered.reject(error);
                });

                return deffered.promise;
            }
        }
    });