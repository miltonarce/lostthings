angular
.module('lostThings.controllers')
.controller('DetailCtrl', [
	'$scope',
	'$state',
	'$stateParams',
	'Utils',
	'Items',
	'Comments',
	'Authentication',
	'$ionicLoading',
	function($scope, $state, $stateParams, Utils, Items, Comments, Authentication, $ionicLoading) {
		
		//Contenido de la publicacion
		$scope.item = null;

		//Comentarios de la publicación
		$scope.comentarios = [];

		//Permite saber si la publicación es del usuario logueado para poder editar o eliminarla...
		$scope.isMyPublish = false;

		//Información del usuario logueado
		const idUser = Authentication.getUserData().idusuario;

		//Al ingresar a la view, obtiene el detalle de la publicacion, con los comentarios
		$scope.$on('$ionicView.beforeEnter', function() {

			//Flag modo edición
			$scope.showEditable = false;

			//Request para editar la publicación
			$scope.requestEdit = {};

			//Request comentario
			$scope.comment = getDefaultRequest();

			//Obtengo el detalle de la publicación
			$ionicLoading.show();
			Items.getDetail($stateParams.id).then(res => {
				$ionicLoading.hide();
				let item = res.data;
				$scope.item = item;
				$scope.requestEdit = createDefaultRequest(item);
				$scope.isMyPublish = item.fkidusuario === idUser;
			}).catch(() => {
				$ionicLoading.hide();
				Utils.showPopup('Detalle', 'Se produjo un error al obtener la información adicional');
			});
			Comments.getComments($stateParams.id)
					.then(res => $scope.comentarios = res.data)
					.catch(() => Utils.showPopup('Detalle', 'Se produjo un error al obtener los comentarios de la publicación'));
	    });	

		/**
		 * Permite comentar una publicacion, realiza las validaciones y 
		 * genera el alta del comentario en la publicacion
		 * @param {Object} formComments
		 * @param {Object} comment
		 * @returns void
		 */
		$scope.addComment = function(formComments, comment) {
			$scope.errors = { comentario: null };
			if (formComments.comentario.$invalid) {
				if (formComments.comentario.$error.required) {
					$scope.errors.comentario = 'El campo no puede ser vacío';
				}
			} else {
				let idPublish = $scope.item.idpublicacion;
				Comments.publish(idPublish, $scope.comment).then(res => {
					if (res.data.status === 1) {
						$scope.comentarios.push(res.data.data);
						$scope.comment = getDefaultRequest();
					} else {
						Utils.showPopup('Comentar', res.data.message);
					}
				}).catch(() => Utils.showPopup('Comentar', 'Se produjo un error al comentar'));
			}
		}

		/**
		 * Permite cambiar el estado del flag para visualizar el contenido
		 * de edicion / lectura
		 * @returns void
		 */
		$scope.toggleEdit = function() {
			$scope.showEditable = !$scope.showEditable;
		}

		/**
		 * Permite actualizar el item de la publicacion
		 * @param {Object} formEdit 
		 * @param {Object} requestEdit 
		 * @returns void
		 */
		$scope.edit = function(formEdit, requestEdit) {
			$scope.errors = validateFields(formEdit);
			if (isValidForm($scope.errors)) {
				Items.edit($scope.item.idpublicacion, $scope.requestEdit).then(response =>  {
					if (response.data.status === 1) {
						Utils.showPopup('Editar', 'Se actualizó el item').then(() => $state.go('dashboard.home'));
					} else {
						Utils.showPopup('Editar', response.data.message);
					}
				}).catch(() => Utils.showPopup('Editar', '¡Ups se produjo un error al actualizar su publicación'));
			} 
		}

		/**
		 * Permite eliminar una publicación por el id de la misma
		 * @returns void
		 */
		$scope.removeItem = function() {
			if ( $scope.item.fkidusuario === idUser) {
				Utils.showConfirm('Eliminar', '¿Estás seguro de eliminar?').then(accept => {
					if (accept) {
						Items.remove($scope.item.idpublicacion).then(res => {
							Utils.showPopup('Eliminar', res.data.message).then(() => $state.go('dashboard.home'));
						}).catch(() => Utils.showPopup('Eliminar', 'Se produjo un error al eliminar su publicación'));
					}
				});
			} else {
				Utils.showPopup('Eliminar', 'No puedes eliminar una publicación que no es tuya');
			}
		}

		/**
		 * Permite validar los datos ingresados por el usuario al modificar un item
		 * @param {Object} formPublish 
		 * @return errors
		 */
		function validateFields(formEdit) {
			let errors = { titulo: null, descripcion: null, ubicacion: null, img: null };
			if (formEdit.titulo.$invalid) {
				if (formEdit.titulo.$error.required) {
					errors.titulo = 'El campo nombre no puede ser vacío';
				}
			}
			if (formEdit.descripcion.$invalid) {
				if (formEdit.descripcion.$error.required) {
					errors.descripcion = 'El campo descripción no puede ser vacío';
				}
			}
			if (formEdit.ubicacion.$invalid) {
				if (formEdit.ubicacion.$error.required) {
					errors.ubicacion = 'El campo ubicación no puede ser vacío, ya que sirve para reducir la búsqueda';
				}
			}
			if (formEdit.file.$error.maxsize) {
				errors.img = 'La imagen no puede exceder 1MB';
			}
			return errors;
		}

		/**
		 * Permite saber si el formulario es valido
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
		 * Permite crear el objeto default del request, se filtran los datos
		 * que ya trae el backend, porque no se necesitan por ejemplo los comentarios
		 * @param {Object} item 
		 * @returns Object
		 */
		function createDefaultRequest(item) {
			let { titulo, descripcion, ubicacion, img } = item;
			return {
				titulo,
				descripcion,
				ubicacion,
				img
			}
		}

		/**
		 * Permite crear el request default
		 * @returns Object
		 */
		function getDefaultRequest() {
			return { 
				comentario: '', 
				idusuario: idUser, 
			};
		}

	}
]);

