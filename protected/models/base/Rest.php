<?php
//TODO: Перевести в DAO!

//У модели может быть поле protected_from_client_attributes, в котором будут
//перечислены поля, которые не надо изметь через REST. Дело в том, что Backbone 
//отправляет на сервер всю модель, некоторые поля изменяются на фронте 
//для удобства отображения, в БД их изменять не нужно.

class Rest
{    
    public static function _list($model)
    {
        $data = $model->findAll();
        self::releseResponse(
            200,
            self::prepareResponse($data)
        );
    }

    public static function view($model)
    {
        if(isset($model)) {
            self::releseResponse(
                200,
                self::prepareResponse($model)
            );
        } else {
            self::releseResponse(
                404,
                CJSON::encode(array('errorText' => 'No Item was found with id ' . (int)$id))
            );
        }
    }

    public static function create($classInstance, $params)
    {
        foreach($params as $key => $value) {
            if($classInstance->hasAttribute($key)) {
                $classInstance->$key = $value;
            }
        }
        if($classInstance->save()) {
            self::releseResponse(
                200,
                self::prepareResponse($classInstance)
            );
        } else {
            self::releseResponse(
                500,
                CJSON::encode(array('errorText' => 'Could not save model.', 'modelErrors' => $classInstance->getErrors()))
            );
        }
    }

    public static function update($model, $params, $protected_attributes = array())
    {
        if(isset($model->protected_from_client_attributes)) {
            $protected_attributes = $model->protected_from_client_attributes;
        }
        if(!isset($model)) {
            self::releseResponse(
                404,
                CJSON::encode(array('errorText' => 'No Item was found with id ' . (int)$id))
            );
            return false;
        }
        $updateList = array();
        foreach($params as $key => $value) {
            if($model->hasAttribute($key)) {
                if(!in_array($key, $protected_attributes) && $model->$key != $value) {
                    $updateList[] = $key;
                    $model->$key = $value;
                }
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

    public static function delete($model)
    {
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

    public static function prepareResponse($data, $json_attributes = array())
    {
        if(is_array($data)) {
            $rows = array();
            foreach($data as $key => $model) {
                if(isset($model->attributes)) {
                    if(isset($model->json_attributes)) {
                        $json_attributes = $model->json_attributes;
                    }
                    if(count($json_attributes) > 0) {
                        foreach($model->attributes as $key => $value) {
                            if(in_array($key, $json_attributes)) {
                                $model->attributes[$key] = CJSON::encode($value);
                            }
                        }
                    }
                    $rows[] = $model->attributes;
                } else {
                    if(in_array($key, $json_attributes)) {
                        $rows[] = CJSON::encode($model);
                    } else {
                        $rows[] = $model;
                    }
                    
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
        $codes = array(
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