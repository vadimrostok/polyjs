<?php

class m130328_195314_init extends CDbMigration
{
	public function up()
	{
		$this->getDbConnection()
			->createCommand('')
			->execute();
	}

	public function down()
	{
		/*$this->getDbConnection()
			->createCommand('')
			->execute();*/
		echo "m130328_195314_init does not support migration down.\n";
		return false;
	}

	/*
	// Use safeUp/safeDown to do migration with transaction
	public function safeUp()
	{
	}

	public function safeDown()
	{
	}
	*/
}