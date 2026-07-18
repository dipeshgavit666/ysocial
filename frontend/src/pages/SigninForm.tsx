export function SigninForm() {
  return (
    <form className="bg-[#000000] text-white space-y-4 p-10">
      <h1 className="text-4xl">signup form</h1>
      <input
        className="w-full rounded-lg border p-3"
        type="text"
        placeholder="name"
      />
      <input
        className="w-full rounded-lg border p-3"
        type="text"
        placeholder="username"
      />
      <input
        className="w-full rounded-lg border p-3"
        type="text"
        placeholder="email"
      />

      <input
        className="w-full rounded-lg border p-3"
        type="password"
        placeholder="password"
      />

      <button className="w-full rounded-lg bg-blue-600 p-3  text-white">
        SignUp
      </button>
    </form>
  );
}
