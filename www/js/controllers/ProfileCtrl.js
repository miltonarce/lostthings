angular
.module('lostThings.controllers')
.controller('ProfileCtrl', [
	'$scope',
	'$state',
	'Authentication',
	'Profile',
	'Utils',
	function($scope, $state, Authentication, Profile, Utils) {

		//Obtengo la información del usuario
		$scope.userData = Authentication.getUserData();

		$scope.requestPassword = { idUser: $scope.userData.idusuario, oldPassword: '', newPassword: '' } ;

		//Flag para mostrar el formulario de edición
		$scope.enableEdit = false;

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
			if ($scope.errors.usuario === null && $scope.errors.email === null) {
			 Profile.edit($scope.userData).then(response => {
				if (response.status === 1) {
					Utils.showPopup("Perfil", "Se actualizó correctamente su perfil!");
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
			if ($scope.errorsFormChangePassword.oldPassword === null && $scope.errorsFormChangePassword.newPassword === null) {
				Profile.changePassword($scope.requestPassword).then(response => {
					if (response.status === 1) {
						Utils.showPopup("Perfil", "Se actualizó correctamente su password!");
					} else {
						Utils.showPopup("Perfil", "No se pudo actualizar su password, intente más tarde");
					}
				}).catch(_err => Utils.showPopup("Perfil", "¡Ups se produjo un error al modificar su password"));
			}
		}

		/**
		 * Permite validar los datos ingresados por el usuario
		 * @param {Object} formEdit
		 * @return errors
		 */
		function validateFields(formEdit) {
			let errors = {
				email: null,
				usuario: null,
			};
			if (formEdit.email.$invalid) {
				if (formEdit.email.$error.required) {
					errors.email = "El campo email no puede ser vacío";
				}
				if (formEdit.email.$error.email) {
					errors.email = "No es un email válido";
				}
			}
			if (formEdit.usuario.$invalid) {
				if (formEdit.usuario.$error.required) {
					errors.usuario = "El campo usuario no puede ser vacío";
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
				oldPassword: null,
				newPassword: null
			};
			if (formChangePassword.oldPassword.$invalid) {
				if (formChangePassword.oldPassword.$error.required) {
					errors.oldPassword = "Su password actual no puede ser vacía";
				}
			}
			if (formChangePassword.newPassword.$invalid) {
				if (formChangePassword.newPassword.$error.required) {
					errors.newPassword = "Su nuevo password no puede ser vacío";
				}
			}
			return errors;
		}

	}
]);