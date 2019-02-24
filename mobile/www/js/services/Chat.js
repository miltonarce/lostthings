angular
.module('lostThings.services')
.factory('Chat', 
    ["$http", 
    "API_SERVER",
    "Authentication",
    function($http, API_SERVER, Authentication){

        function test() {
            
        }

        return {
            test: test
        };
    }
]);