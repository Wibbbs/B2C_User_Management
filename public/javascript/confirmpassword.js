function validateForm() {
  var email_valid = false;
  var passwords_match = false;
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var email = document.getElementById('email_input').value

  if ((document.getElementById('password').value == document.getElementById('confirm_password').value) && (document.getElementById('password').value.length != 0)) {
    //document.getElementById('conflabel').style.color = 'green';
    document.getElementById('conflabel').classList.add('is-success')
    document.getElementById('conflabel').classList.remove('is-danger')
    document.getElementById('confirm_password').classList.add('is-success')
    document.getElementById('confirm_password').classList.remove('is-danger')
    document.getElementById('conflabel').innerHTML = 'Passwords Match';
    //document.getElementById('button').disabled = false;
    document.getElementById('password_check_icon').classList.remove('fa-exclamation')
    document.getElementById('password_check_icon').classList.add('fa-check')
    passwords_match = true;
  }
  else {
    //document.getElementById('conflabel').style.color = 'red';
    document.getElementById('conflabel').classList.remove('is-success')
    document.getElementById('conflabel').classList.add('is-danger')
    document.getElementById('confirm_password').classList.remove('is-success')
    document.getElementById('confirm_password').classList.add('is-danger')
    document.getElementById('conflabel').innerHTML = 'Passwords Do Not Match';
    //document.getElementById('button').disabled = true;
    document.getElementById('password_check_icon').classList.add('fa-exclamation')
    document.getElementById('password_check_icon').classList.remove('fa-check')
    passwords_match = false;
  }


  if (re.test(String(email).toLowerCase())){
    document.getElementById('email_label').innerHTML = 'Valid Email Address';
    document.getElementById('email_label').classList.add('is-success')
    document.getElementById('email_label').classList.remove('is-danger')
    document.getElementById('email_input').classList.add('is-success')
    document.getElementById('email_input').classList.remove('is-danger')
    document.getElementById('email_check_icon').classList.remove('fa-exclamation')
    document.getElementById('email_check_icon').classList.add('fa-check')
    email_valid = true;
  }
  else{
    document.getElementById('email_label').innerHTML = 'Invalid Email Address';
    document.getElementById('email_label').classList.remove('is-success')
    document.getElementById('email_label').classList.add('is-danger')
    document.getElementById('email_input').classList.remove('is-success')
    document.getElementById('email_input').classList.add('is-danger')
    document.getElementById('email_check_icon').classList.add('fa-exclamation')
    document.getElementById('email_check_icon').classList.remove('fa-check')
    email_valid = false;
  }

  if (document.getElementById('tenantdropdown').value == ' '){
    document.getElementById('dropdown_warning').classList.add('is-danger')
  }
  else{
    document.getElementById('dropdown_warning').classList.add('is-success')
  }

  if ((email_valid == true) && (passwords_match ==  true)){
    document.getElementById('button').disabled = false;
  }
  else{
    document.getElementById('button').disabled = true;
  }
}