angular
    .module('lostThings.services').factory('Chat',['$http',
    'API_SERVER',
    'Authentication',
    function ($http, API_SERVER, Authentication) {

        /**
         * Permite generar un chat con su token único
         * @param {Object} user
         * @returns Promise
         */
        function createChat(user) {
            return $http.post(`${API_SERVER}/chats`, user, Authentication.getHeaderForAPI());
        }

        /**
         * Permite obtener los mensajes que posee una chat por el tokenchat de la room
         * @param {string} tokenchat 
         * @returns Promise
         */
        function getChatsmsgs(tokenchat) {
            return $http.get(`${API_SERVER}/chatsmsgs/${tokenchat}`, Authentication.getHeaderForAPI());
        }

        /**
         * Permite enviar mensaje al chat
         * @param {Object} data 
         * @returns Promise
         */
        function sendmsg(data) {
            return $http.post(`${API_SERVER}/chatsmsgs`, data, Authentication.getHeaderForAPI());
        }

        return {
            createChat: createChat,
            getChatsmsgs: getChatsmsgs,
            sendmsg: sendmsg
        };

    }
]);