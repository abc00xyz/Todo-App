// firebase.d.ts
declare module "@/firebase" {
  import type { FirebaseApp } from "firebase/app";
  import type { Auth } from "firebase/auth";
  import type { Analytics } from "firebase/analytics";
  import type { Storage } from "firebase/storage";

  export const app: FirebaseApp;
  export const analytics: Analytics;
  export const auth: Auth;
  export const storage: Storage;
}
