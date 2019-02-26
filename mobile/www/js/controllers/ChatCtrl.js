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
		'$ionicLoading',
		function ($scope, $state, $stateParams, Utils, Authentication, Chat, Profile, $ionicLoading) {

			//Al ingresar a la view, obtiene los mensajes de los chats
			$scope.$on('$ionicView.beforeEnter', function () {
				//Datos del user logueado...
				$scope.idUser = Authentication.getUserData().idusuario;
				$scope.usuario = Authentication.getUserData().usuario;
				//Default request para el mensaje, se setea vacío
				$scope.msg = getDefaultMsg();
				//Se obtiene la info adicional del usuario al enviar el mensaje (usuario, imagen, etc...)
				Profile.getAdditionalInfo($stateParams.iduser).then(res => {
					$scope.profile = res.data.data;
				}).catch(res => Utils.showPopup('Chat', 'Se produjo un error al obtener los datos del perfil'));
				//Se obtiene todos los mensajes de este chat por el token...
				Chat.getChatsmsgs($stateParams.tokenchat)
					.then(res => $scope.mensajeschat = res.data)
					.catch(() => Utils.showPopup('Chat', 'Se produjo un error al obtener los mensajes del chat'));
			});

			/**
			 * Permite enviar un mensaje a un usuario, valida los datos al enviar...
			 * @param {Object} formComments
			 * @param {Object} msg
			 * @returns void
			 */
			$scope.addmsg = function (formmsgs, msg) {
				$scope.errors = { mensaje: null };
				if (formmsgs.mensaje.$invalid) {
					if (formmsgs.mensaje.$error.required) {
						$scope.errors.mensaje = 'El campo no puede ser vacío';
					}
				} else {
					$ionicLoading.show();
					Chat.sendmsg({ tokenchat: $stateParams.tokenchat, idUser: $scope.idUser, msg: msg.content }).then(res => {
						$ionicLoading.hide();
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
					}).catch(() => {
						$ionicLoading.hide();
						Utils.showPopup('Mensaje ', 'Se produjo un error al enviar el mensaje');
					});
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

