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

			//Request para cambiar la contraseña
			$scope.requestPassword = { password: '', newpassword: '' } ;

			//Request para editar los datos
			$scope.requestEdit = { nombre: '', apellido: '' };

			//Flag para mostrar el formulario de edición
			$scope.enableEdit = false;

			Profile.getAdditionalInfo().then(function(response) {
				$scope.updateValues(response.data.data);
			}).catch(() => Utils.showPopup("Perfil", "¡Ups se produjo un error al obtener la información adicional"));
			
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
		 * @returns void
		 */
		$scope.editProfile = function(formEdit, user) {
			$scope.errors = validateFields(formEdit);
			if ($scope.errors.nombre === null && $scope.errors.apellido === null) {
			 Profile.edit($scope.requestEdit).then(response => {
				if (response.data.status === 1) {
					Utils.showPopup("Perfil", "Se actualizó correctamente su perfil!").then(() => {
						$scope.updateValues(response.data.data);
						$scope.toggleEnableEdit();
					});
				} else {
					Utils.showPopup("Perfil", "No se pudo actualizar su perfil, intente más tarde");
				}
			 }).catch(() => Utils.showPopup("Perfil", "¡Ups se produjo un error al modificar los datos"));
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
				Profile.changePassword($scope.requestPassword).then(response => {
					if (response.data.status === 1) {
						Utils.showPopup("Perfil", "Se actualizó correctamente su password!");
					} else {
						Utils.showPopup("Perfil", "No se pudo actualizar su password, intente más tarde");
					}
				}).catch(() => Utils.showPopup("Perfil", "¡Ups se produjo un error al modificar su password"));
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

		$scope.updateValues = function(user) {
			$scope.requestEdit.nombre = user.nombre;
			$scope.requestEdit.apellido = user.apellido;
		}

		/**
		 * Permite validar los datos ingresados por el usuario
		 * @param {Object} formEdit
		 * @returns errors
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