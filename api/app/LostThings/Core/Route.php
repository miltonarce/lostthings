<?php

namespace LostThings\Core;

/**
 * Class Route
 * @package DaVinci\Core
 *
 * Se encarga de manejar todo lo relativo a las rutas.
 *
 * Las rutas las vamos a guardar con la siguiente nomenclatura:

    'GET' => [
        'ruta' => 'NombreController@método'
    ]

    Por ejemplo:

    'GET' => [
        '/peliculas' => 'PeliculaController@index',
        '/peliculas/nueva' => 'PeliculaController@formAlta',
        '/perfil' => 'UsuarioController@perfil',
    ]
 */
class Route
{
    /** @var array Las rutas de todos los verbos. */
    protected static $routes = [
        'GET'       => [],
        'POST'      => [],
        'PUT'       => [],
        'DELETE'    => [],
    ];

    /** @var string  La acción del Controller a ejecutar. Ej: "PeliculaController@index" */
    protected static $controllerAction;

    /** @var array  Los parámetros parseados de la url, cuando esta contiene {}. */
    protected static $urlParameters = [];

    /**
     * Registra una ruta en la aplicación.
     *
     * @param string $method    El verbo HTTP de la ruta. Puede ser 'GET', 'POST', 'PUT', 'DELETE'.
     * @param string $url   La url de la ruta.
     * @param string $controller    El método del controller que lo va a manejar. La notación es: "NombreController@nombreMétodo".
     */
    public static function add($method, $url, $controller)
    {
        $method = strtoupper($method);
        // Ej:
        // self::$routes['GET']['/'] = 'HomeController@index';
        self::$routes[$method][$url] = $controller;
    }

    /**
     * Verifica si la ruta existe.
     *
     * @param string $method
     * @param string $url
     * @return boolean
     */
    public static function exists($method, $url)
    {
        // Verificamos si existe la ruta tal cual
        // me la piden.
        if(isset(self::$routes[$method][$url])) {
            return true;
        }
        // Verificamos si existe una ruta
        // parametrizada (que contenga valores entre
        // {}) que matchee la ruta que nos piden.
        else if(self::parameterizedRouteExists($method, $url)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Indica si existe una ruta parametrizada
     * que matchee la $url para el $method.
     *
     * Adicionalmente, va a parsear y almacenar
     * los datos de la url.
     *
     * @param string $method
     * @param string $url
     * @return bool
     */
    public static function parameterizedRouteExists($method, $url)
    {
        // Primero, explotamos la $url.
        $urlParts = explode('/', $url);

        // Recorremos todas las rutas para este
        // $method.
        foreach (self::$routes[$method] as $route => $controllerAction) {
            // Explotamos la $route.
            $routeParts = explode('/', $route);
            $routeMatches = true;
            $urlData = [];

            // Verificamos que cuenten con la misma cantidad
            // de partes.
            if(count($routeParts) != count($urlParts)) {
                $routeMatches = false;
            } else {
                // Recorremos las partes y las comparamos con las de la url.
                foreach ($routeParts as $key => $part) {
                    // Verificamos si no coinciden exactamente.
                    if($routeParts[$key] != $urlParts[$key]) {
                        // Verificamos si tiene una {
                        if(strpos($routeParts[$key], '{') === 0) {
                            // Obtenemos el nombre
                            // del parámetro, quitando
                            // las llaves del comienzo
                            // y del final.
                            $parameterName = substr($routeParts[$key], 1, -1);

                            // Guardamos el valor en
                            // el array de $urlData.
                            $urlData[$parameterName] = $urlParts[$key];
                        } else {
                            // La ruta no matchea :(
                            $routeMatches = false;
                        }
                    }
                }
            }

            // Verificamos si la ruta matchea.
            if($routeMatches) {
                // Guardamos los datos de la
                // ruta.
                self::$controllerAction = $controllerAction;
                self::$urlParameters = $urlData;

                return true;
            }
        }

        // No existe ninguna ruta que matchee.
        return false;
    }

    /**
     * Retorna el controller asociado a la ruta.
     * Ej: HomeController@index
     *
     * @param string $method
     * @param string $url
     * @return string
     */
    public static function getController($method, $url)
    {
        // Si obtuvimos una url parametrizada,
        // la retornamos.
        if(!is_null(self::$controllerAction)) {
            return self::$controllerAction;
        }

        return self::$routes[$method][$url];
    }

    /**
     * @return array
     */
    public static function getUrlParameters()
    {
        return self::$urlParameters;
    }
}