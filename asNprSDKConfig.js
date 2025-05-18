// =========================
// Firebase SDK Config Area
// =========================

// ✅ আপনার Firebase Console থেকে কপি করা Config বসান এখানে
const firebaseConfig = {
  apiKey: "AIzaSyCDLjkm_kIQDZoKHm7w4vh_W__kZE4aoME",
  authDomain: "authentication-93bb7.firebaseapp.com",
  projectId: "authentication-93bb7",
  storageBucket: "authentication-93bb7.appspot.com", // ✅ ".appspot.com" ঠিক করা হয়েছে
  messagingSenderId: "430166080842",
  appId: "1:430166080842:web:b5f2ce18ade5f01daad5b3"
};

// ✅ Firebase শুরু করুন (v8 CDN ব্যবহৃত হলে firebase global object এর মাধ্যমে)
const app = firebase.initializeApp(firebaseConfig); // 🔹 Firebase App init
const auth = firebase.auth(); // 🔹 Firebase Authentication init

// =========================
// Start SignUp JS Function
// =========================

// 🔹 ফর্ম সিলেক্ট করুন (class: registration-form)
const form = document.querySelector(".registration-form");

// 🔹 ফর্ম সাবমিট ইভেন্ট হ্যান্ডলার
form.addEventListener("submit", function (e) {
  e.preventDefault(); // 🔸 রিফ্রেশ থামান

  // 🔹 ইনপুট ভ্যালুগুলো সংগ্রহ করুন
  const firstName = document.getElementById("user-firstname").value.trim();
  const lastName = document.getElementById("user-lastname").value.trim();
  const email = document.getElementById("user-email").value.trim();
  const password = document.getElementById("user-password").value;
  const confirmPassword = document.getElementById("user-confirm-password").value;

  // 🔸 পাসওয়ার্ড মিল আছে কি না চেক করুন
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  // 🔹 Firebase Authentication দিয়ে ইউজার তৈরি করুন
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // 🔹 ইউজারের নাম আপডেট করুন (অপশনাল)
      user.updateProfile({
        displayName: `${firstName} ${lastName}`
      }).then(() => {
        // সফলভাবে নাম আপডেট হয়েছে
        alert("Account created successfully for " + user.email);
        form.reset(); // ফর্ম রিসেট করুন
      }).catch((error) => {
        // নাম আপডেটে এরর হলে এখানে ধরা হবে
        console.error("Profile update error:", error);
        alert("Account created, but failed to update profile.");
      });
    })
    .catch((error) => {
      // 🔸 ইউজার তৈরি করতে সমস্যা হলে
      alert("Error: " + error.message);
    });
});

// =========================
// Show/Hide Password Function
// =========================

// 🔹 পাসওয়ার্ড শো/হাইড করার ফাংশন (টগল)
function togglePassword(fieldId, toggleEl) {
  const field = document.getElementById(fieldId);
  if (field.type === "password") {
    field.type = "text"; // দেখান
    toggleEl.innerText = "Hide";
  } else {
    field.type = "password"; // লুকান
    toggleEl.innerText = "Show";
  }
}
