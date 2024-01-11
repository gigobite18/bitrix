<?php
namespace Troya\FieManager\Controller;

use Troya\FieManager\Orm\BlockingsTable;

class Blockings extends \Bitrix\Main\Engine\Controller
{
    public function saveAction(array $fields)
    {
        $id = $fields['ID'];
        unset($fields['ID']);

        if($id)
            $result = BlockingsTable::update($id, $fields);
        else
            $result = BlockingsTable::add($fields);

        return [
            'id' => $result->getId(),
            'errors' => array_map(function($v){ return $v->getMessage();}, $result->getErrors()),
        ];
    }

    public function deleteAction($id){

        $result = BlockingsTable::delete($id);
        return [
            'success' => $result->isSuccess(),
            'errors' => array_map(function($v){ return $v->getMessage();}, $result->getErrors()),
        ];
    }
}