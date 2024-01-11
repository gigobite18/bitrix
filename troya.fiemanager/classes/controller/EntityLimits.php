<?php
namespace Troya\FieManager\Controller;

use Troya\FieManager\Orm\EntityLimitsTable;

class EntityLimits extends \Bitrix\Main\Engine\Controller
{
    public function saveAction(array $fields)
    {
        $id = $fields['ID'];
        unset($fields['ID']);

        if($id)
            $result = EntityLimitsTable::update($id, $fields);
        else
            $result = EntityLimitsTable::add($fields);

        return [
            'id' => $result->getId(),
            'errors' => array_map(function($v){ return $v->getMessage();}, $result->getErrors()),
        ];
    }

    public function deleteAction($id){

        $result = EntityLimitsTable::delete($id);
        return [
            'success' => $result->isSuccess(),
            'errors' => array_map(function($v){ return $v->getMessage();}, $result->getErrors()),
        ];
    }
}