$("#signup").submit(function(event){
validateMyForm;
});

var passwordField = document.getElementById('password')
var passwordConfirmField = document.getElementById('password_Conf')
var form = document.getElementById('signup')
var adminKeyField = document.getElementById('adminkey')
var adminKey = "TeacherKey1469"
function validateMyForm() {
    if (passwordField.value != passwordConfirmField.value) {
        alert("Passwords do not match. Please try again.");
    }else {
        form.submit()
    }
};