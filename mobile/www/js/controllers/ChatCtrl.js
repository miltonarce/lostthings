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
			//Mensajes del chat
			$scope.chatsmsgs = [];
			//Al ingresar a la view, obtiene ellos mensajes del chat
			$scope.$on('$ionicView.beforeEnter', function () {
				Chat.getChatsmsgs('1e3')
					.then(res => $scope.mensajeschat = res.data)
					.catch(() => Utils.showPopup('Chat', 'Se produjo un error al obtener los mensajes del chat'));
			});
		}
	]);

