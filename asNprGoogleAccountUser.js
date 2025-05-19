function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        const user = result.user;

        // 👉 ডাটাবেসে ইউজার ইনফো সংরক্ষণ (আপনি চাইলে এটা বাদ দিতে পারেন)
        firebase.database().ref('users/' + user.uid).set({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          provider: "google",
          createdAt: firebase.database.ServerValue.TIMESTAMP
        });

        alert("Welcome, " + user.displayName);
        window.location.href = "http://newspaperreports.com"; // ✅ রিডাইরেক্ট URL
      })
      .catch((error) => {
        console.error("Google Login error:", error);
        alert("Google Login failed: " + error.message);
      });
  }