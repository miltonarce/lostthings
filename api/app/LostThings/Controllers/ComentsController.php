<?php

namespace LostThings\Controllers;

use LostThings\Models\Item;
use LostThings\Core\View;
use LostThings\Core\Route;

Class ComentsController extends BaseController{
   
  public function getItemsComents(){
    $params = Route::getUrlParameters();
    $id = $params['id'];
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

}