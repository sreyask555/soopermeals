// OTP Buttons
const sendOtpBtn = document.querySelector('#otp-send-btn');
const cancelOtpBtn = document.querySelector('#otp-cancel-btn');
const submitOtpBtn = document.querySelector('#otp-submit-btn');

const timer = document.querySelector('#timer');
let reset = false;
// sendOtpBtn.addEventListener('click', signupEnabler.bind(null, 59)); //binding because, direct passing will auto-run function at starting.

// Input Fields
const name = document.querySelector('#nameInput')
const number = document.querySelector('#numberInput')
const email = document.querySelector('#emailInput')
const password1 = document.querySelector('#passwordInput1')
const password2 = document.querySelector('#passwordInput2')

// Toaster
function toastIt(entry){
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: `Invalid ${entry}`
      });
      return false;
}

// Form Validation
sendOtpBtn.addEventListener('click', validateForm);
function validateForm(){
    $("#signup-form").submit(function(event){
        event.preventDefault();
    })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*[@$!%*?&])(?=.*\d).{3,}$/;
    if(name.value.trim() === ''){
        return toastIt('name');
    }
    else if(isNaN(number.value.trim()) || number.value.trim().length !== 10){
        return toastIt('mobile number digits (Use 10 digits)');
    }
    else if(!emailRegex.test(email.value.trim())){
        return toastIt('email type');
    }
    else if(!passwordRegex.test(password1.value.trim())){
        return toastIt('password length (Password must contain atleast an albhabet, one special character and a number)')
    }
    else if(password1.value.trim() !== password2.value.trim()){
        return toastIt('matching of passwords (Both passwords should match)')
    }
    else{
        // sendOtpBtn.dataset.bsToggle = "modal";
        // sendOtpBtn.dataset.bsTarget = "#staticBackdrop";
        $("#staticBackdrop").modal('show');
        reset = false;
        signupEnabler(59);
    }
}

// Resetting OTP timer and otp submit button disability
cancelOtpBtn.addEventListener('click', () => {
    // sendOtpBtn.dataset.bsToggle = "";
    // sendOtpBtn.dataset.bsTarget = "";

    submitOtpBtn.classList.remove('disabled');

    reset = true;
    timer.textContent = '';
})

// Start OTP Timer and styling
function startOtpRunner(seconds){
    if(timer.textContent == 'OTP expired' || timer.textContent == ''){
            let countdown = setInterval(()=>{
                if(reset){
                    clearInterval(countdown);
                    return;
                }
                timer.classList.remove('text-danger');
                timer.textContent = `Time Remaining : ${seconds} seconds`;
                if(seconds <= 0){
                    clearInterval(countdown);
                    timer.textContent = 'OTP expired';
                    timer.classList.add('text-danger')
                    submitOtpBtn.classList.add('disabled');
                }
                else{
                    seconds--;
                }
        }, 1000)
    }
}


// Input field fetching and otp enabling
function signupEnabler(seconds){
    // Fetch API
    fetch('http://localhost:3000/fetchAPI', {
        method : 'POST',
        redirect : 'follow',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            name : name.value,
            number : number.value,
            email : email.value,
            password : password1.value
        })
    }).then((res) => {
        if(res.redirected){
            Swal.fire({
                icon: "error",
                title: "User already registered",
                text : 'Please Login to Continue..',
                showConfirmButton: false,
                footer: `<a href="${res.url}">Continue to Login Page</a>`,
                allowOutsideClick : false,
                allowEscapeKey : false,
                // backdrop: `rgba(22,27,34, 0.8)`
            });
            // Hiding Otp modal, if redirecting
            const otpModal = document.querySelector('#staticBackdrop');
            otpModal.addEventListener('shown.bs.modal', () => {
                $("#staticBackdrop").modal('hide');
            })
        }
    }).catch((err) => console.info(err));
    //.then((res) => res.json()).then((data) => console.log(data)).catch(err => console.info(err)) //(for displaying data fetched at backend in frontend console-chrome)
    startOtpRunner(seconds);
}