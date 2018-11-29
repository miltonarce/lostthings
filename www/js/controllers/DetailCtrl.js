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
	function($scope, $state, $stateParams, Utils, Items, Comments, Authentication) {
		
		//Contenido de la publicacion
		$scope.item = null;

		//Comentarios de la publicación
		$scope.comentarios = [];

		//Flag modo edición
		$scope.showEditable = false;

		//Información del usuario logueado
		const idUser = Authentication.getUserData().idusuario;

		//Request para editar la publicación
		$scope.requestEdit = {};

		//Request comentario
		$scope.comment = { description: '', idUser: idUser };

		//Obtengo el detalle de la publicación
		Items.getDetail($stateParams.id).then(function(res) {
			let item = res.data;
			$scope.item = item;
			$scope.requestEdit = createDefaultRequest(item, idUser);
		}).catch(_err => Utils.showPopup('Detalle', 'Se produjo un error al obtener la información adicional'));

		Comments.getComments($stateParams.id).then(function(res) {
			$scope.comentarios = res.data;
		}).catch(_err => Utils.showPopup('Detalle', 'Se produjo un error al obtener los comentarios de la publicación'));

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
				Items.commentPublication(comment, idUser).then(res => {
					$scope.item.comentarios = $scope.item.comentarios.concat(res);
					$scope.comment = '';
					$scope.$apply();
				}).catch(_err => Utils.showPopup('Comentar', 'Se produjo un error al comentar'));
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
		 */
		$scope.edit = function(formEdit, requestEdit) {
			$scope.errors = validateFields(formEdit);
			if (isValidForm($scope.errors)) {
				Items.edit($scope.item.idpublicacion, $scope.requestEdit).then(response =>  {
					if (response.status === 1) {
						Utils.showPopup('Editar', 'Se actualizó el item').then(() => $state.go('dashboard.home'));
					} else {
						Utils.showPopup('Editar', response.data.message);
					}
				}).catch(_error => Utils.showPopup('Editar', '¡Ups se produjo un error al actualizar su publicación'));
			} 
		}

		/**
		 * Permite eliminar una publicación por el id de la misma
		 * @param id
		 */
		$scope.removeItem = function() {
			Utils.showConfirm('Eliminar', '¿Estás seguro de eliminar?').then(accept => {
				if (accept) {
					Items.remove($scope.item.idpublicacion).then(res => {
						Utils.showPopup('Eliminar', res.data.message).then(() => $state.go('dashboard.home'));
					}).catch(_err => Utils.showPopup('Eliminar', 'Se produjo un error al eliminar su publicación'));
				}
			})
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
		 * @param {Object} idUser 
		 * @returns Object
		 */
		function createDefaultRequest(item, idUser) {
			let { titulo, descripcion, ubicacion, img, fkidusuario } = item;
			return {
				titulo,
				descripcion,
				ubicacion,
				img,
				fecha_publicacion: Utils.getDate(),
				fkidusuario: idUser
			}
		}


	}
]);

