import Link from "next/link"
import Image from "next/image"


export default function NotFound() {
  return (
    <main className="mt-6 mb-10 flex flex-col items-center justify-center px-6 text-center">
      <Image
        src="/icons/404.png"
        alt="Page not found"
        width={200}
        height={200}
      />

      <h3 className="mt-3 text-base font-semibold">
        Page not found
      </h3>

      <p className="mt-1 max-w-md text-sm text-neutral-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <Link
        href="/"
        className="mt-4 rounded-lg bg-lime-400 px-3 py-2 text-sm
        text-neutral-900 transition-colors duration-300
        hover:bg-lime-600 focus:outline-none focus-visible:ring-2
        focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black"
      >
        BACK TO HOME
      </Link>
    </main>
  )
}