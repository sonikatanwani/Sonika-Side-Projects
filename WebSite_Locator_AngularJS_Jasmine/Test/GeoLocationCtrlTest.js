describe("GeoLocationController Tests", function () {
    var scope,
        $qq,
        controller,
        mockGeoLocationSVC,
        mockValidationSVC

    beforeEach(function () {
        module('geoLocationApp')
    });

    //Mocking service
    beforeEach(module(function ($provide) {
        mockGeoLocationSVC = {
            getPosition: function (domain) {
             var def = $qq.defer();
                def.resolve('{latitude: 38, longitude: -97}');
                return def.promise;
            }
        };

        mockValidationSVC = {
            validateForm: function () {
                var errors = [];
                return errors;
            }
        };

        spyOn(mockGeoLocationSVC, 'getPosition').andCallThrough();
        spyOn(mockValidationSVC, 'validateForm').andCallThrough();

        $provide.value('geoLocationSVC', mockGeoLocationSVC);
        $provide.value('validateSVC', mockValidationSVC);
    }));

    beforeEach(inject(function ($rootScope, $controller, $q) {
        $qq = $q;
        scope = $rootScope.$new();
        controller = $controller('geoLocationController', {
            '$scope': scope
        });
    }));

    describe('Check variables on Initialization', function () {
        it('check all default variables should be populated with correct values', function () {
            expect(scope.inProgress).toEqual(false);
            expect(scope.errors.length).toEqual(0);
            expect(scope.userMarker).toEqual(undefined);
            expect(scope.domainMarker).toEqual(undefined);
            expect(scope.googleMap).toEqual(undefined);
        });
    });

    describe('Happy Path where domain is valid', function () {
        beforeEach(function () {
            scope.DrawMap = function (marker) {

            };
            spyOn(scope, 'DrawMap').andCallThrough();
            scope.locate({form: 'formObject'}, 'www.cnn.com');
        });

        it('check validation ran', function(){
            expect(mockValidationSVC.validateForm).toHaveBeenCalled();
        });

        it('check position method got call and domain marker got populated', function () {
            scope.$apply();
            expect(mockGeoLocationSVC.getPosition).toHaveBeenCalled();
            expect(scope.DrawMap).toHaveBeenCalled();
            expect(scope.domainMarker).toBeDefined();
            expect(scope.inProgress).toEqual(false);
        });
    });

    describe('Happy Path for User Location', function () {
        beforeEach(function () {
            scope.DrawMap = function (marker) {
            };
            scope.locateMe();
            spyOn(scope, 'DrawMap').andCallThrough();
        });

        it('check user marker populated correctly', function () {
            scope.$apply();
            expect(mockGeoLocationSVC.getPosition).toHaveBeenCalled();
            expect(scope.userMarker).toBeDefined();
            expect(scope.inProgress).toEqual(false);
        });
    });

    describe('Happy Path for Reset functionality', function () {
        beforeEach(function () {
            scope.reset();
        });

        it('reset should make user marker as undefined', function () {
            scope.$apply();
            expect(scope.userMarker).toBeUndefined();
        });
    });
});

describe("GeoLocationController Validation Error Tests", function () {
    var scope,
        $qq,
        controller,
        mockGeoLocationSVC,
        mockValidationSVC

    beforeEach(function () {
        module('geoLocationApp')
    });

    //Mocking service
    beforeEach(module(function ($provide) {
        mockGeoLocationSVC = {
            getPosition: function (domain) {
                var def = $qq.defer();
                def.resolve('{latitude: 38, longitude: -97}');
                return def.promise;
            }
        };

        mockValidationSVC = {
            validateForm: function () {
                var errors = ['form validation failed'];
                return errors;
            }
        };

        spyOn(mockGeoLocationSVC, 'getPosition').andCallThrough();
        spyOn(mockValidationSVC, 'validateForm').andCallThrough();

        $provide.value('geoLocationSVC', mockGeoLocationSVC);
        $provide.value('validateSVC', mockValidationSVC);
    }));

    beforeEach(inject(function ($rootScope, $controller, $q) {
        $qq = $q;
        scope = $rootScope.$new();
        controller = $controller('geoLocationController', {
            '$scope': scope
        });
    }));

    describe('Error in form validation', function () {
        beforeEach(function () {
            scope.locate({form: 'formObject'}, 'www.cnn.com');
        });

        it('form validation failure should result in error object populated', function () {
            expect(mockValidationSVC.validateForm).toHaveBeenCalled();
            expect(scope.errors.length).toEqual(1);
            expect(mockGeoLocationSVC.getPosition).not.toHaveBeenCalled();
            expect(scope.domainMarker).toBeUndefined();
        });
    });
});