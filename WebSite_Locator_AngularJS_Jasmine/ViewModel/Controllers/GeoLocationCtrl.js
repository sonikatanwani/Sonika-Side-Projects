geoLocationApp.controller('geoLocationController', function ($scope, geoLocationSVC, validateSVC) {
    $scope.webSiteDomain = '';
    $scope.inProgress  = false;
    $scope.errors = [];
    $scope.userMarker;
    $scope.domainMarker;
    $scope.googleMap;

    var mapOptions = {
        zoom: 10,
        mapTypeControl: false,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.DrawMap = function (position) {
        var coords = new google.maps.LatLng(position.latitude, position.longitude);
        mapOptions.center = coords;
        $scope.googleMap = new google.maps.Map(document.getElementById("mapPlaceHolder"), mapOptions);
    }

    function addMarker(position, title, existingMarker) {
        var markerOptions = {
            position: position,
            map: $scope.googleMap,
            title: title,
            clickable: true
        };

        var marker = new google.maps.Marker(markerOptions);

        var infoWindowOptions = {
            content: title,
            position: position
        };
        var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

        google.maps.event.addListener(marker, "click", function () {
            infoWindow.open($scope.googleMap);
        })

        if (existingMarker != undefined){
            existingMarker.setMap($scope.googleMap);
        }

        return marker;
    }

    //when user want to locate website
    $scope.locate = function (geolocation_form, webSiteDomain) {

        $scope.errors = validateSVC.validateForm(geolocation_form, webSiteDomain);

        if ($scope.errors.length > 0) return;

        $scope.inProgress = true;

        geoLocationSVC.getPosition(webSiteDomain).then(function (result) {
                $scope.inProgress = false;
                $scope.DrawMap(result);
                var position = new google.maps.LatLng(result.latitude, result.longitude);
                var title = "Website " + $scope.webSiteDomain + " is located here.";
                $scope.domainMarker = addMarker(position, title, $scope.userMarker);
            },
            function () {
                $scope.inProgress = false;
                $scope.errors.push("Internal Error occured");
            });
    }

    //when user click My Location
    $scope.locateMe = function () {
        $scope.inProgress = true;
        geoLocationSVC.getPosition(false).then(function (result) {
            $scope.inProgress = false;
            $scope.DrawMap(result);
            var position = new google.maps.LatLng(result.latitude, result.longitude);
            var title = "You are here!";
            $scope.userMarker = addMarker(position, title, $scope.domainMarker);
        },
            function () {
                $scope.inProgress = false;
                $scope.errors.push("Internal Error occured");
            });
    }

    //when user click reset
    $scope.reset = function () {
        if ($scope.userMarker) {
            $scope.userMarker.setMap(null);
            $scope.userMarker = undefined;
        }

        //reset the google map center position based on domain marker
        if ($scope.domainMarker){
            var position = $scope.domainMarker.getPosition();
            $scope.DrawMap({latitude: position.G, longitude: position.K });
            $scope.domainMarker.setMap($scope.googleMap);
        }
    }
});