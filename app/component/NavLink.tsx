'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href ? "underline decoration-lime-500 underline-offset-12" : ""

  return (
    <li>
      <Link href={href} className={`${isActive} rounded-xl focus:outline-none focus-visible:ring-2  focus:ring-lime-400 focus:ring-offset-black p-2`}>
        {children}
      </Link>
      </li>
  )
}