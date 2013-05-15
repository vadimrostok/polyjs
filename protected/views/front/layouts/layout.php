<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="icon" type="image/png" href="<?=Yii::app()->baseUrl ?>/favicon.png" />
        <meta name="title" content="<?=$this->pageTitle ?>">
        <meta name="description" content="<?=$this->pageDescription ?>">
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
             * Да, да, Вы можете переключить is_admin в true что бы полюбоваться кнопочками и статусами "ОК"!
             */
            var app = {
                is_admin: false
            };
            var URLS = {
                'base': '<?=$_SERVER['SCRIPT_NAME'] ?>',
                'root': '<?=Yii::app()->baseUrl ?>',
                'picBase': '<?=Yii::app()->baseUrl ?>',
                'bay': '<?=$this->createUrl('controls/bay') ?>'
            };
            var setatusTexts = {
<?php       $allStatusColorClasses = '';
            foreach(Statuses::model()->findAll() as $status) : 
?>
                <?=$status->id ?>: '<?=$status->description ?>',
<?php       endforeach 
?>
            };
            var statusColorClasses = {
<?php       foreach(Statuses::model()->findAll() as $status) : 
            $allStatusColorClasses .= ' ' . $status->color; 
?>
                <?=$status->id; ?>: '<?=$status->color ?>-color',
<?php       endforeach;
?>
                //Параметр all нужен для того чтоб с элемента можно 
                //было убодно снимать любой класс-цвет функцией removeClass.
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
                <h3>Подождите, пожалуйста, пока Я смахиваю пыль с альбомов.</h3>
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
        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-37970064-2', 'poly-js.com');
            ga('send', 'pageview');
        </script>
    </body>
</html>