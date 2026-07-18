import { SigninForm } from "../components/SigninForm";
import { SignupForm } from "../components/SignupForm";
import { Link } from "react-router";

export function AuthPage() {
  return (
    <div className="bg-[#000000] text-white h-screen justify-center item-center">
      <h1 className="md: text-4xl t">Wecome To Y Social</h1>
      <div className="flex flex-col items-center">
        <h1>Create your account</h1>
        <SigninForm />
      </div>

      <p>
        don't have account?{" "}
        <Link
          to="/auth"
          className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          create account
        </Link>
      </p>
    </div>
  );
}
