<?php

class ControlsController extends Controller
{
    public $defaultAction = 'index';
    public $layout = 'layout';

    public function filters()
    {
        return array(
            'accessControl',
        );
    }

    public function accessRules()
    {
        return array(
            array('allow',
                'users' => array('@'),
            ),
            array('allow',
                'actions' => array('auth'),
            ),
            array('deny',
                'users' => array('*'),
                'deniedCallback' => 
                    function() 
                    {
                        Yii::app()->controller->redirect(
                            Yii::app()->createUrl('controls/auth')
                        );
                    }
            ),
        );
    }

    public function actionAdmin()
    {
        $this->render('admin');
    }

    public function actionIndex()
    {
        $this->redirect($this->createUrl('controls/admin'));
    }

    public function actionAuth()
    {
        $model = new AdminAuth;
        if(isset($_POST['ajax']) && $_POST['ajax'] === 'auth-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }

        if(isset($_POST['AdminAuth'])) {
            $model->attributes = $_POST['AdminAuth'];
            if($model->validate() && $model->login()) {
                $this->redirect($this->createUrl('controls/index'));
            }
        }
        $this->render('auth', array('model' => $model));
    }

    /*
     * Принимает изображения, есть функционал создания нового альбома
     * (если не передан id альбома), но пока не используется. Основная 
     * логика обработки изображений начинается в AlbumPictures::handlePostPictures.
     */
    public function actionBay()
    {
        $response = array();
        if(isset($_POST['images']) || isset($_POST['album_id'])) {
            if(!isset($_POST['album_id'])) {
                if(isset($_SESSION['album_id'], $_SESSION['last_upload_time']) && $_SESSION['last_upload_time'] + 60*5 > time() && Album::model()->findByPk($_SESSION['album_id'])) {
                    $albumId = $_SESSION['album_id'];
                } else {
                    $album = new Album;
                    $album->title = 'TMP ' . time() . microtime();
                    $album->save();
                    $albumId = $_SESSION['album_id'] = $album->id;
                    $_SESSION['last_upload_time'] = time();
                }
            } else {
                $albumId = $_POST['album_id'];
            }
            $response['errors'] = AlbumPictures::handlePostPictures($albumId);
        } else {
            $response['errors'] = array(
                array(
                    'type' => 'handmade', 
                    'text' => 'What are you doing? Drop a line to ' . Yii::app()->adminEmail . ' about.'
                )
            );
        }
        $this->json($response);
    }
}
