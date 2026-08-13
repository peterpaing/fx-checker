'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href ? "underline decoration-lime-500 underline-offset-4" : ""

  return (
    <li>
      <Link href={href} className={`${isActive} p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-black"`}>
        {children}
      </Link>
      </li>
  )
}