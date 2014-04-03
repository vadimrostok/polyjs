<?php
class Controller extends CController
{
    public $layout = '//layouts/layout';
    public $breadcrumbs = array();

    public function init()
    {
        parent::init();
        
        if(!isset($_SESSION)) {
            session_start();
        }
    }

    public static function dump()
    {
        echo self::arrDump(func_get_args());
    }

    public static function arrDump($vars)
    {
        $output = '';
        foreach($vars as $item) {
            $output .= '<pre>' . print_r($item, true) . '</pre>';
        }
        return $output;
    }

    public static function relesePath($fullPath) 
    {
        $pathToFile = pathinfo($fullPath);
        $pathToFile = $pathToFile['dirname'];
        if(!is_dir($pathToFile)) {
            mkdir($pathToFile, 0755, true);
        }
        return $fullPath;
    }

    public static function json($obj) 
    {
        $obj['executionTime'] = sprintf('%0.5f', Yii::getLogger()->getExecutionTime());
        echo CJSON::encode($obj);
    }

    public function actionError()
    {
        if($error = Yii::app()->errorHandler->error) {
            echo $error['message'];
        }
    }

    public function actionLogout() 
    {
        Yii::app()->user->logout();
    }
}