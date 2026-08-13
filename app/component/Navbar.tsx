import NavLink from "@/app/component/NavLink"

export default function Navbar(){
    return (
    <nav className="hidden md:block mx-auto w-[750px] border-b-2 border-b-neutral-800 lg:w-[1200px]">
    <ul className="flex gap-10 mt-12 mb-6 text-lg lg:gap-16 lg:text-xl">
    <NavLink href="/history">HISTORY</NavLink>
    <NavLink href="/compare">COMPARE</NavLink>
    <NavLink href="/favorites">FAVORITES</NavLink>
    <NavLink href="/log">LOG</NavLink>
    </ul>
    </nav>
    )
}