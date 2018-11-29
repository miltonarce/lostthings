<?php

namespace LostThings\Controllers;

use LostThings\Models\Item;
use LostThings\Core\View;
use LostThings\Core\Route;

Class ItemsController extends BaseController{
  /**
   * Metodo que trae los items
   */
  public function all(){
    $item = new Item;
    $items = $item->all();
    View::renderJson($items);
  }
 /**
  * Metodo para  crear o publicar items
  * @return bool 1 se creo el elemento 0 no se creo
  */
  public function create(){
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    try{
      $item = new Item;
      $item->create([
        'titulo' => $data['titulo'],
        'descripcion' => $data['descripcion'],
        'img' => $data['img'],
        'fecha_publicacion' => $data['fecha_publicacion'],
        'ubicacion' => $data['ubicacion'],
        'fkidusuario' => $data['fkidusuario']
      ]);

      View::renderJson([
        'status' => 1,
        'message' => 'Item creado exitosamente.',
        'data' => $item
      ]);
    }catch(Exeption $e){
      View::renderJson([
        'status' => 0,
        'message' => $e
      ]);
    }
  }
  public function edit()
  {
    $params = Route::getUrlParameters();
    $id = $params['id'];
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);

    try{
      $item = new Item;
      $item->edit([
        'titulo' => $data['titulo'],
        'descripcion' => $data['descripcion'],
        'img' => $data['img'],
        'fecha_publicacion' => $data['fecha_publicacion'],
        'ubicacion' => $data['ubicacion'],
      ]);

      View::renderJson([
        'status' => 1,
        'message' => 'Item creado exitosamente.',
        'data' => $data
      ]);
    }catch(Exeption $e){
      View::renderJson([
        'status' => 0,
        'message' => $e
      ]);
    }
  }
  public function delete()
	{
		$params = Route::getUrlParameters();
    $id = $params['id'];
    try {
			$item = new Item;
			$producto->delete($id);
			View::renderJson([
				'status' => 1,
				'message' => 'El elemento fue eliminado correctamente',
			]);
		} catch(Exception $e) {
			View::renderJson([
				'status' => 0,
				'message' => 'Hubo un error, no se pudo eliminar el elemento.'
			]);
		}
  }
}