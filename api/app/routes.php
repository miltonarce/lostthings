<?php

use LostThings\Core\Route;

//Auth
Route::add('POST', '/login', 'AuthController@login');

//Profile
Route::add('GET', '/profile', 'UsuariosController@detail');
Route::add('GET', '/profile/{id}', 'UsuariosController@detailById');
Route::add('GET', '/profile/search/{input}', 'UsuariosController@search');
Route::add('POST', '/profile', 'UsuariosController@save');
Route::add('PUT', '/profile', 'UsuariosController@update');

//Items
Route::add('GET', '/items', 'ItemsController@all');
Route::add('POST', '/items', 'ItemsController@save');
Route::add('GET', '/items/{id}', 'ItemsController@getItem');
Route::add('PUT', '/items/{id}', 'ItemsController@update');
Route::add('DELETE' , '/items/{id}', 'ItemsController@delete');
Route::add('GET', '/items/user/{idUser}', 'ItemsController@allItemsByUser');

//Comments
Route::add('GET', '/comments/{idPublish}', 'CommentsController@all');
Route::add('POST', '/comments/{idPublish}', 'CommentsController@save');

//Friends
Route::add('GET', '/friends', 'FriendsController@all');
Route::add('GET', '/friends/request', 'FriendsController@allRequest');
Route::add('POST', '/friends/request/{id}', 'FriendsController@sendRequest');
Route::add('PUT', '/friends/request/{id}', 'FriendsController@acceptRequest');
Route::add('DELETE', '/friends/{id}', 'FriendsController@delete');