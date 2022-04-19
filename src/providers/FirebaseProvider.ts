import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import { firebaseConfig } from "../config/firebaseConfig";

const provider = new TwitterAuthProvider();

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const logout = async () => {
  return auth.signOut();
};
export const signInViaTwitter = async () => {
  const result = await signInWithPopup(auth, provider);
  const credential = TwitterAuthProvider.credentialFromResult(result);
  if (!credential) throw new Error();
  const token = credential.accessToken;
  const secret = credential.secret;
  const user = result.user;
  console.log({ token, secret, user });
};
