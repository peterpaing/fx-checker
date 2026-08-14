import { MdArrowDropDown } from "react-icons/md";

export default function NavSelect(){
    return (
    <div className=" w-6/7 mx-auto mt-4 relative md:hidden">
    <select className="appearance-none w-full h-12 px-3 pr-8 rounded-lg border border-neutral-700 bg-neutral-900
     text-base uppercase outline-none leading-none
     focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-black">
    <option value="/" className="text-lg">HISTORY</option>
    <option value="/compare" className="text-lg">COMPARE</option>
    <option value="/favorites" className="text-lg">FAVORITES</option>
    <option value="/log" className="text-lg">LOG</option>
  </select>

  <MdArrowDropDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-4xl" />
</div>
    )
}