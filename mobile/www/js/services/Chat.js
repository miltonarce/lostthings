angular
    .module('lostThings.services')
    .factory('Chat',
        ["$http",
            "API_SERVER",
            "Authentication",
            function ($http, API_SERVER, Authentication) {

                /**
                 * Permite generar un chat con su token unico
                 * @param {number} id
                 * @returns Promise
                 */
                function createChat(user) {
                    return $http.post(`${API_SERVER}/chats`, user, Authentication.getHeaderForAPI());
                }

                /**
                       * Permite obtener los mensajes que posee una chat por el tokenchat de la room
                       * @param {number} tokenchat 
                       * @returns Promise
                       */
                function getChatsmsgs(tokenchat) {
                    return $http.get(`${API_SERVER}/chats/${tokenchat}`, Authentication.getHeaderForAPI());
                }

                // /**
                //  * Permite publicar un comentario a la publicacion
                //  * @param {number} id 
                //  * @param {Object} comment 
                //  * @returns Promise
                //  */
                // function publish(id, comment) {
                //     return $http.post(`${API_SERVER}/comments/${id}`, comment, Authentication.getHeaderForAPI());
                // }

                return {
                    createChat: createChat,
                    getChatsmsgs: getChatsmsgs
                };

            }
        ]);