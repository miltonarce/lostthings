angular
.module('lostThings.controllers')
.controller('ProfileUserCtrl', [
	'$scope',
	'$state',
	'Authentication',
	'Users',
	'Items',
	'Utils',
	function($scope, $state, Authentication, Users, Items, Utils) {

		$scope.profile = null;
		$scope.items = [];
		
		//Al ingresar a la view, se trae toda la info del perfil del usuario, ya que puede variar...
		$scope.$on('$ionicView.beforeEnter', function() {
			$scope.getAllInfo();
		});

		/**
		 * Permite obtener toda la información necesaria para cargar esta view
		 * la lista de publicaciones que publico el usuario, como tambien la info de su
		 * perfil, se hace uso de Promise all para poder realizar de manera mas facil
		 * las 2 peticiones, si falla una, ya no sirve y se muestra una notificación.
		 * @returns void
		 */
		$scope.getAllInfo = function() {
			Promise.all([
				Users.getProfileUser(),
				Items.getItemsByUser(),
			]).then(results => {
				$scope.profile = results[0];
				$scope.items = results[1];
				$scope.$apply();
			}).catch(() => Utils.showPopup('Perfil', `Se produjo un error al obtener la información del perfil del usuario`));
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
		 * Permite verificar si el usuario logueado es amigo de la persona que esta mirando el
		 * perfil
		 * @returns boolean
		 */
		$scope.isFriend = function(idUser) {
			return false;
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
		 * Permite ir al detalle de una publicación
		 * @param {number} id
		 * @returns void
		 */
		$scope.goDetail = function(id) {
			$state.go('detail', { 'id': id });
		}

	}
]);