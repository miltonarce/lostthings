angular.module('lostThings.controllers')
.controller('HomeCtrl', [
	'$scope',
	'$state',
	'Items',
	'Utils',
	'$ionicLoading',
	function($scope, $state, Items, Utils, $ionicLoading) {
		
		//Flag para mostrar el campo de búsqueda
		$scope.showSearch = false;

		//Al ingresar a la view, actualiza la lista de items
		$scope.$on('$ionicView.beforeEnter', function() {
			$scope.getAllItems();
	    });	

		/**
		 * Permite mostrar y esconder el formulario
		 * de busqueda para realizar una busqueda de items
		 * @returns void
		 */
		$scope.toggleSearch = function() {
			$scope.showSearch = !$scope.showSearch;
		}

		/**
		 * Permite buscar los items, por default se busca '', osea trae todo
		 * @param {string} search
		 * @returns void
		 */
		$scope.searchItems = function(search = '') {
			$ionicLoading.show();
			Items.searchItems(search).then(res => {
				$ionicLoading.hide();
				$scope.items = res.data;
			}).catch(() => {
				$ionicLoading.hide();
				Utils.showPopup('Home', `Se produjo un error al buscar ${search} en los resultados`);
			});
		}

		/**
		 * Permite actualizar la lista de resultados...
		 * Emite un evento para decirle que termino y que corte el refresh...
		 * @returns void
		 */
		$scope.doRefresh = function() {
			Items.getAllItems().then(res => {
				$scope.items = res.data;
				$scope.$broadcast('scroll.refreshComplete');
			}).catch(() => { 
				$scope.$broadcast('scroll.refreshComplete');
				Utils.showPopup('Home', 'Se produjo un error al actualizar los resultados');
			});
		}

		/**
		 * Permite obtener todos los items publicados hasta la fecha,
		 * muestra mensaje de error si ocurre un error...
		 * @returns void
		 */
		$scope.getAllItems = function() {
			$ionicLoading.show();
			Items.getAllItems().then(res => {
				$ionicLoading.hide();
				$scope.items = res.data;
			}).catch(() => {
				$ionicLoading.hide();
				Utils.showPopup('Home', 'Se produjo un error al obtener los resultados');
			});
		}

		/**
		 * Permite ir al detalle de una publicación
		 * @param {number} id
		 * @returns void
		 */
		$scope.goDetail = function(id) {
			$state.go('detail', { 'id': id });
		}

	}
]);