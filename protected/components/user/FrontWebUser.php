<?php

class FrontWebUser extends CWebUser {
	public function isOwner() {
		if(!Yii::app()->user->isGuest && false) {
			return true;
		}
		return false;
	}
}