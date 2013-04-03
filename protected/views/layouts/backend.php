<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="language" content="en" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<title><?=CHtml::encode($this->pageTitle); ?></title>
	    
	    <link href="<?=Yii::app()->request->baseUrl ?>/js/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
		
		<script src="<?=Yii::app()->request->baseUrl ?>/js/jquery.js"></script>
		<script src="<?=Yii::app()->request->baseUrl ?>/js/bootstrap/js/bootstrap.min.js"></script>
	</head>
	<body>
		<div class="container" id="page">
			<div class="container-fluid">
				<div class="row-fluid">
					<div class="span2">
					<!--Sidebar content-->
					</div>
					<div class="span10">
						<h1>Hello, world!</h1>
					</div>
				</div>
			</div>
			
			<?php echo $content; ?>
		</div>
		<div id="footer">
			<?=sprintf('%0.5f', Yii::getLogger()->getExecutionTime()) ?> sec.
		</div>
	</body>
</html>