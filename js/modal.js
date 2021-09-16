const MODAL_CONTENT = {
    save_success: {
        icon: 'success',
        title: 'Saved!',
        text: 'Your data/change have been saved'
    },
    save_error: {
        icon: 'error',
        title: 'Changes are not saved!',
        text: 'Please check your request and try again'
    },
    delete_success: {
        icon: 'success',
        title: 'Deleted!',
        text: 'Your data/change have been saved'
    },
    delete_error: {
        icon: 'error',
        title: 'Changes are not saved!',
        text: 'Please check your request and try again'
    },
    get_error: {
        icon: 'error',
        title: 'Can not get your data!',
        text: 'Please check your request and try again'
    },
    get_success: {
        icon: 'success',
        title: 'Get data succeed!',
        text: 'Ok! Now your data available to use'
    },
    upload_error: {
        icon: 'error',
        title: 'Upload failed!',
        text: 'There is a problem uploading your image! Please try again'
    },
    upload_success: {
        icon: 'success',
        title: 'Upload succeed!',
        text: 'Your file have been uploaded! :D'
    },
    confirm_delete_dialog: {
        icon: 'warning',
        title: 'Are you sure?',
        text: "You won't be able to revert this!"
    },
    exist_mail_error: {
        icon: 'info',
        title: 'This email already in use!',
        text: 'Please sign up with another email address or try to login!'
    },
    verify_email: {
        icon: 'info',
        title: 'Please check your mail!',
        text: 'We had seen you a mail, please go to your mail and check it!'
    },
    redirect_create_user_success:{
        icon: 'success',
        title: 'Yay, your account has been created',
        html: 'We will direct you to home page in next <b></b>s.',
        timer: 5,
        url: './index.html'
    },
    create_user_failed:{
        icon: 'error',
        title: 'Create account failed!',
        text: "It's something went wrong, please check the console log in your browser"
    },
    redirect_permission:{
        icon: 'warning',
        title: "You don't have permission to access this page!",
        html: 'We will direct you to another page in next <b></b>s.',
        timer: 5,
        url: './login.html'
    },
    redirect_valid_email:{
        icon: 'warning',
        title: "Invalid email!",
        html: 'We will direct you to another page in next <b></b>s.',
        timer: 5,
        url: './login.html'
    }
}

export function swalAlert(modal) {
    Swal.fire({
        icon: modal.icon,
        title: modal.title,
        text: modal.text,
        confirmButtonText: 'OK'
    })
}

export function singleAlert(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        confirmButtonText: 'OK'
    })
}

export function confirmAlert(myFunc, modal) {
    Swal.fire({
        title: modal.title,
        text: modal.text,
        icon: modal.icon,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            myFunc();
        }
    })
}

export function redirectAlert(modal){
    let timerInterval
    Swal.fire({
      title: modal.title,
      html: modal.html,
      icon: modal.icon,
      timer: modal.timer * 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b');
        b.textContent = modal.timer;
        timerInterval = setInterval(() => {
            modal.timer--;
          b.textContent = modal.timer;
        }, 1000)
      },
      willClose: () => {
        clearInterval(timerInterval);
        window.location.replace(modal.url);
      }
    })
    // .then((result) => {
    //   /* Read more about handling dismissals below */
    //   if (result.dismiss === Swal.DismissReason.timer) {
    //     console.log('I was closed by the timer')
    //   }
    // })
}

export default {MODAL_CONTENT}

