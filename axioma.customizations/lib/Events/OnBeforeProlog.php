<?php
namespace Axioma\Customizations\Events;

use Axioma\Customizations\Pages\Identificator;

class OnBeforeProlog{
    public function __construct()
    {

        new Identificator();

    }

    public static function createInstance() {
        return new self();
    }
}