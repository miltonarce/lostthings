<?php

use LostThings\Core\Route;

//Auth
Route::add('POST', '/login', 'AuthController@login');

//Profile
Route::add('GET', '/profile', 'ProfileController@detail');
Route::add('GET', '/profile/{id}', 'ProfileController@detailById');
Route::add('GET', '/profile/search/{input}', 'ProfileController@search');
Route::add('POST', '/profile', 'ProfileController@save');
Route::add('PUT', '/profile', 'ProfileController@update');

//Items
Route::add('GET', '/items', 'ItemsController@all');
Route::add('POST', '/items', 'ItemsController@save');
Route::add('GET', '/items/{id}', 'ItemsController@getItem');
Route::add('PUT', '/items/{id}', 'ItemsController@update');
Route::add('DELETE' , '/items/{id}', 'ItemsController@delete');
Route::add('GET', '/items/search/{input}', 'ItemsController@search');
Route::add('GET', '/items/user/{idUser}', 'ItemsController@allItemsByUser');

//Comments
Route::add('GET', '/comments/{idPublish}', 'CommentsController@all');
Route::add('POST', '/comments/{idPublish}', 'CommentsController@save');

//chats y chats mensajes
Route::add('GET', '/chatsmsgs/{tokenchat}', 'ChatsmsgsController@all');
Route::add('POST', '/chatsmsgs', 'ChatsmsgsController@sendmsg');
Route::add('POST', '/chats', 'ChatsController@create');

//Friends
Route::add('GET', '/friends', 'FriendsController@all');
Route::add('GET', '/friends/request', 'FriendsController@allRequest');
Route::add('POST', '/friends/request/{id}', 'FriendsController@sendRequest');
Route::add('PUT', '/friends/request/{id}', 'FriendsController@acceptRequest');
Route::add('DELETE', '/friends/{id}', 'FriendsController@delete');