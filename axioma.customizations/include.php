<?php


function dump($s=false){
    global $USER;
    if($USER->getId() != 132)
        return;

    print_r('<pre>');
    print_r($s);
    print_r('</pre>');
}

spl_autoload_register(function ($class) {
    if(strpos($class, 'Axioma') === false)
        return;

    $folders = array_values(array_filter(explode('\\', $class)));
    $fileName = $folders[count($folders)-1].'.php';

    unset($folders[0], $folders[1], $folders[count($folders)-1]);

    $tryPath = __DIR__.'/lib/'.implode('/', $folders).'/'.$fileName;

    if(file_exists($tryPath))
        include_once $tryPath;
});