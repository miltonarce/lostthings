<?php

namespace LostThings\Controllers;

use LostThings\Models\Item;
use LostThings\Core\View;
use LostThings\Core\Validator;
use LostThings\Core\Route;

/**
 * Controller para manejar todas las acciones sobre el modelo Item
 */
Class ItemsController extends BaseController
{

  /**
   * Permite obtener todas las publicaciones que estan en el sitio
   * @return Item[]
   */
  public function all()
  {
    $item = new Item;
    $items = $item->all();
    View::renderJson($items);
  }
 
  /**
   * Permite obtener las publicaciones de un usuario particular por el id del mismo,
   * el usuario que quiere ver las publicaciones tiene que estar logueado...
   * @return Item[]
   */
  public function allItemsByUser() 
  {
    $this->checkUserIsLogged();
    $params = Route::getUrlParameters();
    $idUser = $params['idUser'];
    $item = new Item;
    $items = $item->allItemsByUser($idUser);
    View::renderJson($items);
  }

  /**
   * Permite obtener la informacion de una publicacion por el id de la misma
   * @return Item
   */
  public function getItem() 
  {
    $this->checkUserIsLogged();
    $params = Route::getUrlParameters();
    $id = $params['id'];
    try {
      $item = new Item;
      $item->getItem($id);
      View::renderJson($item);
    } catch (Exception $e) {
      View::renderJson(['status' => 0, 'message' => $e]);
    }
  }

  /**
   * Permite publicar una publicación
   * @return Array
   */
  public function save()
  {
    $idUser =  $this->checkUserIsLogged();
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    $validator = new Validator($data, [
      'titulo' => ['required'],
      'descripcion' => ['required'],
      'ubicacion' => ['required']
    ]);
    if ($validator->passes()) {
      try {
          $item = new Item;
          $item->save($idUser, [
            'titulo' => $data['titulo'],
            'descripcion' => $data['descripcion'],
            'img' => $data['img'],
            'ubicacion' => $data['ubicacion']
          ]);
          View::renderJson(['status' => 1, 'message' => 'Item creado exitosamente.', 'data' => $item]);
      } catch (Exeption $e) {
        View::renderJson(['status' => 0, 'message' => $e]);
      }
    } else {
      View::renderJson(['status' => 0, 'error' => $validator->getErrores()]);
    }
  }

  /**
   * Permite actualizar una publicación por el id de la misma, modifica los datos recibidos 
   * @return Array
   */
  public function update()
  {
    $idUser =  $this->checkUserIsLogged();
    $params = Route::getUrlParameters();
    $id = $params['id'];
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    $validator = new Validator($data, [
      'titulo' => ['required'],
      'descripcion' => ['required'],
      'ubicacion' => ['required']
    ]);
    if ($validator->passes()) {
      try {
        $item = new Item;
        $item->update($idUser, [
          'idpublicacion' => $id,
          'titulo' => $data['titulo'],
          'descripcion' => $data['descripcion'],
          'img' => $data['img'],
          'ubicacion' => $data['ubicacion']
        ]);
        View::renderJson(['status' => 1, 'message' => 'Item creado exitosamente.', 'data' => $data]);
      } catch (Exeption $e) {
        View::renderJson(['status' => 0, 'message' => $e]);
      }
    } else {
      View::renderJson(['status' => 0, 'error' => $validator->getErrores()]);
    }
  }

  /**
   * Permite eliminar una publicación por el id recibido...
   */
  public function delete()
	{
    $idUser =  $this->checkUserIsLogged();
		$params = Route::getUrlParameters();
    $id = $params['id'];
    try {
			$item = new Item;
			$item->delete($idUser, $id);
			View::renderJson(['status' => 1, 'message' => 'Se eliminó correctamente la publicación']);
		} catch (Exception $e) {
			View::renderJson(['status' => 0, 'message' => $e]);
		}
  }

  /**
   * Permite realizar una búsqueda con los datos que ingreso el user..
   * @return Item[]
   */
  public function search() 
  {
    $params = Route::getUrlParameters();
    $input = $params['input'];
    $item = new Item;
    $items = $item->search($input);
    View::renderJson($items);
  }

}