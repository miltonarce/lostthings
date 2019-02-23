angular
.module('lostThings.services').factory('Profile', 
    ["$http",
    "API_SERVER",
    "Authentication",
    function($http, API_SERVER, Authentication) {

        /**
         * Permite editar los datos del usuario, se envia en el HEADER 
         * el api key del jwt...
         * @param userData
         * @returns Promise
         */
        function edit(userData) {
            return $http.put(`${API_SERVER}/profile`, userData, Authentication.getHeaderForAPI());
        }

        /**
         * Permite modificar la contraseña que posee el usuario
         * @param {Object} requestPassword 
         * @returns Promise
         */
        function changePassword(requestPassword) {
            return $http.put(`${API_SERVER}/profile`, requestPassword, Authentication.getHeaderForAPI());
        }

        /**
         * Permite obtener la información del usuario adicional
         * @returns Promise
         */
        function getAdditionalInfo(idUser) {
            if (idUser) {
                return $http.get(`${API_SERVER}/profile/${idUser}`, Authentication.getHeaderForAPI())
            }
            return $http.get(`${API_SERVER}/profile`, Authentication.getHeaderForAPI())
        }

        /**
         * Permite buscar personas por el nickname o el nombre
         * @param {string} input 
         * @returns Promise
         */
        function search(input) {
            return $http.get(`${API_SERVER}/profile/search/${input}`, Authentication.getHeaderForAPI());
        }

      return {
        edit: edit,
        changePassword: changePassword,
        getAdditionalInfo: getAdditionalInfo,
        search: search
      };
  }
]);
