function appleLogin() {
  const provider = new firebase.auth.OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log("Apple Login Success:", user);
      alert("Welcome " + user.displayName);
    })
    .catch((error) => {
      console.error("Apple Login Error:", error);
      alert("Apple Sign-In failed: " + error.message);
    });
}
