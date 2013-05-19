<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="icon" type="image/png" href="<?=Yii::app()->baseUrl ?>/favicon.png" />
<?php 
    /**
     * В этом файле нарушены отступя для открывающий и закрывающих php тегов 
     * для того, чтобы отступы сохранились при просмотре кода страницы в браузерах.
     */
    if(isset($this->currentPicture)) : 
    $picture = $this->currentPicture;
    $album = $this->currentAlbum;
?>
        <link class="hide" rel="image_src" href="<?=Yii::app()->baseUrl . $picture->client_path . '200_' . $picture->filename ?>"/>
<?php elseif(isset($this->currentAlbum)) :
        //Покажем ссылку на обложку альбома или изображение по данным указанным в GET параметре.
        //(Для соц. сетей, например)
        $album = $this->currentAlbum;
        if(($album->main_picture_id && $picture = Picture::model()->findByPk($album->main_picture_id))
            || $picture = Picture::model()->find('`album_id`=:aid AND `status_id`=:sts', array(':aid' => $album->id, ':sts' => Statuses::OK))) 
        {
            $src = Yii::app()->baseUrl . $picture->client_path . '200_' . $picture->filename;
            //Точно такой файл существует? Лучше подстраховаться, иначе будет хуже чем ничего.
            if(!is_file(YiiBase::getPathOfAlias('webroot') . $picture->client_path . '200_' . $picture->filename)) {
                $src = Yii::app()->baseUrl . '/iconPicture.png';
            }
        } else {
            $src = Yii::app()->baseUrl . '/iconPicture.png';
        }
?>
        <link class="hide" rel="image_src" href="<?=$src ?>"/>
<?php else : ?>
        <link class="hide" rel="image_src" href="<?=Yii::app()->baseUrl . '/iconPicture.png' ?>"/>
<?php endif ?>
        <meta name="title" content='<?=$this->pageTitle ?>' />
        <meta name="description" content='<?=$this->pageDescription ?>' />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!-- Буков не много, пущай будет en -->
        <meta name="language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title><?=CHtml::encode($this->pageTitle); ?></title>
        
        <link href="<?=Yii::app()->request->baseUrl ?>/app/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen" />

        <link rel="stylesheet/less" type="text/css" href="<?=Yii::app()->request->baseUrl ?>/app/style/main.less?002" />
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
            //На фронте statusColorClasses не нужны.
            var statusColorClasses = {all: ''};
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