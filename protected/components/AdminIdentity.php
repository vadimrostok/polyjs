<?php

class AdminIdentity extends CUserIdentity
{
	public function authenticate()
	{
		$users = array(
			// username => password
			'z20112'=>'js-p-fgnb',
		);
		if(!isset($users[$this->username])) {
			$this->errorCode = self::ERROR_USERNAME_INVALID;
		} elseif($users[$this->username] !== $this->password) {
			$this->errorCode = self::ERROR_PASSWORD_INVALID;
		} else {
			$this->errorCode = self::ERROR_NONE;
		}
		return !$this->errorCode;
	}
}