import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center min-h-screen space-y-4 p-10"
    >
      <div className="space-y-4 p-10 rounded-lg border border-neutral-700">
        <h1 className="text-4xl">Sign Up</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          value={formData.name}
          onChange={handleChange}
          name="name"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-50 placeholder-neutral-500 p-3"
          type="text"
          placeholder="name"
        />

        <input
          value={formData.username}
          onChange={handleChange}
          name="username"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-50 placeholder-neutral-500 p-3"
          type="text"
          placeholder="username"
        />

        <input
          value={formData.email}
          onChange={handleChange}
          name="email"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-50 placeholder-neutral-500 p-3"
          type="text"
          placeholder="email"
        />

        <input
          value={formData.password}
          onChange={handleChange}
          name="password"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-50 placeholder-neutral-500 p-3"
          type="password"
          placeholder="create password"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[#d6d6d6] p-3 text-black disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Sign Up"}
        </button>
      </div>
    </form>
  );
}
