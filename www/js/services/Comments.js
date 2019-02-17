angular
.module('lostThings.services')
.factory('Comments', 
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
         * Permite obtener los comentarios que posee una publicacion por el id de la publicacion
         * @param {number} id 
         * @returns Promise
         */
        function getComments(id) {
            return $http.get(`${API_SERVER}/comments/${id}`, defaultHeader);
        }

        /**
         * Permite publicar un comentario a la publicacion
         * @param {number} id 
         * @param {Object} comment 
         * @returns Promise
         */
        function publish(id, comment) {
            return $http.post(`${API_SERVER}/comments/${id}`, comment, defaultHeader);
        }

        return {
            getComments: getComments,
            publish: publish
        };

    }
]);