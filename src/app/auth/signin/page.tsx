import { SignInForm } from "@/components/signin/signin-form";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center">
        <SignInForm />
    </div>
  );
}