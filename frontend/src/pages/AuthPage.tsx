import { LoginForm } from "../components/LoginForm";

export function AuthPage() {
  return (
    <div className="bg-[#000000] text-white  justify-center item-center">
      <div className="flex flex-col items-center">
        <LoginForm />
      </div>
    </div>
  );
}
