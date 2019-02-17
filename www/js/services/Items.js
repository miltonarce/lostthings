angular.module("lostThings.services").factory("Items", [
  "$http",
  "API_SERVER",
  "Authentication",
  function($http, API_SERVER, Authentication) {

    //Header default para el token
    const defaultHeader = {
      headers: {
          'X-Token' : Authentication.getToken()
      }
    };

    /**
     * Permite obtener todos los items perdidos
     * @returns Promise
     */
    function getAllItems() {
      return $http.get(`${API_SERVER}/items`);
    }

    /**
     * Permite obtener los items que publico el usuario
     * @param {number} idUser
     * @returns Promise
     */
    function getItemsByUser(idUser) {
      return $http.get(`${API_SERVER}/items/user/${idUser}`, defaultHeader);
    }

    /**
     * Permite buscar los items por el valor ingresado como parametro
     * @param {string} search
     * @returns Promise
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
      return $http.post(`${API_SERVER}/items`, item, defaultHeader);
    }

    /**
     * Permite obtener el detalle de una publicacion
     * @param {number} id
     * @returns Promise
     */
    function getDetail(id) {
      return $http.get(`${API_SERVER}/items/${id}`, defaultHeader);
    }

    /**
     * Permite editar una publicación, se envia el id del mismo y el item
     * con los datos a modificar...
     * @param {number} id 
     * @param {Object} item 
     * @returns Promise
     */
    function edit(id, item) {
      return $http.put(`${API_SERVER}/items/${id}`, item, defaultHeader);
    }

    /**
     * Permite eliminar una publicación por el id de la misma
     * @param {number} id 
     * @returns Promise
     */
    function remove(id) {
      return $http.delete(`${API_SERVER}/items/${id}`, defaultHeader);
    }

    return {
      getAllItems: getAllItems,
      getItemsByUser: getItemsByUser,
      searchItems: searchItems,
      publishItem: publishItem,
      getDetail: getDetail,
      edit: edit,
      remove: remove
    };
  }
  
]);
