angular
.module('lostThings.services')
.factory('Friends', 
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
         * Permite obtener los amigos que posee el usuario logueado por el id del mismo
         * @returns Promise
         */
        function all() {
            return $http.get(`${API_SERVER}/friends`, defaultHeader);
        }

        /**
         * Permite obtener todas las invitaciones recibidas
         * @returns Promise
         */
        function allRequest() {
            return $http.get(`${API_SERVER}/friends/request`, defaultHeader);
        }

        /**
         * Permite enviar una solicitud de amistad
         * @param {number} id
         * @returns Promise
         */
        function sendRequest(id) {
            return $http.post(`${API_SERVER}/friends/request/${id}`, null, defaultHeader);
        }

        /**
         * Permite aceptar una solicitud de amistad
         * @param {number} id
         * @returns Promise
         */
        function acceptRequest(id) {
            return $http.put(`${API_SERVER}/friends/request/${id}`, null, defaultHeader);
        }

        /**
         * Permite eliminar un amigo de la lista de amigos del usuario
         * @param {number} id
         * @returns Promise
         */
        function remove(id) {
            return $http.delete(`${API_SERVER}/friends/${id}`, defaultHeader);
        }

        return {
            all: all,
            allRequest: allRequest,
            sendRequest: sendRequest,
            acceptRequest: acceptRequest,
            remove: remove
        };

    }
]);