<h1>Admin login</h1>

<form id="auth-form" action="<?=$this->createUrl('controls/auth') ?>" method="post">
    <fieldset>
        <input class="" name="AdminAuth[username]" id="AdminAuth_username" type="text"/>
        <label class="text-error"></label>
        <input class="" name="AdminAuth[password]" id="AdminAuth_password" type="password"/>
        <label class="text-error"></label>
        <input class="btn btn-primary" type="submit" value="Login" />
    </fieldset>
</form>