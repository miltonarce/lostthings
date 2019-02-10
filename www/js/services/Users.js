angular
.module('lostThings.services')
.factory('Users', 
    ["$http", 
    "API_SERVER",
    "Authentication",
    function($http, API_SERVER, Authentication){

        /**
         * Permite obtener el id del usuario que inicio sesión
         * @returns number
         */
        function getIdUserLogged() {
            return Authentication.getUserData().idusuario;
        }
      
        /**
         * Permite buscar personas por el nickname o el nombre
         * @param {string} input 
         * @returns Promise
         */
        function search(input) {
            return $http.get(`${API_SERVER}/users/${input}`);
        }

        /**
         * Permite obtener los amigos que posee el usuario logueado por el id del mismo
         * @returns Promise
         */
        function getFriendsByUser() {
            let idUser = getIdUserLogged();
            return $http.get(`${API_SERVER}/friends/${idUser}`);
        }

        /**
         * Permite agregar un amigo al listado de amigos que posee el usuario
         * @param {number} userIdFriend
         * @returns Promise
         */
        function addFriend(userIdFriend) {
            let idUser = getIdUserLogged();
            return Promise.resolve({
                status: 1,
                msg: 'Se envio la solicitud'
            });
        }

        /**
         * Permite eliminar un amigo de la lista de amigos del usuario
         * @param {number} userIdFriend
         * @returns Promise
         */
        function deleteFriend(userIdFriend) {
            let idUser = getIdUserLogged();
            return Promise.resolve({
                status: 1,
                msg: 'Se elimino el amigo...'
            });
        }

        /**
         * Permite obtener el perfil completo de un usuario por el id del mismo
         * @param {number} idUser
         * @returns Promise
         */
        function getProfileUser(idUser) {
            return $http.get(`${API_SERVER}/profile/${idUser}`);
        }

        return {
            search: search,
            getFriendsByUser: getFriendsByUser,
            addFriend: addFriend,
            deleteFriend: deleteFriend,
            getProfileUser: getProfileUser
        };

    }
]);