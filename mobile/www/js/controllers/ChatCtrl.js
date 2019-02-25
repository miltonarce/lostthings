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
				Chat.getChatsmsgs('5c732defa873d')
					.then(res => $scope.mensajeschat = res.data)
					.catch(() => Utils.showPopup('Chat', 'Se produjo un error al obtener los mensajes del chat'));
			});
		}
	]);

