angular
.module('lostThings.controllers')
.controller('ProfileCtrl', [
	'$scope',
	'$state',
	'Authentication',
	'Profile',
	'Utils',
	function($scope, $state, Authentication, Profile, Utils) {
		
		$scope.$on('$ionicView.beforeEnter', function() {

			//Obtengo la información del usuario
			$scope.userData = Authentication.getUserData();

			//Request para cambiar la contraseña
			$scope.requestPassword = { password: '', newpassword: '' } ;

			//Request para editar los datos
			$scope.requestEdit = { nombre: '', apellido: '' };

			//Flag para mostrar el formulario de edición
			$scope.enableEdit = false;

			Profile.getAdditionalInfo().then(function(response) {
				$scope.userData.nombre = response.data.data.nombre;
				$scope.userData.apellido = response.data.data.apellido;
				$scope.requestEdit.nombre = response.data.data.nombre;
				$scope.requestEdit.apellido = response.data.data.apellido;
			}).catch(_err => Utils.showPopup("Perfil", "¡Ups se produjo un error al obtener la información adicional"));
			
		});

		/**
		 * Permite habilitar / deshabilitar el formulario de edición
		 * @returns void
		 */
		$scope.toggleEnableEdit = function() {
			$scope.enableEdit = !$scope.enableEdit;
		}

		/**
		 * Permite editar el perfil del usuario con los datos recibidos
		 * @param {Object} formEdit
		 * @param {Object} user
		 */
		$scope.editProfile = function(formEdit, user) {
			$scope.errors = validateFields(formEdit);
			if ($scope.errors.nombre === null && $scope.errors.apellido === null) {
			 Profile.edit($scope.userData.idusuario, $scope.requestEdit).then(response => {
				if (response.status === 1) {
					Utils.showPopup("Perfil", "Se actualizó correctamente su perfil!").then(() => $state.go('dashboard'));
				} else {
					Utils.showPopup("Perfil", "No se pudo actualizar su perfil, intente más tarde");
				}
			 }).catch(_err => Utils.showPopup("Perfil", "¡Ups se produjo un error al modificar los datos"));
			} 
		}

		/**
		 * Permite modificar el password del usuario, valida los datos
		 * y realiza la actualización llamando al service...
		 * @param {string} formChangePassword 
		 * @param {string} requestPassword 
		 * @returns void
		 */
		$scope.changePassword = function(formChangePassword, requestPassword) {
			$scope.errorsFormChangePassword = validateFieldsPassword(formChangePassword);
			if ($scope.errorsFormChangePassword.password === null && $scope.errorsFormChangePassword.newpassword === null) {
				Profile.changePassword($scope.userData.idusuario, $scope.requestPassword).then(response => {
					if (response.data.status === 1) {
						Utils.showPopup("Perfil", "Se actualizó correctamente su password!").then(() => $state.go('dashboard'));
					} else {
						Utils.showPopup("Perfil", "No se pudo actualizar su password, intente más tarde");
					}
				}).catch(_err => Utils.showPopup("Perfil", "¡Ups se produjo un error al modificar su password"));
			}
		}

		/**
		 * Permite cerrar la sesión del usuario, borra el token del mismo
		 * redirige al login
		 * @returns void
		 */
		$scope.logout = function() {
			Authentication.logout();
			$state.go('login');
		}

		/**
		 * Permite validar los datos ingresados por el usuario
		 * @param {Object} formEdit
		 * @return errors
		 */
		function validateFields(formEdit) {
			let errors = {
				nombre: null,
				apellido: null,
			};
			if (formEdit.nombre.$invalid) {
				if (formEdit.nombre.$error.required) {
					errors.nombre = "El campo nombre no puede ser vacío";
				}
			}
			if (formEdit.apellido.$invalid) {
				if (formEdit.apellido.$error.required) {
					errors.apellido = "El campo apellido no puede ser vacío";
				}
			}
			return errors;
		}

		/**
		 * Permite validar los campos del formulario de password
		 * @param {Object} formChangePassword
		 * @returns errors
		 */
		function validateFieldsPassword(formChangePassword) {
			let errors = {
				password: null,
				newpassword: null
			};
			if (formChangePassword.password.$invalid) {
				if (formChangePassword.password.$error.required) {
					errors.password = "Su password actual no puede ser vacía";
				}
			}
			if (formChangePassword.newpassword.$invalid) {
				if (formChangePassword.newpassword.$error.required) {
					errors.newpassword = "Su nuevo password no puede ser vacío";
				}
			}
			return errors;
		}

	}
]);