<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title><?=CHtml::encode($this->pageTitle); ?></title>
        
        <link href="<?=Yii::app()->request->baseUrl ?>/app/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen" />

        <link rel="stylesheet/less" type="text/css" href="<?=Yii::app()->request->baseUrl ?>/app/libs/less/data/main.less?<?=microtime() ?>" />
        <script src="<?=Yii::app()->request->baseUrl ?>/app/libs/less/less.js"></script>

        <script data-main="<?=Yii::app()->request->baseUrl ?>/app/frontEnd" src="<?=Yii::app()->request->baseUrl ?>/app/libs/require/require.js"></script>

        <script type="text/javascript">
            /*
             * Да, да, Вы можете переключить admin в true, что бы полюбоваться кнопочками и статусами "ОК"!
             */
            var app = {
                is_admin: false
            };
            var URLS = {
                'base': '<?=$_SERVER['SCRIPT_NAME'] ?>',
                'picBase': '<?=Yii::app()->baseUrl ?>',
                'bay': '<?=$this->createUrl('controls/bay') ?>'
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
            window.progressBar = function(prc) {
                document.getElementById('mainProgressBar').style.width = prc + '%';
            }
        </script>

    </head>
    <body>
        <div class="container" id="page">
            <div class="loading">
                <h1>Загрузка ♫♪</h1>
                <h3>Подождите пожалуйста, Я экономлю на хостинге.</h3>
                <div class="progress progress-striped active">
                    <div class="bar" id="mainProgressBar" style="width: 0%;"></div>
                </div>
            </div>
            <?php echo $content; ?>
        </div>
        <div class="container footer">
            <h2>2013</h2>
            <h2 style="display: inline;">✎</h2> to <a href="mailto:vadimrostok@gmail.com">vadimrostok@gmail.com</a>
        </div>
    </body>
</html>