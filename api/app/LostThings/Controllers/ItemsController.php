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
}