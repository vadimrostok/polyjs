<?php

class RestController extends Controller
{
    /**
     * Key which has to be in HTTP USERNAME and PASSWORD headers 
     */
    Const APPLICATION_ID = 'FLKR';

    /**
     * Default response format
     * either 'json' or 'xml'
     */
    private $format = 'json';
    
    public function filters()
    {
        return array();
    }

    public function actionList($model)
    {
        switch($model) {
            case 'album':
                $data = Album::restList();
                break;
            case 'picture':
                $data = Picture::restList();
                break;
            case 'albumsWithPictures':
                restApi::releseResponse(
                    200,
                    restApi::prepareResponse(Album::seizeFullData())
                );
                break;
            default:
                $errText = sprintf('Mode list is not implemented for model %s', $model);
                restApi::releseResponse(
                    501, 
                    CJSON::encode(array('errorText' => $errText))
                );
        }
    }

    public function actionView($model, $id)
    {
        switch($model) {
            case 'album':
                $data = Album::restView($id);
                exit;
                break;
            case 'picture':
                $data = Picture::restView($id);
                break;
            default:
                $errText = sprintf('Mode view is not implemented for model %s', $model);
                restApi::releseResponse(
                    501, 
                    CJSON::encode(array('errorText' => $errText))
                );
        }
    }

    public function actionCreate($model)
    {
        if(Yii::app()->user->isGuest || !Yii::app()->user->isAdmin) {
            $errText = 'Authentication Required';
                restApi::releseResponse(
                    403, 
                    CJSON::encode(array('errorText' => $errText))
                );
        }
        if(count($_POST) > 0) {
            $post_vars = $_POST;
        } else {
            $json = file_get_contents('php://input');
            $post_vars = CJSON::decode($json, true);
        }
        switch($model) {
            case 'album':
                $data = Album::restCreate($post_vars);
                break;
            case 'picture':
                $data = Picture::restCreate($post_vars);
                break;
            default:
                $errText = sprintf('Mode create is not implemented for model %s', $model);
                restApi::releseResponse(
                    501, 
                    CJSON::encode(array('errorText' => $errText))
                );
        }
    }

    public function actionUpdate($id, $model)
    {
        $json = file_get_contents('php://input');
        $put_vars = CJSON::decode($json, true); 
        switch($model) {
            case 'album':
                $data = Album::restUpdate($id, $put_vars);
                break;
            case 'picture':
                $data = Picture::restUpdate($id, $put_vars);
                break;
            default:
                $errText = sprintf('Mode update is not implemented for model %s', $model);
                restApi::releseResponse(
                    501, 
                    CJSON::encode(array('errorText' => $errText))
                );
        }
    }

    public function actionDelete($id, $model)
    {
        switch($model) {
            case 'album':
                $data = Album::restDelete($id);
                break;
            case 'picture':
                $data = Picture::restDelete($id);
                break;
            default:
                $errText = sprintf('Mode delete is not implemented for model %s', $model);
                restApi::releseResponse(
                    501, 
                    CJSON::encode(array('errorText' => $errText))
                );
        }
    }
}