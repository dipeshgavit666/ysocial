export function SigninForm() {
  return (
    <form className="bg-[#000000] text-white flex flex-col items-center justify-center h-screen space-y-4 p-10">
      <div className="space-y-4 p-10 flex flex-col items-center justify-center h-screen space-y-4 p-10 rounded-lg border border-gray-700">
        <h1>y-social</h1>
        <h2 className="text-4xl">signin form</h2>
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
          SignIn
        </button>
      </div>
    </form>
  );
}
