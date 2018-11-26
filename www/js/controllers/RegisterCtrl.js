angular
.module('lostThings.controllers')
.controller('RegisterCtrl', [
	'$scope',
	'$state',
	'Authentication',
	'Utils',
	function($scope, $state, Authentication, Utils) {

		//Request Registro
		$scope.user = { email: '', password: '', pic: '' };

		/**
		 * Permite registrar al usuario valida los datos recibidos, si sale todo OK
		 * realiza un redirect al login
		 * @param formRegister 
		 * @param user 
		 * @returns void
		 */
		$scope.register = function(formRegister, user) {
			$scope.errors = validateFields(formRegister);
			if ($scope.errors.email === null && $scope.errors.password === null) {
				Authentication.register(user).then(res =>  {
					Utils.showPopup('Registrarse', 'Se ha creado su cuenta!').then(() => $state.go('login'));
				}).catch(_error => {
					Utils.showPopup('Registrarse', '¡Ups se produjo un error al registrar al usuario');
				});
			}
		}

		/**
		 * Permite validar los datos ingresados por el usuario
		 * @param {Object} formRegister 
		 * @return errors
		 */
		function validateFields(formRegister) {
			let errors = { email: null, password: null, pic: '' };
			if (formRegister.email.$invalid) {
				if (formRegister.email.$error.required) {
					errors.email = 'El campo email no puede ser vacío';
				}
				if (formRegister.email.$error.email) {
					errors.email = 'No es un email válido';
				}
			}
			if (formRegister.password.$invalid) {
				if (formRegister.password.$error.required) {
					errors.password = 'El campo password no puede ser vacío';
				}
			}
			return errors;
		}

	}
]);