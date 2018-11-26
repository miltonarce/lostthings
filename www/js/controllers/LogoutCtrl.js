angular
.module('lostThings.controllers')
.controller('LogoutCtrl', [
	'$state',
	'Authentication',
	function($state, Authentication) {
		Authentication.logout();
		$state.go('login');
	}
]);