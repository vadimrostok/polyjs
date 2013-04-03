<?php
$this->pageTitle = 'Error ' . $code;
$this->breadcrumbs = array(
	'Error',
);
?>

<h2>Error <?php echo $code; ?></h2>

<div class="error">
	<?=CHtml::encode($message); ?>
</div>