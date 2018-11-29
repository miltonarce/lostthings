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
     * Permite publicar un item para mostrarse en el listado,
     * antes de enviar se manipula el request y se genera el base64 para la imagen...
     * @param {Object} item
     * @returns Promise
     */
    function publishItem(item) {
      item.img = item.img ? `data:${item.img.filetype};base64, ${item.img.base64}` : null;
      return $http.post(`${API_SERVER}/items`, item);
    }

    /**
     * Permite obtener el detalle de una publicacion
     * @param {number} id
     * @returns Promise
     */
    function getDetail(id) {
      return $http.get(`${API_SERVER}/items/${id}`);
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
     * @param {Object} comment
     * @returns Promise
     */
    function commentPublication(comment) {
      return $http.post(`${API_SERVER}/comments`, comment);
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
