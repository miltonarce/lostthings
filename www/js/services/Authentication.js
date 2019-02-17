angular.module("lostThings.services").factory("Authentication", [
  "$http",
  "API_SERVER",
  function($http, API_SERVER) {

    //Constantes 
    const KEY_LOST_THINGS_TOKEN = 'lost_things_token';
    const KEY_LOST_THINGS_USER = 'lost_things_user';

    /**
     * Permite autenticar al usuario contra la API de PHP
     * @param {Object} user
     * @returns Promise
     */
    function login(user) {
      return $http.post(`${API_SERVER}/login`, user).then(function(response) {
        if (response.data.status === 1) {
          setUserData(response.data.data.user);
          setToken(response.data.data.token)
          return true;
        }
        return false;
      });
    }
    
    /**
     * Permite obtener el token
     * @returns {string}
     */
    function getToken() {
      return localStorage.getItem(KEY_LOST_THINGS_TOKEN);
    }

    /**
     * Permite guardar el token en el localStorage
     * @param {string} value
     * @returns void
     */
    function setToken(value) {
      localStorage.setItem(KEY_LOST_THINGS_TOKEN, value);
    }

    /**
     * Permite guardar la info del usuario en el localStorage
     * @param {Object} user
     * @returns void
     */
    function setUserData(value) {
      localStorage.setItem(KEY_LOST_THINGS_USER, JSON.stringify(value));
    }

    /**
     * Permite obtener la información del usuario logueado
     * @returns Object
     */
    function getUserData() {
      return JSON.parse(localStorage.getItem(KEY_LOST_THINGS_USER));
    }

    /**
     * Permite eliminar los datos del usuario autenticado del localStorage...
     * @returns void
     */
    function logout() {
      localStorage.clear();
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
      return getToken() !== null;
    }

    return {
      login: login,
      logout: logout,
      register: register,
      isLogged: isLogged,
      getUserData: getUserData,
      getToken: getToken
    };
    
  }
]);
