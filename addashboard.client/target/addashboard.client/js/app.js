var module = angular.module('addashboard', []);

var auth = {};
var logout = function(){
    console.log('*** LOGOUT');
    auth.loggedIn = false;
    auth.authz = null;
    window.location = auth.logoutUrl;
};
var allWorkspaces = ['adbase.client', 'adcost.client'];

angular.element(document).ready(function ($http) {
    var keycloakAuth = new Keycloak('keycloak.json');
    auth.loggedIn = false;

    keycloakAuth.init({ onLoad: 'login-required' }).success(function () {
        auth.loggedIn = true;
        auth.authz = keycloakAuth;
        auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/adcom/tokens/logout?redirect_uri=/addashboard.client";
        module.factory('Auth', function() {
            return auth;
        });
        angular.bootstrap(document, ["addashboard"]);
    }).error(function () {
            window.location.reload();
        });

});

module.controller('GlobalCtrl', function($scope, $http, Auth) {	
	if(Auth.authz.idToken){
		$scope.username = auth.authz.idToken.preferred_username;
	}else {
		Auth.authz.loadUserProfile(function() {
			$scope.username = Auth.authz.profile.username;
		}, function() {
           console.log("failed to retrieve user profile");
        });
	}
    
    $scope.logout = logout;
    //my workspace
    $scope.workspaces = [];
    for(var i=0;i<allWorkspaces.length;i++){
    	console.log(Auth.authz.hasResourceRole(allWorkspaces[i]+"_role", allWorkspaces[i]));
    	if(Auth.authz.hasResourceRole(allWorkspaces[i]+"_role", allWorkspaces[i])){
    		$scope.workspaces.push(allWorkspaces[i]);
    	}
    }
    
    //origin
    //$scope.orign = Auth.authz.getOrigin();
    //console.log($scope.orign);
    
});


module.factory('authInterceptor', function($q, Auth) {
    return {
        request: function (config) {
            var deferred = $q.defer();
            if (Auth.authz.token) {
                Auth.authz.updateToken(5).success(function() {
                    config.headers = config.headers || {};
                    config.headers.Authorization = 'Bearer ' + Auth.authz.token;

                    deferred.resolve(config);
                }).error(function() {
                        deferred.reject('Failed to refresh token');
                    });
            }
            return deferred.promise;
        }
    };
});




module.config(function($httpProvider) {
    $httpProvider.responseInterceptors.push('errorInterceptor');
    $httpProvider.interceptors.push('authInterceptor');

});

module.factory('errorInterceptor', function($q) {
    return function(promise) {
        return promise.then(function(response) {
            return response;
        }, function(response) {
            if (response.status == 401) {
                console.log('session timeout?');
                logout();
            } else if (response.status == 403) {
                alert("Forbidden");
            } else if (response.status == 404) {
                alert("Not found");
            } else if (response.status) {
                if (response.data && response.data.errorMessage) {
                    alert(response.data.errorMessage);
                } else {
                    alert("An unexpected server error has occurred");
                }
            }
            return $q.reject(response);
        });
    };
});
