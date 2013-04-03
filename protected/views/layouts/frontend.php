<?php //echo Yii::app()->request->baseUrl; ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="language" content="en" />
		<title><?=CHtml::encode($this->pageTitle); ?></title>
	</head>
	<body>
		<div class="container" id="page">
			<?php echo $content; ?>
		</div>
		<div id="footer">
			<?php echo date('Y'); ?> ! <?=Yii::app()->name ?>
			<br />
			<?=sprintf('%0.5f', Yii::getLogger()->getExecutionTime()) ?> sec.
		</div>
	</body>
</html>
