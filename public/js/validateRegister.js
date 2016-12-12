function validateForm()
{
	var passwrd = document.forms["register"]["password"].value;
    var confirmp = document.forms["register"]["confirm"].value;
	debugger;
    if (confirmp=="" || confirmp==null) { 
	   alert("Please confirm your password!");
	   return false;
	} else {
		debugger;
        if(passwrd != confirmp){
			alert("Passwords do not match! Try again!");
			return false;
		}
    }
}