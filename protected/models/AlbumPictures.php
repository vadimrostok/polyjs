<?php
class AlbumPictures extends CModelBase
{
	//const TMPDIR = '/data/tmpPictures';
	const SAVEDIR = '/data/pictures';
	/**
	 * вызывается для обработки данных из формы 
	 * с фронта, использует данные по ключу pictures из _FILES 
	 */
	public static function handlePostPictures($albumId)
	{
		$images = CUploadedFile::getInstancesByName('pictures');
		foreach ($images as $image) {
			$model = new Picture;
			$model->image = $image;
			if ($model->validate()) {
				$model->album_id = $albumId;
				$model->save();
			} elseif($model->hasErrors()) {
				Yii::app()->controller->dump($model->getErrors());
			}
		}
	}
}