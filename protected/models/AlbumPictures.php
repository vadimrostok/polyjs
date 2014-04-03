<?php
class AlbumPictures extends CFormModel
{
    const SAVEDIR = '/data/pictures';

    /**
     * Вызывается для сохранения данных из формы загрузки файлов
     * из админки, берет данные по ключу pictures из _FILES.
     */
    public static function handlePostPictures($albumId)
    {
        $images = CUploadedFile::getInstancesByName('pictures');
        foreach($images as $image) {
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