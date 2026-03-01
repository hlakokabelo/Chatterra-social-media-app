import { Link } from "react-router";

export default function PageNotFound() {
  return (
    <div className="min-h-screen rounded-2xl min--screen flex flex-col items-center justify-center bg-gray-400 text-black px-6">
      <h1 className="text-8xl font-bold mb-4">404</h1>

      <p className="text-2xl mb-6 text-black text-center max-w-lg">
        oops...
        <br />
        page not found
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition duration-300"
      >
        Return Home
      </Link>
    </div>
  );
}
