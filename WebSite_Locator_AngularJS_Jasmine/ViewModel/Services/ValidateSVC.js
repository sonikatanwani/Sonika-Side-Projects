geoLocationApp.factory('validateSVC', function () {

    return {
        validateForm: function (formElement, webSiteDomain) {

            //remove class from all elements since we are going to re-validate
            $( "input" ).removeClass( "has-error" );

            var errors = [];
            angular.forEach(formElement.$error, function(errorDetails){
                angular.forEach(errorDetails, function(errorDetail){
                    if (errorDetail.$invalid){
                        if (errorDetail.$error.required){
                            var element = $("#" + errorDetail.$name);
                            element.addClass("has-error");
                            errors.push("Required Fields Missing");
                        }

                        if (errorDetail.$error.pattern){
                            var element = $("#" + errorDetail.$name);
                            element.addClass("has-error");
                            errors.push("Invalid Domain name.")
                        }
                    }
                })
            });

            if (errors.length == 0){
                if (!validator.isURL(webSiteDomain)){
                    errors.push("Not a valid WebSite")
                }
            };
            return errors;
        },
    };
});



