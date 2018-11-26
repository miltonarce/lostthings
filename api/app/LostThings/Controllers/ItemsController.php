<?php

namespace LostThings\Controllers;

use LostThings\Models\Item;
use LostThings\Core\View;
use LostThings\Core\Route;

Class ItemsController extends BaseController{
  public function all(){
    $item = new Item;
    $items = $item->all();
    View::renderJson($items);
  }
}