angular.module("lostThings.services").factory("Authentication", [
  "$http",
  "API_SERVER",
  function($http, API_SERVER) {

    /**
     * Permite autenticar al usuario contra la API de PHP
     * @param {Object} user
     * @return boolean
     */
    function login(user) {
      return $http.post(`${API_SERVER}/login`, user).then(function(response) {
        if (response.data.status === 1) {
          setUserData(response.data.data.user);
          setToken(response.data.data.token);
          return true;
        }
        return false;
      });
    }

    /**
     * Permite eliminar el token del usuario y la data del mismo del localStorage
     * @returns void
     */
    function logout() {
      localStorage.clear();
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
      return getToken() !== null;
    }

    /**
     * Permite guardar el token en el localStorage
     * @param {string} token 
     */
    function setToken(token) {
      localStorage.setItem('token', token);
    }

     /**
     * Permite obtener el token JWT
     * @return {string}
     */
    function getToken() {
      return localStorage.getItem('token');
    }

    /** Permit guardar la informacion del usuario en el localStorage
     * @param {Object} userData
     * @returns void
     */
    function setUserData(userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }

    /**
     * Permite obtener la información del usuario logueado
     * @returns {Object} userData
     */
    function getUserData() {
      return JSON.parse(localStorage.getItem('userData'));
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
