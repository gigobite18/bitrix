<?php
namespace Troya\FieManager\Controller;

use Troya\FieManager\Orm\StringFillmentTable;

class StringFillment extends \Bitrix\Main\Engine\Controller
{
    public function saveAction(array $fields)
    {
        $id = $fields['ID'];
        unset($fields['ID']);

        if($id)
            $result = StringFillmentTable::update($id, $fields);
        else
            $result = StringFillmentTable::add($fields);

        return [
            'id' => $result->getId(),
            'errors' => array_map(function($v){ return $v->getMessage();}, $result->getErrors()),
        ];
    }

    public function deleteAction($id){

        $result = StringFillmentTable::delete($id);
        return [
            'success' => $result->isSuccess(),
            'errors' => array_map(function($v){ return $v->getMessage();}, $result->getErrors()),
        ];
    }
}