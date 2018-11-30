<?php

namespace LostThings\Controllers;

use LostThings\Models\Item;
use LostThings\Core\View;
use LostThings\Core\Route;

Class ComentsController extends BaseController{
   
  public function all(){
    $params = Route::getUrlParameters();
    $id = $params['idPublish'];
    try{
      $item = new Item;
      $items = $item->getItemsComents($id);
      View::renderJson($items);
    }catch(Exception $e){
      View::renderJson([
      'status' => 0,
      'message' => $e
      ]);
    }
  }

  public function publishComent(){
    $params = Route::getUrlParameters();
    $idpublicacion = $params['idPublish'];
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    try{
      $item = new Item;
      $item->createComment([
        'fkidpublicacion' => $id,
        'fkidusuario' => $data['idusuario'],
        'comentario' => $data['comentario'],
        'fecha_publicacion' => $data['fecha_publicacion']
      ]);

      View::renderJson([
        'status' => 1,
        'message' => 'Comentario creado exitosamente.',
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