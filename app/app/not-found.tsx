import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#faf9f7] to-white px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page not found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <Link
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}