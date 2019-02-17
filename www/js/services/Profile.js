angular
.module('lostThings.services').factory('Profile', 
    ["$http",
    "API_SERVER",
    "Authentication",
    function($http, API_SERVER, Authentication) {
        
        //Header default para el token
        const defaultHeader = {
            headers: {
                'X-Token' : Authentication.getToken()
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
         * @returns Promise
         */
        function changePassword(requestPassword) {
            return $http.put(`${API_SERVER}/profile`, requestPassword, defaultHeader);
        }

        /**
         * Permite obtener la información del usuario adicional
         * @returns Promise
         */
        function getAdditionalInfo(idUser) {
            if (idUser) {
                return $http.get(`${API_SERVER}/profile/${idUser}`, defaultHeader)
            }
            return $http.get(`${API_SERVER}/profile`, defaultHeader)
        }

        /**
         * Permite buscar personas por el nickname o el nombre
         * @param {string} input 
         * @returns Promise
         */
        function search(input) {
            return $http.get(`${API_SERVER}/profile/search/${input}`, defaultHeader);
        }


      return {
        edit: edit,
        changePassword: changePassword,
        getAdditionalInfo: getAdditionalInfo,
        search: search
      };
  }
]);
