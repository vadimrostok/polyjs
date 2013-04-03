<h1>Admin login</h1>

<div class="">
	<?php 
	$params = array(
		'id'=>'auth-form',
		'enableAjaxValidation' => true,
	);
	$form = $this->beginWidget('CActiveForm', $params);
	?>

	<div class="">
		<?=$form->labelEx($model, 'username'); ?>
		<?=$form->textField($model, 'username'); ?>
		<?=$form->error($model, 'username'); ?>
	</div>

	<div class="">
		<?=$form->labelEx(		$model, 'password'); ?>
		<?=$form->passwordField($model, 'password'); ?>
		<?=$form->error(		$model, 'password'); ?>
	</div>

	<div class="">
		<?=CHtml::submitButton('Login'); ?>
	</div>

	<?php $this->endWidget(); ?>
</div>