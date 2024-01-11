<?php
namespace Troya\FieManager\Controller;

use Bitrix\Main\Loader,
    Bitrix\Crm\Service;

class Dynamic extends \Bitrix\Main\Engine\Controller
{
    const ALLOW_SHOW_FIELDS = [
        'ID',
        'ASSIGNED_BY_ID',
        'BEGINDATE',
        'CATEGORY_ID',
        'CLOSED',
        'CLOSEDATE',
        'COMPANY_ID',
        'CONTACT_ID',
        'CREATED_BY',
        'CREATED_TIME',
        'OPENED',
        'STAGE_ID',
        'STAGE_SEMANTIC_ID',
        'VALUE',
        'UPDATED_BY',
        'UPDATED_TIME',
        'SOURCE_ID',
        'TITLE',
    ];

    public static function getFieldsAction($entity)
    {
        if(!Loader::IncludeModule('crm'))
            return;

        if(intval($entity) != $entity){
            $entity = \CCrmOwnerType::ResolveID($entity);
        }

        $factory = Service\Container::getInstance()->getFactory($entity);

        if($factory){
            $fields = $factory->getUserFieldsInfo();
            $defFields = array_intersect_key($factory->getFieldsInfo(), array_flip(self::ALLOW_SHOW_FIELDS));

            if($defFields['CATEGORY_ID']){
                $defFields['CATEGORY_ID']['ITEMS'] = array_map(function($v){
                    return [
                        'ID' => $v->getId(),
                        'VALUE' => $v->getName(),
                    ];
                }, $factory->getCategories());
                $defFields['CATEGORY_ID']['TYPE'] = 'enumeration';
            }

            if($defFields['STAGE_ID']){
                $defFields['STAGE_ID']['ITEMS'] = array_map(function($v){
                    return [
                        'ID' => $v->get('STATUS_ID'),
                        'VALUE' => $v->get('NAME'),
                    ];
                }, $factory->getStages()->getAll());
                $defFields['STAGE_ID']['TYPE'] = 'enumeration';
            }

            if($defFields['STAGE_SEMANTIC_ID']){
                $defFields['STAGE_SEMANTIC_ID']['ITEMS'] = [
                    ['ID' => 'P', 'VALUE' => 'Промежуточная стадия'],
                    ['ID' => 'S', 'VALUE' => 'Успешная стадия'],
                    ['ID' => 'F', 'VALUE' => 'Провальная стадия'],
                ];
                $defFields['STAGE_SEMANTIC_ID']['TYPE'] = 'enumeration';
            }

            if($defFields['SOURCE_ID']){
                foreach (\CCrmStatus::GetStatusList('SOURCE') as $id => $title){
                    $defFields['SOURCE_ID']['ITEMS'][] = [
                        'ID' => $id,
                        'VALUE' => $title,
                    ];
                }
                $defFields['SOURCE_ID']['TYPE'] = 'enumeration';
            }

            $fields = array_merge($defFields, $fields);
        }


        return [
            'fields' => $fields,
        ];
    }

    public function deleteAction($id){

        $result = StringFillmentTable::delete($id);
        return [
            'success' => $result->isSuccess(),
            'errors' => array_map(function($v){ return $v->getMessage();}, $result->getErrors()),
        ];
    }

    public function getEntityItemsAction($entity, $filter=[]){

        if(!Loader::IncludeModule('crm'))
            return;

        if(intval($entity) != $entity){
            $entity = \CCrmOwnerType::ResolveID($entity);
        }

        $factory = Service\Container::getInstance()->getFactory($entity);

        $itemsRS = $factory->getItems([
            'select' => ['*'],
            'filter' => $filter
        ]);
        $items = [];

        foreach ($itemsRS as $item){
            $itemData = $item->getCompatibleData();
            $items[$itemData['ID']] = $itemData;
        }

        return $items;
    }
}