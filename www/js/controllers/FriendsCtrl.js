angular
.module('lostThings.controllers')
.controller('FriendsCtrl', [
	'$scope',
	'$state',
	'$stateParams',
    'Utils',
    'Users',
	function($scope, $state, $stateParams, Utils, Users) {

        //NgModel para el input del autocompletado
        $scope.search = '';
        //Lista de usuarios por default vacía
        $scope.users = [];
        //Lista de amigos por default vacía
        $scope.friends = [];

        //Al ingresar a la view, actualiza la lista de amigos
		$scope.$on('$ionicView.beforeEnter', function() {
			$scope.getFriendsByUser();
        });	

        /**
		 * Permite actualizar la lista de amigos
		 * Emite un evento para decirle que termino y que corte el refresh...
		 * @returns void
		 */
		$scope.doRefresh = function() {
            Users.getFriendsByUser().then(res => {
                $scope.friends = res.data;
				$scope.$broadcast('scroll.refreshComplete');
            }).catch(() => {
                $scope.$broadcast('scroll.refreshComplete');
                Utils.showPopup('Amigos', `Se produjo un error al obtener los amigos`);
            });
        }
        
        /**
         * Permite buscar si existen usuarios con el valor ingresado por el usuario,
         * consulta la API de amigos de PHP para obtener los resultados, se realiza si el
         * usuario ingresa mas de 2 carácteres
         * @param {string} search 
         * @returns void
         */
        $scope.searchFriends = function(search) {
            if (search.length >= 2) {
               Users.search(search)
                    .then(res => $scope.users = $scope.mapperUsers($scope.friends, res.data))
                    .catch(() => Utils.showPopup('Amigos', `Se produjo al buscar los amigos por el campo ${input}`));
            }
        }

        /**
         * Permite buscar los amigos que posee el usuario
         * @returns void
         */
        $scope.getFriendsByUser = function() {
            Users.getFriendsByUser()
                 .then(res => $scope.friends = res.data)
                 .catch(() => Utils.showPopup('Amigos', `Se produjo un error al obtener los amigos`));
        }

        /**
         * Permite agregar un usuario a la lista de amigos de la persona que esta logueada
         * @param {Object} user
         * @returns void
         */
        $scope.addFriend = function(user) {
            Utils.showConfirm('Amigos', '¿Deseas enviar una solicitud de amistad?').then(accept => {
                if (accept) {
                    Users.addFriend(user.id)
                         .then(() => Utils.showPopup('Amigos', 'Se envió la solicitud de amistad!'))
                         .catch(() => Utils.showPopup('Amigos', `Se produjo un error al enviar la solicitud a ${user.usuario}`));
                }
            });
        }

        /**
         * Permite eliminar a un usuario de la lista de amigos de la persona logueada
         * @param {number} idUser
         * @returns void
         */
        $scope.deleteFriend = function(idUser) {
            /*Users.deleteFriend(user.usuarioid)
                .then()
                .catch(() => Utils.showPopup('Amigos', `Se produjo un error al eliminar al usuario ${user.usuario}`));*/
        }

        /**
         * Permite iniciar una conversación un usuario X, no es necesario que sea amigo para iniciarla
         * @param {Object} user
         * @returns void
         */
        $scope.startChat = function(user) {
            $state.go('chat', { user: user });
        }

        /**
         * Permite realizar un mapper del resultado de usuarios recibidos del autocompletado,
         * se verifica si existen amigos del usuario, si hay se agrega un flag para mostrarlo
         * en el html
         * @param {Array} friends
         * @param {Array} users
         * @return {Array} users
         */
        $scope.mapperUsers = function(friends, users) {
            return users.map(user => {
                if ($scope.isFriend(friends, user.idusuario)) {
                    return { ...user, isFriend: true };
                }
                return user;
            });
        }

        /**
         * Permite verificar si en la lista de amigos del usuario, el id recibido
         * por parametro es amigo de el
         * @param {Array} friends
         * @param {number} idUser
         * @returns boolean
         */
        $scope.isFriend = function(friends, idUser) {
            return friends.findIndex(friend => friend.idamigo === idUser) !== -1;
        }

        /**
         * Permite ir al perfil del usuario seleccionado por el id
         * @param {number} idUser
         * @returns void
         */
        $scope.showProfile = function(idUser) {
            $state.go('profile', {'id': idUser });
        }

	}
]);

