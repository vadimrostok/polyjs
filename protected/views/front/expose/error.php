<?php
$this->pageTitle = 'Error ' . $code;
$this->breadcrumbs = array(
	'Error',
);
?>
<div id="error_info">
    <h2>Error <?php echo $code; ?></h2>

    <div class="error">
    	<?=CHtml::encode($message); ?>
    </div>
</div>
<script>
setTimeout(function() {
    $('#error_info').hide();
}, 5000)
</script>