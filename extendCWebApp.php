<?php

class MyCWebApplication extends CWebApplication
{
    public function createController($route, $owner = null)
    {
        if(substr($route, 0, 5) == 'rest/')
        {
            parent::setControllerPath($this->getBasePath() . DIRECTORY_SEPARATOR . 'controllers');
        }
        return parent::createController($route, $owner);
    }
}

class MyYii extends Yii
{
    public static function createWebApplication($config = null)
    {
        return self::createApplication('MyCWebApplication', $config);
    }
}