(function () {
    'use strict';
    var serviceId = 'authInterceptorService';
    angular
        .module('app')
        .factory('authInterceptorService', authInterceptorService);

    authInterceptorService.$inject = ['$q', '$injector', '$location', 'localStorageService'];

    function authInterceptorService($q, $injector, $location, localStorageService) {
        
    	var authInterceptorServiceFactory = {};

    	var _request = function (config) {

    		config.headers = config.headers || {};

    		var authData = localStorageService.get('authorizationData');
    		if (authData) {
    			config.headers.Authorization = 'Bearer ' + authData.token;
    		}

    		return config;
    	}

        // Todo: Configure the 403 status
    	var _responseError = function (rejection) {
    	    
    		if (rejection.status === 401) {
    			var authService = $injector.get('authService');
    			var authData = localStorageService.get('authorizationData');
    			
    			if (authData) {
    				if (authData.useRefreshTokens) {
    					$location.path('/refresh');
    					return $q.reject(rejection);
    				}
    			}
    			authService.logOut();
    			$location.path('/login');
    		} else if (rejection.status === 403) {
                // This section process the Forbidden return status
    		    $location.path('/forbidden');
    		}
    		return $q.reject(rejection);
    	}

    	authInterceptorServiceFactory.request = _request;
    	authInterceptorServiceFactory.responseError = _responseError;

    	return authInterceptorServiceFactory;


    }
})();