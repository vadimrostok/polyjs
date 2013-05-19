<?php
class PictureExtensions extends CFormModel
{
    const JPG = 1;
    const PNG = 2;
    const GIF = 3;

    protected static $extIdRelation = array(
        'jpg' => self::JPG,
        'jpeg' => self::JPG,
        'png' => self::PNG,
        'gif' => self::GIF
    );

    public static function getTypeId($ext) {
        return self::$extIdRelation[$ext];
    }
}