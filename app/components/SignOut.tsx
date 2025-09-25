import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useState } from "react";

import { auth } from "../../firebase";

function SignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    try {
      await signOut(auth);
      setIsSigningOut(true);
      router.push("/");
    } catch {
      console.log("error navigating");
    }
  };
  return (
    <>
      <button
        className="px-20 py-2 md:w-xl text-white bg-red-500 hover:bg-red-700 cursor-pointer rounded-full"
        type="submit"
        onClick={onSubmit}
      >
        {isSigningOut ? "Signing Out" : "Sign Out"}
      </button>
    </>
  );
}

export default SignOut;
