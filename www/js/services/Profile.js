angular
.module('lostThings.services').factory('Profile', 
    ["$http",
    "API_SERVER",
    "Authentication",
    function($http, API_SERVER, Authentication){
        
        //Header default para el token
        const defaultHeader = {
            headers: {
                'X-Token' : Authentication.getToken()
            }
        };

         /**
         * Permite obtener el id del usuario que inicio sesión
         * @returns number
         */
        function getIdUserLogged() {
            return Authentication.getUserData().idusuario;
        }

        /**
         * Permite editar los datos del usuario, se envia en el HEADER 
         * el api key del jwt...
         * @param userData
         * @returns Promise
         */
        function edit(userData) {
            let idUser = getIdUserLogged();
            return $http.put(`${API_SERVER}/profile/${idUser}`, userData, defaultHeader);
        }

        /**
         * Permite modificar la contraseña que posee el usuario
         * @param {Object} requestPassword 
         * @returns Promise
         */
        function changePassword(requestPassword) {
            let idUser = getIdUserLogged();
            return $http.put(`${API_SERVER}/profile/${idUser}`, requestPassword, defaultHeader);
        }

        /**
         * Permite obtener la información del usuario adicional
         * @returns Promise
         */
        function getAdditionalInfo() {
            let idUser = getIdUserLogged();
            return $http.get(`${API_SERVER}/profile/${idUser}`, defaultHeader)
        }

      return {
        edit: edit,
        changePassword: changePassword,
        getAdditionalInfo: getAdditionalInfo
      };
  }
]);
