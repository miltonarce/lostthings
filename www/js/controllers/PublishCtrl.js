angular
.module('lostThings.controllers')
.controller('PublishCtrl', [
	'$scope',
	'$state',
	'Utils',
	'Items',
	function($scope, $state, Utils, Items) {
			
		//Request Publish
		$scope.item = { name: '', description: '', pic: null };
		
		/**
		 * Permite publicar un articulo para que se pueda encontrar
		 * Si sale todo ok, redirige al home...
		 * @param {Object} formPublish
		 * @param {Object} item
		 * @returns void
		 */
		$scope.publish = function(formPublish, item) {
			$scope.errors = validateFields(formPublish);
			if ($scope.errors.name === null && $scope.errors.description === null && $scope.errors.pic === null) {
				Items.publishItem(item).then(() =>  {
					Utils.showPopup('Publicar', '<p>Se ha subido su publicación <br /> ¡Buena suerte!</p>')
						 .then(() => $state.go('dashboard.home'));
				}).catch(_error => Utils.showPopup('Publicar', '¡Ups se produjo un error al querer publicar su artículo'));
			}
		}

		/**
		 * Permite validar los datos ingresados por el usuario al crear un item para publicar
		 * @param {Object} formPublish 
		 * @return errors
		 */
		function validateFields(formPublish) {
			let errors = { name: null, description: null, pic: null };
			if (formPublish.name.$invalid) {
				if (formPublish.name.$error.required) {
					errors.name = 'El campo nombre no puede ser vacío';
				}
			}
			if (formPublish.description.$invalid) {
				if (formPublish.description.$error.required) {
					errors.description = 'El campo descripción no puede ser vacío';
				}
			}
			if (formPublish.file.$error.maxsize) {
				errors.pic = 'La imagen no puede exceder 1MB';
			}
			return errors;
		}

	}
]);