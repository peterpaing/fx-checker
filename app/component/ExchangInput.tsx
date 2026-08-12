import { IoSwapVerticalOutline } from "react-icons/io5"
import Currency from "@/app/component/Currency"

export default function ExchangeInput() {
  return (
    <section className="w-full mt-8 px-4">
      <h2 className="text-xl uppercase mb-6">Check the rate</h2>
    
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-neutral-900 p-6">
        <div className="rounded-2xl border border-neutral-700 bg-neutral-800 p-6">
          <p className="text-sm uppercase text-neutral-400 mb-4">Send</p>
        <div className="flex items-end justify-between gap-4">
            <input
              type="number"
              name="send"
              defaultValue="0"
              className="w-full min-w-0 bg-transparent text-4xl font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Currency defaultCurrency="USD"/>
          </div>
        </div>
        <div className="flex justify-center py-6">
        <button
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-700 text-2xl">
            <IoSwapVerticalOutline/>
        </button>
        </div>
        <div className="rounded-2xl border border-neutral-700 bg-neutral-800 p-6">
          <p className="text-sm uppercase text-neutral-400 mb-4">Receive</p>
            <div className="flex items-end justify-between gap-4">
            <span className="min-w-0 text-4xl font-semibold text-lime-400">0</span>
            <Currency defaultCurrency="EUR"/>
          </div>
        </div>
      </div>
    </section>
  )
}