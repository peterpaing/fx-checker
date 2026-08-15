"use client"

import { MdArrowDropDown } from "react-icons/md"
import { usePathname, useRouter } from "next/navigation"
import { useExchange } from "@/app/component/ExchangeContext"
import { useState } from "react"

export default function NavSelect() {
  const pathname = usePathname()
  const router = useRouter()
  const { favorites } = useExchange()

  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "HISTORY" },
    { href: "/compare", label: "COMPARE" },
    { href: "/favorites", label: "FAVORITES", count: favorites.length },
    { href: "/log", label: "LOG", count: 0 },
  ]

  const currentItem =
    navItems.find((item) => item.href === pathname) ?? navItems[0]

  function handleSelect(href: string) {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <div className="relative w-6/7 mx-auto mt-4 md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-3 rounded-lg border border-neutral-700
        bg-neutral-900 flex items-center justify-between
        text-base uppercase
        focus:outline-none focus-visible:ring-2 focus:ring-lime-400"
      >
        <div className="flex items-center gap-2">
          <span>{currentItem.label}</span>

          {currentItem.count !== undefined && (
            <span className="bg-lime-900 px-2 py-1 rounded-full text-lime-400 text-xs">
              {currentItem.count}
            </span>
          )}
        </div>

        <MdArrowDropDown
          className={`text-4xl transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-900 p-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => handleSelect(item.href)}
              className={`w-full px-3 py-3 rounded-md flex items-center justify-between
              text-base uppercase text-left
              transition-colors duration-200
              hover:bg-neutral-800
              ${
                pathname === item.href
                  ? "bg-neutral-800 text-lime-400"
                  : "text-white"
              }`}
            >
              <span>{item.label}</span>

              {item.count !== undefined && (
                <span className="bg-lime-900 px-2 py-1 rounded-full text-lime-400 text-xs">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}