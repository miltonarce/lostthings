angular.module("lostThings.services").factory("Items", [
  "$http",
  "API_SERVER",
  function($http, API_SERVER) {

    /**
     * Permite obtener todos los items perdidos
     * @returns Promise
     */
    function getAllItems() {
      return $http.get(`${API_SERVER}/items`);
    }

    /**
     * Permite buscar los items por el valor ingresado como parametro
     * @param {string} search
     * returns Promise
     */
    function searchItems(search) {
      return $http.get(`${API_SERVER}/items?search=${search}`);
    }

    /**
     * Permite publicar un item para mostrarse en el listado
     * @param {Object} item
     */
    function publishItem(item) {
      return $http.post(`${API_SERVER}/items`);
    }

    /**
     * Permite obtener el detalle de una publicacion
     * @param {number} id
     * @returns Promise
     */
    function getDetail(id) {
      return $http.get(`${API_SERVER}/items/id=${id}`);
    }

    /**
     * Permite comentar una publicación
     * @param {Object} item
     */
    function commentPublication(item, idUser) {
      //return $http.get(`${API_SERVER}/items/id=${id}`);
      commentPublicationMock.descripcion = item.description;
      return new Promise((resolve, reject) => resolve(commentPublicationMock));
    }

    return {
      getAllItems: getAllItems,
      searchItems: searchItems,
      publishItem: publishItem,
      getDetail: getDetail,
      commentPublication: commentPublication
    };
  }
]);
