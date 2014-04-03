<?php
class Statuses extends CActiveRecord
{
    const OK = 1;
    const WAIT_FROM_MODERATION = 2;
    const BANNED = 3;
    const RELATED_PARENT_DELETED = 4;

    public function tableName()
    {
        return 'statuses';
    }

    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }
}