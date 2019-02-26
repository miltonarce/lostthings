angular
	.module('lostThings.controllers')
	.controller('ProfileUserCtrl', [
		'$scope',
		'$state',
		'$stateParams',
		'Authentication',
		'Friends',
		'Profile',
		'Chat',
		'Items',
		'Utils',
		'$ionicLoading',
		function ($scope, $state, $stateParams, Authentication, Friends, Profile, Chat, Items, Utils, $ionicLoading) {

			$scope.profile = null;
			$scope.items = [];
			$scope.isFriend = false;

			//Al ingresar a la view, se trae toda la info del perfil del usuario, ya que puede variar...
			$scope.$on('$ionicView.beforeEnter', function () {
				$scope.isFriend = $stateParams.isFriend === 'true';
				$scope.getAllInfo($stateParams.id);
			});

			/**
			 * Permite obtener toda la información necesaria para cargar esta view
			 * la lista de publicaciones que publico el usuario, como tambien la info de su
			 * perfil, se hace uso de Promise all para poder realizar de manera mas facil
			 * las 2 peticiones, si falla una, ya no sirve y se muestra una notificación.
			 * @param {number} idUser
			 * @returns void
			 */
			$scope.getAllInfo = function (idUser) {
				$ionicLoading.show();
				Promise.all([
					Profile.getAdditionalInfo(idUser),
					Items.getItemsByUser(idUser),
				]).then(results => {
					$ionicLoading.hide();
					$scope.profile = results[0].data.data;
					$scope.items = results[1].data;
					$scope.$apply();
				}).catch(() => {
					$ionicLoading.hide();
					Utils.showPopup('Perfil', `Se produjo un error al obtener la información del perfil del usuario`);
				});
			}

			/**
			* Permite iniciar una conversación un usuario X, no es necesario que sea amigo para iniciarla
			* @param {Object} user
			* @returns void
			*/
			$scope.startChat = function (user) {
				$ionicLoading.show();
				Chat.createChat(user).then(res => {
					$ionicLoading.hide();
					let tokenchat = res.data.data.tokenchat;
					$state.go('chat', { 'iduser': user.idusuario , 'tokenchat': tokenchat });
				}).catch(() => {
					$ionicLoading.hide();
					Utils.showPopup('Chats', '¡Ups se produjo un error al querer chatear.');
				});
			}

			/**
			 * Permite agregar un usuario a la lista de amigos de la persona que esta logueada
			 * @param {Object} user
			 * @returns void
			 */
			$scope.addFriend = function (user) {
				Utils.showConfirm('Amigos', '¿Deseas enviar una solicitud de amistad?').then(accept => {
					if (accept) {
						$ionicLoading.show();
						Friends.sendRequest(user.idusuario).then(() => {
							$ionicLoading.hide();
							Utils.showPopup('Amigos', 'Se envió la solicitud de amistad!');
						}).catch(() => {
							$ionicLoading.hide();
							Utils.showPopup('Amigos', `Se produjo un error al enviar la solicitud a ${user.usuario}`);
						});
					}
				});
			}

			/**
					* Permite eliminar a un usuario de la lista de amigos de la persona logueada
					* recibida...
					* @param {Object} profile
					* @returns void
					*/
			$scope.removeFriend = function (profile) {
				Utils.showConfirm('Amigos', `¿Estas seguro de eliminar a ${profile.nombre} de tus amigos?`).then(accept => {
					if (accept) {
						$ionicLoading.show();
						Friends.remove(profile.idusuario).then(() => {
							$ionicLoading.hide();
							$scope.isFriend = false;
						}).catch(() => {
							$ionicLoading.hide();
							Utils.showPopup('Amigos', 'Se produjo un error al eliminar al usuario');
						});
					}
				});
			}

			/**
			 * Permite ir al detalle de una publicación
			 * @param {number} id
			 * @returns void
			 */
			$scope.goDetail = function (id) {
				$state.go('detail', { 'id': id });
			}

		}
	]);