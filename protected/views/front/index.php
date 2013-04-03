<p>Hello world!</p>
<form action="/flekr/front/bay" method="POST" enctype="multipart/form-data">
	<input type="hidden" name="images" />
	<input type="file" name="pictures[]" multiple="multiple" />
	<input type="submit" value="Загрузить"/>
</form>