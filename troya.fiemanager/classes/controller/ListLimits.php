<?php
namespace Troya\FieManager\Controller;

use Troya\FieManager\Orm\ListLimitsTable;

class ListLimits extends \Bitrix\Main\Engine\Controller
{
    public function saveAction(array $fields)
    {
        $id = $fields['ID'];
        unset($fields['ID']);

        if($id)
            $result = ListLimitsTable::update($id, $fields);
        else
            $result = ListLimitsTable::add($fields);

        return [
            'id' => $result->getId(),
            'errors' => array_map(function($v){ return $v->getMessage();}, $result->getErrors()),
        ];
    }

    public function deleteAction($id){

        $result = ListLimitsTable::delete($id);
        return [
            'success' => $result->isSuccess(),
            'errors' => array_map(function($v){ return $v->getMessage();}, $result->getErrors()),
        ];
    }
}