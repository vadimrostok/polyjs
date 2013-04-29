<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title><?=CHtml::encode($this->pageTitle); ?></title>
        
        <link href="<?=Yii::app()->request->baseUrl ?>/app/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">

        <link rel="stylesheet/less" type="text/css" href="<?=Yii::app()->request->baseUrl ?>/app/libs/less/data/main.less?<?=microtime() ?>">
        <script src="<?=Yii::app()->request->baseUrl ?>/app/libs/less/less.js"></script>

        <?php if(defined('UNIT_TEST')) : ?>
            <link rel="stylesheet" type="text/css" href="<?=Yii::app()->request->baseUrl ?>/app/test/lib/jasmine/jasmine.css">
            <script data-main="<?=Yii::app()->request->baseUrl ?>/app/test/threshold" src="<?=Yii::app()->request->baseUrl ?>/app/libs/require/require.js"></script>
            <style type="text/css">
                #HTMLReporter {
                    margin: 10px;
                    background-color: #eeeeee !important;
                }
                body {
                    background-color: #fff !important;
                }
            </style>
        <?php else : ?>
            <script data-main="<?=Yii::app()->request->baseUrl ?>/app/threshold" src="<?=Yii::app()->request->baseUrl ?>/app/libs/require/require.js"></script>
        <?php endif ?>

        <script type="text/javascript">
            var app = {
                is_admin: true
            };
            var URLS = {
                'base': '<?=$_SERVER['SCRIPT_NAME'] ?>',
                'picBase': '<?=Yii::app()->baseUrl ?>'
            };
            var setatusTexts = {
                <?php foreach(Statuses::model()->findAll() as $status) : ?>
                    <?=$status->id ?>: '<?=$status->description ?>',
                <?php endforeach ?>
            };
            <?php 
            $allStatusColorClasses = '';
            ?>
            var statusColorClasses = {
                <?php foreach(Statuses::model()->findAll() as $status) : ?>
                    <?=$status->id ?>: '<?=$status->color ?>-color',
                    <?php 
                    $allStatusColorClasses .= ' ' . $status->color;
                    ?>
                <?php endforeach ?>
                all: '<?=$allStatusColorClasses ?>'
            };
        </script>

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