<?php
namespace Troya\FieManager\Controller;

use Troya\FieManager\Orm\RequirementsTable;

class Requirements extends \Bitrix\Main\Engine\Controller
{
    public function saveAction(array $fields)
    {
        $id = $fields['ID'];
        unset($fields['ID']);

        if($id)
            $result = RequirementsTable::update($id, $fields);
        else
            $result = RequirementsTable::add($fields);

        return [
            'id' => $result->getId(),
            'errors' => array_map(function($v){ return $v->getMessage();}, $result->getErrors()),
        ];
    }

    public function deleteAction($id){

        $result = RequirementsTable::delete($id);
        return [
            'success' => $result->isSuccess(),
            'errors' => array_map(function($v){ return $v->getMessage();}, $result->getErrors()),
        ];
    }
}