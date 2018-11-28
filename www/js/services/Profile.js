
angular
.module('lostThings.services')
.factory('Profile', 
    ["$http",
    "API_SERVER",
    function($http, API_SERVER){
        
        /**
         * Permite editar los datos del usuario
         * @param userData
         * @returns Promise
         */
        function edit(userData) {
            return $http.put(`${API_SERVER}/profile`, userData);
        }

        /**
         * Permite modificar la contraseña que posee el usuario
         * @param {Object} requestPassword 
         */
        function changePassword(requestPassword) {
            //poner despues el valor real
            //return $http.put()
            return new Promise((resolve, reject) => resolve({data: { status: 1 , msg: 'todo ok'}}));
        }

        return {
            edit: edit,
            changePassword: changePassword
        }

    }
]);