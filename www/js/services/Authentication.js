angular.module("lostThings.services").factory("Authentication", [
  "$http",
  "API_SERVER",
  function($http, API_SERVER) {

    //Variables para mantener el estado del token y la info del user
    let userData = null;
    let token = null;

    /**
     * Permite autenticar al usuario contra la API de PHP
     * @param {Object} user
     * @returns Promise
     */
    function login(user) {
      return $http.post(`${API_SERVER}/login`, user).then(function(response) {
        if (response.data.status === 1) {
          userData = response.data.data.user;
          token = response.data.data.token;
          return true;
        }
        return false;
      });
    }

    /**
     * Permite eliminar el token del usuario y la data del mismo
     * @returns void
     */
    function logout() {
      userData = null;
      token = null;
    }

    /**
     * Permite registrar al usuario utilizando la API de PHP
     * @param {Object} user
     * @returns Promise
     */
    function register(user) {
      return $http.post(`${API_SERVER}/profile`, user).then(function(res) {
        let response = res.data;
        if (response.status === 1) {
          return true;
        }
        return false;
      });
    }

    /**
     * Permite saber si el usuario esta logueado, valida si existe el token
     * @returns boolean
     */
    function isLogged() {
      return token !== null;
    }

    /**
     * Permite obtener el token JWT
     * @returns {string}
     */
    function getToken() {
      return token;
    }

    /**
     * Permite obtener la información del usuario logueado
     * @returns {Object} userData
     */
    function getUserData() {
      return userData;
    }

    function setUserData(data) {
      userData = data;
    }

    return {
      login: login,
      register: register,
      isLogged: isLogged,
      getUserData: getUserData,
      setUserData: setUserData,
      getToken: getToken,
      logout: logout
    };
    
  }
]);
