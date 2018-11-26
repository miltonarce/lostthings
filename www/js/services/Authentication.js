angular.module("lostThings.services").factory("Authentication", [
  "$http",
  "API_SERVER",
  function($http, API_SERVER) {
    let token = null;

    let userData = null;

    /**
     * Permite autenticar al usuario contra la API de PHP
     * @param {Object} user
     * @return boolean
     */
    function login(user) {
      return $http.post(`${API_SERVER}/login`, user).then(function(res) {
        let response = res.data;
        if (response.status == 1) {
          return true;
        }
        return false;
      });
      //MOCK
      // token = 'fake-token';
      // return new Promise((resolve, reject) => resolve(true));
    }

    function logout() {
      token = null;
    }

    /**
     * Permite registrar al usuario utilizando la API de PHP
     * @param {Object} user
     * @returns Object
     */
    function register(user) {
      // return $http.post(`${API_SERVER}/register`, user).then(function(res) {
      //     let response = res.data;
      //     if (response.status == 1) {
      //         //token = response.data.token;
      //         // userData = {
      //         //     id		: response.data.id,
      //         //     usuario : response.data.usuario
      //         // };
      //         return true;
      //     }
      //     return false;
      // });

      //MOCK
      return new Promise((resolve, reject) => resolve());
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
      let userData = {
        id: "222",
        usuario: "pepe"
      };
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
