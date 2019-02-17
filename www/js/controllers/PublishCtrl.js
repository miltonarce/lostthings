angular
.module('lostThings.controllers')
.controller('PublishCtrl', [
	'$scope',
	'$state',
	'Utils',
	'Items',
	'Authentication',
	function($scope, $state, Utils, Items, Authentication) {

		$scope.$on('$ionicView.beforeEnter', function() {
			//Información del usuario
			$scope.userData = Authentication.getUserData();
			//Request Publish
			$scope.item = defaultRequest();
	    });	
		
		/**
		 * Permite publicar un articulo para que se pueda encontrar
		 * Si sale todo ok, redirige al home...
		 * @param {Object} formPublish
		 * @param {Object} item
		 * @returns void
		 */
		$scope.publish = function(formPublish, item) {
			$scope.errors = validateFields(formPublish);
			if (isValidForm($scope.errors)) {
				Items.publishItem($scope.item).then(response =>  {
					Utils.showPopup('Publicar', '<p>Se ha subido su publicación <br /> ¡Buena suerte!</p>').then(() => $state.go('dashboard.home'));
				}).catch(() => Utils.showPopup('Publicar', '¡Ups se produjo un error al querer publicar su artículo'));
			}
		}

		/**
		 * Permite validar los datos ingresados por el usuario al crear un item para publicar
		 * @param {Object} formPublish 
		 * @returns errors
		 */
		function validateFields(formPublish) {
			let errors = { titulo: null, descripcion: null, ubicacion: null, img: null };
			if (formPublish.titulo.$invalid) {
				if (formPublish.titulo.$error.required) {
					errors.titulo = 'El campo nombre no puede ser vacío';
				}
			}
			if (formPublish.descripcion.$invalid) {
				if (formPublish.descripcion.$error.required) {
					errors.descripcion = 'El campo descripción no puede ser vacío';
				}
			}
			if (formPublish.ubicacion.$invalid) {
				if (formPublish.ubicacion.$error.required) {
					errors.ubicacion = 'El campo ubicación no puede ser vacío, ya que sirve para reducir la búsqueda';
				}
			}
			if (formPublish.file.$error.maxsize) {
				errors.img = 'La imagen no puede exceder 1MB';
			}
			return errors;
		}

		/**
		 * Permite saber si el formulario es valido
		 * @param {Object} errors
		 *	@returns boolean
		*/
		function isValidForm(errors) {
			return (
				errors.titulo === null &&
				errors.descripcion === null &&
				errors.ubicacion === null &&
				errors.img === null
			);
		}

		/**
		 * Permite generar el request default para publicar un item
		 * @returns Object
		 */
		function defaultRequest() {
			return { 
				titulo: '', 
				descripcion: '', 
				ubicacion: '', 
				img: null, 
			};
		}

	}
]);