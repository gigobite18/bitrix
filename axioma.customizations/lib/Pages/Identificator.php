<?php

namespace Axioma\Customizations\Pages;

use Axioma\Customizations\Helper;

class Identificator{

    protected $rulls;
    protected $classes;

    public function __construct()
    {

        $this->defineRulls();

        $this->checkPage();

    }

    private function defineRulls(){

        $classes = include 'classes.php';

        if(!is_array($classes))
            return;

        foreach ($classes as $classString){

            try {
                $config = $classString::getConfig();

                if(!is_array($config))
                    continue;

                if(!is_string($config['path']) || !is_array($config['pages']))
                    continue;

                $this->definePathPages($config, $classString);
            }
            catch (\Exception $e){
                continue;
            }


        }

    }

    private function definePathPages($config, $classString){

        $path = $config['path'];
        $pages = $config['pages'];


        $this->rulls[$path] = $this->rulls[$path]? array_merge($this->rulls[$path], $pages)  : $pages;
        $this->classes[$path] = $this->classes[$path]? $this->classes[$path] + [$classString] : [$classString];
    }

    private function checkPage(){

        $engine = new \CComponentEngine();

        foreach ($this->rulls as $objectPath => $pages){


            try {

                $variables = [];

                $page = $engine->guessComponentPath(
                    '/',
                    $pages,
                    $variables
                );

                if($page){

                    $classes = $this->classes[$objectPath];
                    foreach ($classes as $classString){
                        $method = Helper::stringToValidMethodName($page).'PageDetected';

                        if (method_exists($classString, $method))
                            $classString::$method($variables);
                        else
                            dump("Отсутствует метод $classString::$method()");
                    }

                }

            }catch (\Exception $e){
                continue;
            }


        }

    }
}