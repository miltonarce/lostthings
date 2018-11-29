
angular
.module('lostThings.services').factory('Profile', 
    ["$http",
    "API_SERVER",
    "Authentication",
    function($http, API_SERVER, Authentication){
        
        //Header default para el token
        const defaultHeader = {
            headers: {
                'HTTP_X_TOKEN' : Authentication.getToken()
            }
        };

        /**
         * Permite editar los datos del usuario, se envia en el HEADER 
         * el api key del jwt...
         * @param userData
         * @returns Promise
         */
        function edit(userData) {
            return $http.put(`${API_SERVER}/profile`, userData, defaultHeader);
        }

        /**
         * Permite modificar la contraseña que posee el usuario
         * @param {Object} requestPassword 
         */
        function changePassword(requestPassword) {
            return $http.put(`${API_SERVER}/profile`, userData, defaultHeader);
        }

        return {
            edit: edit,
            changePassword: changePassword
        }

    }
]);