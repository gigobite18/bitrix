<?php

\Bitrix\Main\Loader::registerAutoLoadClasses('troya.llfclient', array(
    '\Troya\LLFClient\Pages\Identificator' 		=>	'classes/Pages/Identificator.php',
    '\Troya\LLFClient\Pages\Manager' 		=>	'classes/Pages/Manager.php',
));


if(!function_exists('dump')){
    function dump($s=''){
        print_r('<pre>');
        print_r($s);
        print_r('</pre>');
    }
}

?>