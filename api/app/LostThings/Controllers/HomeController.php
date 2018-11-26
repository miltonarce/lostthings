<?php

namespace LostThings\Controllers;

use LostThings\Auth\Auth;
use LostThings\Core\App;
use LostThings\Core\View;

class HomeController
{
    public function index()
    {
        View::render('home');
    }
}