angular
	.module('lostThings.controllers')
	.controller('ChatCtrl', [
		'$scope',
		'$state',
		'$stateParams',
		'Utils',
		'Authentication',
		'Chat',
		'Profile',
		function ($scope, $state, $stateParams, Utils, Authentication, Chat, Profile) {

			//Al ingresar a la view, obtiene los mensajes de los chats
			$scope.$on('$ionicView.beforeEnter', function () {
				$scope.idUser = Authentication.getUserData().idusuario;
				$scope.usuario = Authentication.getUserData().usuario;
				$scope.msg = getDefaultMsg();
				Profile.getAdditionalInfo($stateParams.iduser).then(res => {
					$scope.profile = res.data.data;
				}).catch(res => Utils.showPopup('Chat', 'Se produjo un error al obtener los datos del perfil'));
				Chat.getChatsmsgs($stateParams.tokenchat)
					.then(res => $scope.mensajeschat = res.data)
					.catch(res => Utils.showPopup('Chat', 'Se produjo un error al obtener los mensajes del chat'));
			});

			/**
			 * Permite enviar un mensaje
			 * @param {Object} formComments
			 * @returns void
			 */
			$scope.addmsg = function (formmsgs, msg) {
				$scope.errors = { mensaje: null };
				if (formmsgs.mensaje.$invalid) {
					if (formmsgs.mensaje.$error.required) {
						$scope.errors.mensaje = 'El campo no puede ser vacío';
					}
				} else {
					Chat.sendmsg({ tokenchat: $stateParams.tokenchat, idUser: $scope.idUser, msg: msg.content }).then(res => {
						if (res.data.status === 1) {
							let chatCreated = {
								...res.data.data,
								usuario: $scope.usuario
							};
							$scope.mensajeschat.push(chatCreated);
							$scope.msg = getDefaultMsg();
						} else {
							Utils.showPopup('Mensaje', res.data.message);
						}
					}).catch(() => Utils.showPopup('Mensaje ', 'Se produjo un error al enviar el mensaje'));
				}
			}

			/**
			 * Permite resetear el campo del chat 
			 * @returns Object
			 */
			function getDefaultMsg() {
				return { 
					content: '', 
				};
			}
		}
	]);

