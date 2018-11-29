angular
.module('lostThings.services')
.factory('Comments', 
    ["$http", 
    "API_SERVER",
    function($http, API_SERVER){
        
        /**
         * Permite obtener los comentarios que posee una publicacion por el id de la publicacion
         * @param {number} id 
         * @returns Promise
         */
        function getComments(id) {
            return $http.get(`${API_SERVER}/comments/${id}`);
        }

        return {
            getComments: getComments
        }

    }
]);