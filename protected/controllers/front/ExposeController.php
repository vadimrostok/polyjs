<?php
//Выздоравливай скорее, Таша :3
class ExposeController extends Controller
{
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

	public function actionBay()
	{
		$response = array();
		if(isset($_POST['images'])) {
			if(!isset($_POST['album_id'])) {
				if(isset($_SESSION['album_id'])) {
					$albumId = $_SESSION['album_id'];
				} else {
					$album = new Album;
					$album->title = 'TMP ' . time() . microtime();
					$album->save();
					$albumId = $_SESSION['album_id'] = $album->id;
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