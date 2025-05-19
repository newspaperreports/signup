// =========================
// Firebase SDK কনফিগারেশন এরিয়া
// =========================

// ✅ Firebase কনসোল থেকে আপনার প্রকৃত কনফিগারেশন দিয়ে রিপ্লেস করুন
const firebaseConfig = {
  apiKey: "AIzaSyCDLjkm_kIQDZoKHm7w4vh_W__kZE4aoME",
  authDomain: "authentication-93bb7.firebaseapp.com",
  databaseURL: "https://authentication-93bb7-default-rtdb.firebaseio.com",
  projectId: "authentication-93bb7",
  storageBucket: "authentication-93bb7.appspot.com",
  messagingSenderId: "430166080842",
  appId: "1:430166080842:web:b5f2ce18ade5f01daad5b3"
};

// =========================
// DOMContentLoaded ইভেন্টে কোড চালু করা হবে
// =========================
document.addEventListener("DOMContentLoaded", function () {
  // ✅ Firebase ইনিশিয়ালাইজেশন
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();  // অথেন্টিকেশন সার্ভিস
  const db = firebase.database(); // রিয়েলটাইম ডাটাবেস

  // =========================
  // সাইন-আপ ফর্ম সিলেকশন
  // =========================
  const form = document.querySelector(".registration-form");

  // ✅ ফর্ম এলিমেন্ট না পাওয়ার ক্ষেত্রে কোড বন্ধ করবেন
  if (!form) {
    console.error("Form element not found.: .registration-form");
    return;
  }

  // =========================
  // সাইন-আপ ফাংশনালিটি
  // =========================
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // ফর্ম ডাটা সংগ্রহ
    const firstName = document.getElementById("user-firstname").value.trim();
    const lastName = document.getElementById("user-lastname").value.trim();
    const email = document.getElementById("user-email").value.trim();
    const password = document.getElementById("user-password").value;
    const confirmPassword = document.getElementById("user-confirm-password").value;
    const phone = document.getElementById("user-phone").value.trim();
    const gender = document.getElementById("user-gender").value;
    const address = document.getElementById("user-address").value.trim();

    // ✅ ১: পাসওয়ার্ড শক্তি চেক
    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    // ✅ ২: পাসওয়ার্ড ম্যাচিং
    if (password !== confirmPassword) {
      alert("Password not found!");
      return;
    }

    // ✅ ৩: আন্তর্জাতিক ফোন নম্বর ভ্যালিডেশন (যেকোন দেশের জন্য)
    const phoneRegex = /^\+?\d{8,15}$/;
    if (phone && !phoneRegex.test(phone)) {
      alert("Enter a valid phone number (8 to 15 digits, including + if in international format)");
      return;
    }

    // ✅ Firebase অথেন্টিকেশন (ইমেইল + পাসওয়ার্ড)
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // ✅ ৪: ইমেইল ভেরিফিকেশন পাঠানো
        user.sendEmailVerification().then(() => {
          console.log("Verification email sent.");
        });

        // ✅ ৫: ইউজার প্রোফাইল আপডেট (ডিসপ্লে নেম)
        return user.updateProfile({
          displayName: `${firstName} ${lastName}`
        }).then(() => user); // পরবর্তী .then() এ user পাঠাতে return করতে হবে
      })
      .then((user) => {
        // ✅ ৬: ডাটাবেসে ইউজারের তথ্য সংরক্ষণ
        return db.ref('users/' + user.uid).set({
          uid: user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          gender: gender,
          address: address,
          createdAt: firebase.database.ServerValue.TIMESTAMP
        });
      })
      .then(() => {
        // ✅ ৭: সাফল্য বার্তা ও রিডাইরেকশন
        alert("Welcome ! Activated your account.");
        form.reset();
        window.location.href = "https://newspaperreports.github.io/login/";
      })
      .catch((error) => {
        // ✅ ৮: ইউজার ফ্রেন্ডলি এরর মেসেজ
        let errorMessage = "An error occurred!";
        if (error.code === "auth/email-already-in-use") {
          errorMessage = "This email is already in use.";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Make the password stronger";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "The email address is incorrect.";
        }
        alert(errorMessage);
      });
  });

  // =========================
  // পাসওয়ার্ড টগল ফাংশন
  // =========================
  window.togglePassword = function (fieldId, toggleEl) {
    const field = document.getElementById(fieldId);
    if (field.type === "password") {
      field.type = "text";
      toggleEl.innerText = "Hide";
    } else {
      field.type = "password";
      toggleEl.innerText = "Show";
    }
  };
});
