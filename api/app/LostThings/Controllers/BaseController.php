<?php
namespace LostThings\Controllers;

use LostThings\Auth\Auth;
use LostThings\Core\App;

class BaseController{
  public function requiresAuth(){
    if(!Auth::isLogged()){
      App::redirect('login');
      exit;
    }
  }
}