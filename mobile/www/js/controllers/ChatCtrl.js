angular
	.module('lostThings.controllers')
	.controller('ChatCtrl', [
		'$scope',
		'$state',
		'$stateParams',
		'Utils',
		'Authentication',
		'Chat',
		function ($scope, $state, $stateParams, Utils, Authentication, Chat) {
			$scope.idUser = Authentication.getUserData().idusuario;

			//Al ingresar a la view, obtiene los mensajes de los chats
			$scope.$on('$ionicView.beforeEnter', function () {
				Chat.getChatsmsgs($stateParams.tokenchat)
					.then(res => $scope.mensajeschat = res.data)
					.catch(() => Utils.showPopup('Chat', 'Se produjo un error al obtener los mensajes del chat'));
			});

			/**
		 * Permite enviar un mensaje
		 * @param {Object} formComments
		 * @param {Object} comment
		 * @returns void
		 */
			$scope.addmsg = function (formmsgs, msg) {
				$scope.errors = { mensaje: null };
				if (formmsgs.mensaje.$invalid) {
					if (formmsgs.mensaje.$error.required) {
						$scope.errors.mensaje = 'El campo no puede ser vacío';
					}
				} else {
					Chat.sendmsg({ tokenchat: $stateParams.tokenchat, idUser: $scope.idUser, msg: msg.mensaje }).then(res => {
						if (res.data.status === 1) {
							$scope.mensajeschat.push(res.data.data);
						} else {
							Utils.showPopup('Mensaje', res.data.message);
						}
					}).catch(() => Utils.showPopup('Mensaje ', 'Se produjo un error al enviar el mensaje'));
				}
			}

		}
	]);

