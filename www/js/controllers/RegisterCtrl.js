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
			if (isValidForm($scope.errors)) {
				Authentication.register(user).then(success =>  {
					if (success) {
						Utils.showPopup('Registrarse', 'Se ha creado su cuenta!').then(() => $state.go('login'));
					} else {
						Utils.showPopup('Registrarse', 'Se produjo un error al registrar al usuario');
					}
				}).catch(_error => {
					Utils.showPopup('Registrarse', '¡Ups se produjo un error al registrar al usuario');
				});
			}
			return false;
		}

		/**
		 * Permite validar los datos ingresados por el usuario
		 * @param {Object} formRegister 
		 * @return errors
		 */
		function validateFields(formRegister) {
			let errors = { email: null, password: null, nombre: null, apellido: null, usuario:null, pic: '' };
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
			if (formRegister.usuario.$invalid) {
				if (formRegister.usuario.$error.required) {
					errors.usuario = 'El campo usuario no puede ser vacío';
				}
			}
			if (formRegister.nombre.$invalid) {
				if (formRegister.nombre.$error.required) {
					errors.nombre = 'El campo nombre no puede ser vacío';
				}
			}
			if (formRegister.apellido.$invalid) {
				if (formRegister.apellido.$error.required) {
					errors.apellido = 'El campo apellido no puede ser vacío';
				}
			}
			return errors;
		}

		/**
		 * Permite saber si el formulario es valido
		 *	@returns boolean
		 */
		function isValidForm(errors) {
			return errors.email === null && errors.password === null && errors.nombre === null && errors.apellido === null && errors.usuario === null;
		}

	}
]);