<?php
spl_autoload_register(function($className) {

    $className = str_replace('\\', '/', $className);

    $filepath = __DIR__ . '/app/' . $className . ".php";

    if(file_exists($filepath)) {
        require $filepath;
    }
});