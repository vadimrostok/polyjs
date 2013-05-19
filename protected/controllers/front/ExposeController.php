<?php
class ExposeController extends Controller
{
    public $pageTitle ='Shepi';
    public $pageDescription = 'Тут хостятся фоточки.';
    public $defaultAction = 'list';
    public $layout = 'layout';
    public $currentAlbum;
    public $currentPicture;

    public function actionList()
    {
        $this->render('list');
    }

    public function actionIndex()
    {
        $this->redirect($this->createUrl('expose/list'));
    }

    public function actionGenerateSeoForAlbum($album) {
        $albumModel = Album::model()->findByPk($album);
        if(!$albumModel || $albumModel->status_id != Statuses::OK) {
            throw new CHttpException(404, 'No such data Shepi could found.');
        }
        $this->pageTitle = $albumModel->title;
        $this->pageDescription = $albumModel->title . ' ' . date('d.m.y', strtotime($albumModel->created_at)) . '.';
        $this->currentAlbum = $albumModel;
        $this->render('list');
    }

    public function actionGenerateSeoForPicture($album, $picture) {
        $albumModel = Album::model()->findByPk($album);
        $pictureModel = Picture::model()->findByPk($picture);
        if(!$albumModel 
            || $albumModel->status_id != Statuses::OK
            || !$pictureModel 
            || $pictureModel->album_id != $albumModel->id 
            || $pictureModel->status_id != Statuses::OK
        ) {
            throw new CHttpException(404, 'No such data Shepi could found.');
        }
        $this->pageTitle = $albumModel->title;
        $this->pageDescription = $albumModel->title
         . ' [' . $pictureModel->id . '] ' . date('d.m.y', strtotime($pictureModel->created_at)) . '.';
        $this->currentAlbum = $albumModel;
        $this->currentPicture = $pictureModel;
        $this->render('list');
    }

    public function actionError()
    {
        if($error = Yii::app()->errorHandler->error) {
            if(Yii::app()->request->isAjaxRequest) {
                echo $error['message'];
            } else {
                $this->render('error', $error);
            }
        }
    }
}