'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

return (
  <li>
    <Link
      href={href}
      className={`
        relative rounded-xl p-2
        hover:text-lime-300
        focus:outline-none
        focus-visible:ring-2
        focus:ring-lime-400
        focus:ring-offset-black
        transition-colors duration-300 ease-in-out
        ${isActive ? "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-lime-500" : ""}
      `}
    >
      {children}
    </Link>
  </li>
)
}