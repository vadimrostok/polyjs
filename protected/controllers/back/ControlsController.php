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
        $params = [
            'albums' => Album::seizeFullData(/*with pictures?yeeeeees*/)
        ];
        $this->render('admin', $params);
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
}