import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#000000] text-white flex flex-col items-center justify-center  space-y-4"
    >
      <div className=" space-y-4 p-10 rounded-lg">
        <h1 className="text-4xl">Login</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          value={formData.email}
          onChange={handleChange}
          name="email"
          className="w-full rounded-lg border p-3"
          type="text"
          placeholder="email"
        />

        <input
          value={formData.password}
          onChange={handleChange}
          name="password"
          className="w-full rounded-lg border p-3"
          type="password"
          placeholder="password"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[#d6d6d6] p-3 text-black disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </div>
    </form>
  );
}
