<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title><?=CHtml::encode($this->pageTitle); ?></title>
        
        <link href="<?=Yii::app()->request->baseUrl ?>/app/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">

        <script data-main="<?=Yii::app()->request->baseUrl ?>/app/threshold" src="<?=Yii::app()->request->baseUrl ?>/app/libs/require.js"></script>
    </head>
    <body>
        <div class="container" id="page">           
            <?php echo $content; ?>
        </div>
        <div id="footer">
            <?=sprintf('%0.5f', Yii::getLogger()->getExecutionTime()) ?> sec.
        </div>
    </body>
</html>