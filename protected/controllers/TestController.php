<?php
/**
 * Тут функции помощники юнит тестов.
 */
class TestController extends Controller
{
    public function actionGetPictures() {
        echo CJSON::encode(
                Yii::app()->db
                ->createCommand('SELECT `id` FROM `pictures` ORDER BY `id` DESC LIMIT 0,' . $_POST['count'])
                ->queryAll()
            );
    }

    public function actionCheckFile() {
        echo (is_file($_POST['path']))? 'true': 'false';
    }
}