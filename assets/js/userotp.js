// // Function to generate and send OTP (simulate sending OTP)
// function sendOTP(email) {
//     // Simulate sending OTP to the user's email (Replace this with your actual OTP sending logic)
//     // For demonstration purposes, let's generate a random 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);
  
//     // Display OTP in console (For demonstration purposes)
//     console.log('OTP:', otp);
  
//     // Return the generated OTP
//     return otp;
//   }
  
//   // Event listener for "Get OTP" button
//   document.getElementById('getOTPButton').addEventListener('click', function() {
//     // Get email from the input field
//     const userEmail = document.getElementById('emailInput').value;
  
//     // Call function to send OTP (Replace with actual OTP sending logic)
//     const generatedOTP = sendOTP(userEmail);
  
//     // Show the OTP modal
//     const otpModal = new bootstrap.Modal(document.getElementById('otpModal'));
//     otpModal.show();
  
//     // Event listener for "Confirm" OTP button
//     document.getElementById('confirmOTPButton').addEventListener('click', function() {
//       const enteredOTP = document.getElementById('otpInput').value;
  
//       // Check if entered OTP matches the generated OTP
//       if (enteredOTP == generatedOTP) {
//         alert('OTP Verified! Registration Successful.');
//         // Perform registration or further actions here after successful OTP verification
//       } else {
//         alert('Incorrect OTP! Please try again.');
//         // Optionally, handle incorrect OTP scenario here
//       }
//     });
//   });
  