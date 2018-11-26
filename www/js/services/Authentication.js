angular.module("lostThings.services").factory("Authentication", [
  "$http",
  "API_SERVER",
  function($http, API_SERVER) {

    //Token JWT
    let token = null;

    //Información del usuario logueado
    let userData = null;

    /**
     * Permite autenticar al usuario contra la API de PHP
     * @param {Object} user
     * @return boolean
     */
    function login(user) {
      return $http.post(`${API_SERVER}/login`, user).then(function(response) {
        if (response.data.status === 1) {
          userData = response.data.data;
          token = response.data.token;
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
      token = null;
      userData = null;
    }

    /**
     * Permite registrar al usuario utilizando la API de PHP
     * @param {Object} user
     * @returns Object
     */
    function register(user) {
       return $http.post(`${API_SERVER}/register`, user).then(function(res) {
          let response = res.data;
          if (response.status === 1) {
            return true;
          }
          return false;
       });
    }

    /**
     * Permite saber si el usuario esta logueado, valida si existe el token
     * @return boolean
     */
    function isLogged() {
      return token !== null;
    }

    /**
     * Permite obtener el token JWT
     * @return token
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

    return {
      login: login,
      register: register,
      isLogged: isLogged,
      getUserData: getUserData,
      getToken: getToken,
      logout: logout
    };
  }
]);
