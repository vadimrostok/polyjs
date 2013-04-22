<?php
trait restApi
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return '';
    }
    
    //translate into dao
    public static function restList()
    {
        $data = self::model()->findAll();
        self::releseResponse(
            200,
            self::prepareResponse($data)
        );
    }

    public static function restView($id)
    {
        $data = self::model()->findByPk($id);
        if(isset($data)) {
            self::releseResponse(
                200,
                self::prepareResponse($data)
            );
        } else {
            self::releseResponse(
                404,
                CJSON::encode(array('errorText' => 'No Item found with id ' . (int)$id))
            );
        }
    }

    public static function restCreate($params)
    {
        $model = new self;
        foreach($params as $key => $value) {
            if($model->hasAttribute($key)) {
                $model->$key = $value;
            }
        }
        if($model->save()) {
            self::releseResponse(
                200,
                self::prepareResponse($model)
            );
        } else {
            self::releseResponse(
                500,
                CJSON::encode(array('errorText' => 'Could not save model.', 'modelErrors' => $model->getErrors()))
            );
        }
    }

    public static function restUpdate($id, $params)
    {
        $model = self::model()->findByPk($id);
        if(!isset($model)) {
            self::releseResponse(
                404,
                CJSON::encode(array('errorText' => 'No Item found with id ' . (int)$id))
            );
            return false;
        }
        $updateList = array();
        foreach($params as $key => $value) {
            if($model->hasAttribute($key)) {
                $model->$key = $value;
                $updateList[] = $key;
            }
        }
        if($model->update(implode(',', $updateList))) {
            self::releseResponse(
                200,
                self::prepareResponse($model)
            );
        } else {
            self::releseResponse(
                500,
                CJSON::encode(array('errorText' => 'Could not save model.', 'modelErrors' => $model->getErrors()))
            );
        }
    }

    public static function restDelete($id)
    {
        $model = self::model()->findByPk($id);
        if(!isset($model)) {
            self::releseResponse(
                404,
                CJSON::encode(array('errorText' => 'No Item found with id ' . (int)$id))
            );
            return false;
        }
        if($model->delete()) {
            self::releseResponse(
                200,
                CJSON::encode(array())
            );
        } else {
            self::releseResponse(
                500,
                CJSON::encode(array('errorText' => 'Could not delete model.'))
            );
        }
    }

    public static function prepareResponse($data)
    {
        if(is_array($data)) {
            $rows = array();
            foreach($data as $model) {
                if(isset($model->attributes)) {
                    $rows[] = $model->attributes;
                } else {
                    $rows[] = $model;
                }
            }
            return CJSON::encode($rows);
        } elseif(isset($data->attributes)) {
            return CJSON::encode($data->attributes);
        }
        return CJSON::encode($data);
    }

    public static function releseResponse($status = 200, $body = '', $content_type = 'text/html')
    {
        $codes = Array(
            200 => 'OK',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            402 => 'Payment Required',
            403 => 'Forbidden',
            404 => 'Not Found',
            500 => 'Internal Server Error',
            501 => 'Not Implemented',
        );

        $statusDescription = isset($codes[$status])? $codes[$status]: '';

        header('HTTP/1.1 ' . $status . ' ' . $statusDescription);
        header('Content-type: ' . $content_type);

        echo $body;
    }
}