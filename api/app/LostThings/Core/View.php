<?php

namespace LostThings\Core;

class View
{
    /**
     * Imprime la vista indicada.
     *
     * @param string $__vista   La ruta de la vista, sin el php.
     * @param array $__data     Los datos a proporcionale a la vista. El índice va a ser el nombre de la variable, y el valor, el dato asignado.
     */
    public static function render($__vista, $__data = [])
    {
        // Ej:
        // $__data = ['peliculas' => $peliculas];
//        $peliculas = $__data['peliculas'];

        // Cargamos los datos para la vista.
        foreach ($__data as $key => $value) {
            ${$key} = $value;
        }

        // Incluimos el header.
        require App::getViewsPath() . '/templates/header.php';

        require App::getViewsPath() . '/' . $__vista . ".php";

        // Incluimos el footer.
        require App::getViewsPath() . '/templates/footer.php';
    }

    /**
     * Retorna la $data con formato JSON.
     *
     * @param mixed $data
     */
    public static function renderJson($data)
    {
        header('Content-Type: application/json');
        echo json_encode($data);
    }
}