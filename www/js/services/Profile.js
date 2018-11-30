angular.module("lostThings.services").factory("Profile", [
  "$http",
  "API_SERVER",
  "Authentication",
  function($http, API_SERVER, Authentication) {
    //Header default para el token
    const defaultHeader = {
      headers: {
        "X-Token": Authentication.getToken()
      }
    };

    /**
     * Permite editar los datos del usuario, se envia en el HEADER
     * el api key del jwt...
     * @param {number} idUser
     * @param userData
     * @returns Promise
     */
    function edit(idUser, userData) {
      return $http.put(
        `${API_SERVER}/profile/${idUser}`,
        userData,
        defaultHeader
      );
    }

    /**
     * Permite modificar la contraseña que posee el usuario
     * @param {number} idUser
     * @param {Object} requestPassword
     */
    function changePassword(idUser, requestPassword) {
      return $http.put(
        `${API_SERVER}/profile/${idUser}`,
        userData,
        defaultHeader
      );
    }

    /**
     * Permite obtener la información del usuario adicional
     * @returns Promise
     */
    function getAdditionalInfo() {
      return $http.get(`${API_SERVER}/profile`, defaultHeader);
    }

    return {
      edit: edit,
      changePassword: changePassword,
      getAdditionalInfo: getAdditionalInfo
    };
  }
]);
