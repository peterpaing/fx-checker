'use client'

import NavLink from "@/app/component/NavLink"
import { useExchange } from "@/app/component/ExchangeContext"

export default function Navbar(){
    const { favorites,logs } = useExchange()

    return (
    <nav className="hidden md:block w-full mx-auto md:px-6 md:w-[600px] lg:w-[1036px]  border-b-2 border-b-neutral-800 ">
    <ul className="flex md:justify-between lg:justify-start mt-12 mb-3 text-sm lg:gap-16 ">
    <NavLink href="/">HISTORY</NavLink>
    <NavLink href="/compare">COMPARE</NavLink>
    <NavLink href="/favorites">FAVORITES <span className="bg-lime-900 px-2 py-1 rounded-full text-lime-400 text-xs">{favorites.length}</span></NavLink>
    <NavLink href="/log">LOG <span className="bg-lime-900 px-2 py-1 rounded-full text-lime-400 text-xs">{logs.length}</span></NavLink>
    </ul>
    </nav>
    )
}