<?php
class Album extends CActiveRecord
{
	public $id;
	public $title;
	public $status_id;
	public $created_at;
	public $comment;
	public $main_picture_id;

	public function tableName()
	{
		return 'albums';
	}

	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	public function rules()
	{
		return array(
			array('title, comment', 'safe'),
		);
	}

	public function relations()
	{
		return array(
			'status' => array(self::BELONGS_TO, 'Statuses', 'status_id'),
		);
	}

	protected function beforeSave()
	{
		if(parent::beforeSave()) {
			if($this->isNewRecord) {
				$this->status_id = Statuses::OK;
			}
			return true;
		} else {
			return false;
		}
	}
}