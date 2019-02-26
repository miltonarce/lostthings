angular.module('lostThings.services').factory('Items', [
  '$http',
  'API_SERVER',
  'Authentication',
  function($http, API_SERVER, Authentication) {

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
      return $http.get(`${API_SERVER}/items/user/${idUser}`, Authentication.getHeaderForAPI());
    }

    /**
     * Permite buscar los items por el valor ingresado como parametro, si el usuario
     * ingresa vacio, se trae todo...
     * @param {string} input
     * @returns Promise
     */
    function searchItems(input) {
      if (input.length > 0) {
        return $http.get(`${API_SERVER}/items/search/${input}`);
      } else {
        return getAllItems();
      }
    }

    /**
     * Permite publicar un item para mostrarse en el listado,
     * antes de enviar se manipula el request y se genera el base64 para la imagen...
     * @param {Object} item
     * @returns Promise
     */
    function publishItem(item) {
      item.img = item.img ? `data:${item.img.filetype};base64, ${item.img.base64}` : null;
      return $http.post(`${API_SERVER}/items`, item, Authentication.getHeaderForAPI());
    }

    /**
     * Permite obtener el detalle de una publicacion
     * @param {number} id
     * @returns Promise
     */
    function getDetail(id) {
      return $http.get(`${API_SERVER}/items/${id}`, Authentication.getHeaderForAPI());
    }

    /**
     * Permite editar una publicación, se envia el id del mismo y el item
     * con los datos a modificar...
     * @param {number} id 
     * @param {Object} item 
     * @returns Promise
     */
    function edit(id, item) {
      return $http.put(`${API_SERVER}/items/${id}`, item, Authentication.getHeaderForAPI());
    }

    /**
     * Permite eliminar una publicación por el id de la misma
     * @param {number} id 
     * @returns Promise
     */
    function remove(id) {
      return $http.delete(`${API_SERVER}/items/${id}`, Authentication.getHeaderForAPI());
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
