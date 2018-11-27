<?php
/*
 * Este archivo va a contener TODAS las rutas de
 * nuestra aplicación.
 *
 * Para esto, vamos a crear una clase Route cuya
 * función sea la de registrar y administrar las rutas.
 */
use LostThings\Core\Route;

Route::add('POST', '/login', 'AuthController@login');
Route::add('GET', '/items', 'ItemsController@all');
Route::add('POST', '/register', 'UsuariosController@create');



