<?php
namespace Axioma\Customizations;

class Helper
{
    public static function stringToValidMethodName($string){
        $methodName = preg_replace_callback('/[^\p{L}\p{N}_-]/u', function ($match) {
            return '';
        }, $string);

        $methodName = str_replace(['-', '_'], ' ', $methodName);
        $methodName = ucwords($methodName);
        $methodName = lcfirst(str_replace(' ', '', $methodName));
        
        return $methodName;
    }
}