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
      item.img = item.img ? item.img.base64 : null;
      return $http.post(`${API_SERVER}/items`, item);
    }

    /**
     * Permite obtener el detalle de una publicacion
     * @param {number} id
     * @returns Promise
     */
    function getDetail(id) {
      return new Promise((resolve,reject) => resolve(mockgetDetail))

      //return $http.get(`${API_SERVER}/items/${id}`);
    }

    /**
     * Permite editar una publicación, se envia el id del mismo y el item
     * con los datos a modificar...
     * @param {number} id 
     * @param {Object} item 
     * @returns Promise
     */
    function edit(id, item) {
      return $http.put(`${API_SERVER}/items/${id}`, item);
    }

    /**
     * Permite eliminar una publicación por el id de la misma
     * @param {number} id 
     * @returns Promise
     */
    function remove(id) {
      return $http.delete(`${API_SERVER}/items/${id}`);
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
      edit: edit,
      remove: remove,
      commentPublication: commentPublication
    };
  }
]);
