<?php
class ExposeController extends Controller
{
    public $pageTitle ='Shepi';
    public $pageDescription = 'Shepi';
    public $defaultAction = 'list';
    public $layout = 'layout';

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
        $this->pageTitle = 'Shepi. ' . $albumModel->title;
        $this->pageDescription = 'Shepi. Альбом \\"' . $albumModel->title . '\\". От ' . date('d.m.y', strtotime($albumModel->created_at)) . '.';
        $this->render(
            'list', 
            array(
                'album' => $albumModel
            )
        );
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
        $this->pageTitle = 'Shepi. ' . $albumModel->title;
        $this->pageDescription = 'Shepi. Альбом \\"' . $albumModel->title . '\\". От ' . date('d.m.y', strtotime($albumModel->created_at))
         . '. Изображение ' . $pictureModel->id . ', дата создания: ' . date('d.m.y', strtotime($pictureModel->created_at)) . '.';
        $this->render(
            'list',
            array(
                'album' => $albumModel,
                'picture' => $pictureModel
            )
        );
    }

    /*
    * в будущем нужен будет функционал создания альбомов гостями. 
    * сий код оставлю в качествее напоминания об этом
    public function actionBay()
    {
        $response = array();
        if(isset($_POST['images'])) {
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
    */

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