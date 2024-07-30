"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "@/firebase";
import NotePage from "./components/NotePage";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", (error as Error).message);
    }
  };

  return (
    <div>
      {!user ? (
        <section className="flex items-center justify-center bg-background h-[100vh]">
          <div className="relative w-full px-5 py-12 mx-auto max-w-7xl lg:px-16 md:px-12">
            <div className="max-w-3xl mx-auto text-center">
              <div>
                <span className="w-auto px-6 py-3 rounded-full bg-secondary">
                  <span className="text-sm font-medium text-primary">
                    Sort Your Notes Easily
                  </span>
                </span>
                <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-6xl">
                  Create Notes with Ease
                </h1>
                <p className="max-w-xl mx-auto mt-8 text-base text-secondary-foreground lg:text-xl">
                  Effortlessly create and organize notes to maintain clarity in
                  your thoughts and track ideas for improved productivity.
                </p>
              </div>
              <div className="flex justify-center max-w-sm mx-auto mt-10">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  Sign Up for Free
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <NotePage />
      )}
    </div>
  );
}
