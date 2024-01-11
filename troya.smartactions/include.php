<?php
spl_autoload_register(function ($class) {

    $classFilePath = __DIR__.'/classes/' . str_replace('\\', '/', $class) . '.php';

    if (file_exists($classFilePath))
        require_once $classFilePath;

});

if(!function_exists('dump')){
    function dump($s){
        echo '<pre>';
        print_r($s);
        echo '</pre>';
    }
}

?>

