"use client";
import { useState, useEffect } from "react"; // Import useEffect
import Link from "next/link";
import { ModeToggle } from "./Modetoogle";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "@/firebase";
import { User } from "firebase/auth"; // Import User type

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null); // Explicitly specify type as User | null

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      setUser(currentUser);
    } catch (error) {
      console.error("Error signing in with Google:", (error as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      setUser(null);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", (error as Error).message);
    }
  };

  return (
    <nav className="border-b bg-background h-[10vh] flex items-center fixed top-0 left-0 right-0 z-50">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            ToDo<span className="text-primary">App</span>
          </h1>
        </Link>

        <div className="flex items-center ml-3 gap-2 sm:gap-5 pr-4 m-0">
          <ModeToggle />
          <div className="flex items-center sm:gap-5">
            {user ? (
              <Button
                variant="secondary"
                className="flex items-center justify-end gap-2 px-3 py-2 sm:px-4 sm:py-2 sm:gap-3 text-sm sm:text-base w-full sm:w-auto"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 sm:gap-3 text-sm sm:text-base w-full sm:w-auto"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle className="text-lg sm:text-xl" />
                <span className="hidden sm:inline">Google Connect</span>
                <span className="sm:hidden">Google</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
