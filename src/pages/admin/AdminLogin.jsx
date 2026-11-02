import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminLogin } from "../../api/admin";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.username.trim() || !form.password) {
      toast.error("Please enter your username and password");
      return;
    }

    try {
      setLoading(true);

      await adminLogin(form.username.trim(), form.password);

      toast.success("Welcome back!");

      navigate("/admin", { replace: true });
    } catch (error) {
      toast.error(
        error.message === "invalid_credentials"
          ? "Invalid username or password"
          : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f2ead9] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-2 text-3xl font-bold text-[#1b4d3e]">Admin Login</h1>

        <p className="mb-8 text-gray-500">
          Sign in to manage your Raheeq store.
        </p>

        <div className="mb-5">
          <label className="mb-2 block font-medium text-gray-700">
            Username
          </label>

          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#1b9c85]"
            placeholder="Enter username"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#1b9c85]"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#1b4d3e] py-3 font-semibold text-white transition hover:bg-[#1b9c85] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
