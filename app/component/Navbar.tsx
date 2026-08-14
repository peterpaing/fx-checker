import NavLink from "@/app/component/NavLink"

export default function Navbar(){
    return (
    <nav className="hidden md:block mx-auto w-full max-w-[1036px] border-b-2 border-b-neutral-800 ">
    <ul className="flex justify-between mt-12 mb-2 text-sm lg:gap-16 ">
    <NavLink href="/">HISTORY</NavLink>
    <NavLink href="/compare">COMPARE</NavLink>
    <NavLink href="/favorites">FAVORITES</NavLink>
    <NavLink href="/log">LOG</NavLink>
    </ul>
    </nav>
    )
}