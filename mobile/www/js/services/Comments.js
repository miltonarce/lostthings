angular
.module('lostThings.services')
.factory('Comments', 
    ["$http", 
    "API_SERVER",
    "Authentication",
    function($http, API_SERVER, Authentication) {

        /**
         * Permite obtener los comentarios que posee una publicacion por el id de la publicacion
         * @param {number} id 
         * @returns Promise
         */
        function getComments(id) {
            return $http.get(`${API_SERVER}/comments/${id}`, Authentication.getHeaderForAPI());
        }

        /**
         * Permite publicar un comentario a la publicacion
         * @param {number} id 
         * @param {Object} comment 
         * @returns Promise
         */
        function publish(id, comment) {
            return $http.post(`${API_SERVER}/comments/${id}`, comment, Authentication.getHeaderForAPI());
        }

        return {
            getComments: getComments,
            publish: publish
        };

    }
]);