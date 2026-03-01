import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert(email+" "+password)
  };
  return (
    <div className="flex mt-[40%] sm:mt-0 md:mt-0 lg:mt-0 items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Welcome back</h1>
        <p className="text-sm text-zinc-400 mb-6">Sign in to continue</p>

        <form onSubmit={(e) => onSubmitForm(e)} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-zinc-800 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-zinc-800 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-2 rounded-lg font-medium"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-zinc-400 mt-6 text-center">
          Don’t have an account?{" "}
          <a href="/sign-up" className="text-indigo-400 hover:text-indigo-300">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
