<?php
class Picture extends CActiveRecord
{
    use restApi;

    //объект класса CUploadedFile
    public $image;
    //объект класса http://www.yiiframework.com/extension/image
    public $kohanaImageObject;

    public $id;
    public $extension_id;
    public $status_id;
    public $album_id;
    //имя загруженного файла
    public $name;
    public $clients_name;
    public $path;
    public $client_path;
    public $created_at;
    public $comment;
    public $file_info;

    //имя сохраненного файла
    public $filename;

    public function tableName()
    {
        return 'pictures';
    }

    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }

    public function rules()
    {
        return array(
            array('image', 'file', 'types'=>'jpg, jpeg, gif, png', 'maxSize' => 15 * 1024 * 1024),
            array('extension_id, album_id, name, clients_name, path, client_path, comment, file_info, filename', 'safe'),
        );
    }

    public function relations()
    {
        return array(
            'album' => array(self::BELONGS_TO, 'Album', 'album_id'),
            'extension' => array(self::BELONGS_TO, 'PictureExtensions', 'extension_id'),
            'status' => array(self::BELONGS_TO, 'Statuses', 'status_id'),
        );
    }

    protected function beforeSave()
    {
        if(parent::beforeSave()) {
            if($this->isNewRecord) {
                if(isset($this->image)) {
                    $this->name = $this->image->name;
                    $this->filename = md5(microtime()) . '_' . md5($this->name) . '.' . pathinfo($this->name)['extension'];
                    $this->client_path = AlbumPictures::SAVEDIR . '/' . $this->album_id . '/';
                    $this->path = Yii::app()->controller->relesePath(Yii::getPathOfAlias('webroot') . $this->client_path) . $this->filename;

                    $dirname = pathinfo($this->path)['dirname'];
                    if(!is_dir($dirname)) {
                        mkdir($dirname, 0755);
                    }
                    $this->image->saveAs($this->path);

                    $this->kohanaImageObject = Yii::app()->kohanaImageObject->load($this->path);
                    $this->file_info = '{width: ' . (int)$this->kohanaImageObject->width . ', height: ' . (int)$this->kohanaImageObject->height . '}';
                    $this->extension_id = PictureExtensions::getTypeId($this->kohanaImageObject->ext);
                }
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
        //делаем превьюшки с разными разрешениями
        //с помощью http://www.yiiframework.com/extension/image
        if(isset($this->kohanaImageObject, $this->filename)) {
            $isWidthLognger = $this->kohanaImageObject->width > $this->kohanaImageObject->height;
            $side = ($isWidthLognger)? $this->kohanaImageObject->width: $this->kohanaImageObject->height;
            if ($side >= 1300) {
                if ($side >= 1700) {
                    $this->savePicturePreview(1700, 1000);
                }
                $this->savePicturePreview(1300, 1000);
            }
            $this->savePicturePreview(400);
            $this->savePicturePreview(100);
        }
        $this->refresh();
    }
    
    /**
     * изменяет разрешение(если парамтры разрешения ненулевые)
     * и сохраняет в конечную директорию
     */
    public function savePicturePreview($wSide, $hSide = false)
    {
        $filename = $this->filename;
        $albumId = $this->album_id;
        if ($hSide == false) {
            $hSide = $wSide;
        }
        $this->kohanaImageObject->resize($wSide, $hSide);
        $wSide .= '_';
        $pathToAlbum = Yii::getPathOfAlias('webroot') . AlbumPictures::SAVEDIR . "/$albumId/";
        $this->kohanaImageObject->save(Yii::app()->controller->relesePath("$pathToAlbum$wSide$filename"));
        return "$pathToAlbum$wSide$filename";
    }

    public static function getPicturesByAlbumId($albumId = 0)
    {
        if($albumId > 0) {
            $albums = self::model()->findAll('album_id=' . (int)$albumId);
        } else {
            $albums = self::model()->findAll();
        }
        return $albums;
    }
}