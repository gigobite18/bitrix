<?php
spl_autoload_register(function ($class) {
    if(strpos($class, 'Troya') === false)
        return;

    $folders = array_values(array_filter(explode('\\', $class)));
    $fileName = $folders[count($folders)-1].'.php';
    unset($folders[count($folders)-1], $folders[0], $folders[1]);
    $tryPath = __DIR__.'/classes/'.strtolower(implode('/', $folders)).'/'.$fileName;

    if(file_exists($tryPath))
        include_once $tryPath;


});

if(!function_exists('dump')){
    function dump($s){
        echo '<pre>';
        print_r($s);
        echo '</pre>';
    }
}