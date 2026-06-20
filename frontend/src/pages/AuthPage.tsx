import { SignupForm } from "./SignupForm"

export function AuthPage() {
    return(
        <div className="bg-[#000000] h-screen justify-center item-center">
            <h1 className="md: text-4xl t">Wecome To Y Social</h1>
            <div className="flex flex-col items-center">
                <h1>Create your account</h1>
                <SignupForm />
            </div>
            
            {/* <p>alredy have an account the click here</p> */}
             
        </div>
    )
}