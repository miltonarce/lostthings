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
Route::add('GET', '/items/user/{idUser}', 'ItemsController@getItemsByUser');
Route::add('GET', '/items/{id}', 'ItemsController@detail');
Route::add('POST', '/items', 'ItemsController@create');
Route::add('PUT', '/items/{id}', 'ItemsController@edit');
Route::add('DELETE' , '/items/{id}', 'ItemsController@delete');
Route::add('GET', '/profile/{idUser}', 'UsuariosController@getAditionalInfo');
Route::add('POST', '/profile', 'UsuariosController@createProfile');
Route::add('PUT', '/profile/{idUser}', 'UsuariosController@editInfoUserLogged');
Route::add('GET', '/comments/{idPublish}', 'CommentsController@all');
Route::add('POST', '/comments/{idPublish}', 'CommentsController@publishComent');
Route::add('GET', '/users/{input}', 'UsuariosController@find');
Route::add('GET', '/friends/{idUser}', 'FriendsController@getFriendsByUser');
