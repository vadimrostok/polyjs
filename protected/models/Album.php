<?php
class Album extends CActiveRecord
{
	use restApi;

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
			'pictures' => array(self::HAS_MANY, 'Picture', 'album_id'),
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

	protected function afterSave()
	{
		parent::afterSave();
		$this->refresh();
	}	

	//For JSON representation
	public static function seizeFullData()
	{
		$db = Yii::app()->db;
		$selectAlbumsSql = '
			SELECT
				`albums`.*
			FROM
				`albums`
			ORDER BY
				`albums`.`created_at` DESC
		';
		$albums = $db->createCommand($selectAlbumsSql)->queryAll();
		$selectPicturesSql = '
			SELECT
				`pictures`.*
			FROM
				`pictures`
		';
		$picturesByAlbumId = array();
		$pictures = $db->createCommand($selectPicturesSql)->queryAll();
		foreach($pictures as $picture) {
			if(!isset($picturesByAlbumId[$picture['album_id']])) {
				$picturesByAlbumId[$picture['album_id']] = array();
			}
			$picturesByAlbumId[$picture['album_id']][] = $picture;
		}
		foreach($albums as $key => $album) {
			$albums[$key]['pictures'] = isset($picturesByAlbumId[$album['id']])? 
				$picturesByAlbumId[$album['id']]
				: array();
		}
		return $albums;
	}
}