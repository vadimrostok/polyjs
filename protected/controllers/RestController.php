<?php

// Путь к Rest = models.base.Rest

class RestController extends Controller
{

    const APPLICATION_ID = 'SHEPI';
    private $format = 'json';
    
    public function filters()
    {
        return array();
    }

    public function actionList($model)
    {
        switch($model) {
            case 'album':
                $data = Rest::_list(Album::model());
                break;
            case 'picture':
                $data = Rest::_list(Picture::model());
                break;
            case 'albumsWithPictures':
                Rest::releseResponse(
                    200,
                    Rest::prepareResponse(Album::seizeFullData())
                );
                break;
            default:
                $this->notImplementedResponse('list', $model);
        }
    }

    public function actionView($model, $id)
    {
        switch($model) {
            case 'album':
                $data = Rest::view(Album::model()->findByPk($id));
                exit;
                break;
            case 'picture':
                $data = Rest::view(Picture::model()->findByPk($id));
                break;
            default:
                $this->notImplementedResponse('view', $model);
        }
    }

    public function actionCreate($model)
    {
        if($this->checkPremission()) {
            if(count($_POST) > 0) {
                $post_vars = $_POST;
            } else {
                $json = file_get_contents('php://input');
                $post_vars = CJSON::decode($json, true);
            }
            switch($model) {
                case 'album':
                    $data = Rest::create(new Album(), $post_vars);
                    break;
                case 'picture':
                    $data = Rest::create(new Picture(), $post_vars);
                    break;
                default:
                    $this->notImplementedResponse('create', $model);
            }
        }
    }

    public function actionUpdate($id, $model)
    {
        if($this->checkPremission()) {
            $json = file_get_contents('php://input');
            $put_vars = CJSON::decode($json, true); 
            switch($model) {
                case 'album':
                    $data = Rest::update(Album::model()->findByPk($id), $put_vars);
                    break;
                case 'picture':
                    $data = Rest::update(Picture::model()->findByPk($id), $put_vars);
                    break;
                default:
                    $this->notImplementedResponse('update', $model);
            }
        }
    }

    public function actionDelete($id, $model)
    {
        if($this->checkPremission()) {
            switch($model) {
                case 'album':
                    $data = Rest::delete(Album::model()->findByPk($id));
                    break;
                case 'picture':
                    $data = Rest::delete(Picture::model()->findByPk($id));
                    break;
                default:
                    $this->notImplementedResponse('delete', $model);
            }
        }
    }

    public function checkPremission() {
        // Возможно в будущем на фронте будет авторизация.
        // Поэтому просто-залогиненый-юзер не обязательно админ.
        if(Yii::app()->user->isGuest || !Yii::app()->user->isAdmin()) {
            $errText = 'Authentication Required';
            Rest::releseResponse(
                403, 
                CJSON::encode(array('errorText' => $errText))
            );
            return false;
        }
        return true;
    }

    private function notImplementedResponse($modeID, $modelID) {
        $errText = sprintf('Mode %s is not implemented for model %s', $modeID, $modelID);
        Rest::releseResponse(
            501, 
            CJSON::encode(array('errorText' => $errText))
        );
    }
}