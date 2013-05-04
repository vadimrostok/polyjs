<?php

class BackWebUser extends CWebUser {
	public function isAdmin() {
		return !Yii::app()->user->isGuest;
	}
	public function isOwner() {
		return !Yii::app()->user->isGuest;
	}
}