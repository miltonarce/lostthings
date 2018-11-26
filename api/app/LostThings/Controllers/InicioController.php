<?php
namespace LostThings\Controllers;

use LostThings\Core\App;
use LostThings\Core\View;
use LostThings\Core\Auth;

class InicioController extends BaseController{
  public function listarinfo(){

    $this->requiresAuth();

    View::render('inicio/index');
  }
}