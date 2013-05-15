<?php if(isset($picture)) : ?>
    <link class="hide" rel="image_src" href="<?=Yii::app()->baseUrl . $picture->client_path . '200_' . $picture->filename ?>"/>
<?php elseif(isset($album)) : ?>
    <?php 
    if(($album->main_picture_id && $picture = Picture::model()->findByPk($album->main_picture_id))
        || $picture = Picture::model()->find('`album_id`=:aid AND `status_id`=:sts', array(':aid' => $album->id, ':sts' => Statuses::OK))) {
        $src = Yii::app()->baseUrl . $picture->client_path . '200_' . $picture->filename;
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