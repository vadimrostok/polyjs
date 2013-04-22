<?php

class AdminIdentity extends CUserIdentity
{
    public function authenticate()
    {
        $db = Yii::app()->db;
        $user = $db->createCommand('SELECT * FROM `admin` WHERE `login`=:username')
            ->bindParam(':username', $this->username)
            ->query()
            ->read();
        if(!isset($user)) {
            $this->errorCode = self::ERROR_USERNAME_INVALID;
        } elseif(md5($user['salt'] . $this->password) !== $user['password']) {
            $this->errorCode = self::ERROR_PASSWORD_INVALID;
        } else {
            $this->errorCode = self::ERROR_NONE;
        }
        return !$this->errorCode;
    }
}