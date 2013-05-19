<?php

class AdminAuth extends CFormModel
{
    public $username;
    public $password;

    private $_identity;

    public function rules()
    {
        return array(
            array('username, password', 'required'),
            array('password', 'authenticate'),
        );
    }

    public function authenticate($attribute, $params)
    {
        $this->_identity = new AdminIdentity($this->username, $this->password);
        if(!$this->_identity->authenticate()) {
            $this->addError('password', 'Incorrect username or password.');
        }
    }

    public function login()
    {
        if($this->_identity === null) {
            $this->_identity = new AdminIdentity($this->username,$this->password);
            $this->_identity->authenticate();
        } 
        if($this->_identity->errorCode === AdminIdentity::ERROR_NONE) {
            $duration = 3600*24*30; // 30 days
            Yii::app()->user->login($this->_identity, $duration);
            return true;
        } else {
            return false;
        }
    }
}
