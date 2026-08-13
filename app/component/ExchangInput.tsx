"use client";

import { useExchange } from "@/app/component/ExchangeContext"
import { IoSwapVerticalOutline } from "react-icons/io5"
import { FaRegStar } from "react-icons/fa6"
import { VscArrowSwap } from "react-icons/vsc"
import Currency from "@/app/component/Currency"
import { useEffect, useState } from "react"

export default function ExchangeInput() {

const {
  amount,
  fromCurrency,
  toCurrency,
  setAmount,
} = useExchange()

const [rate, setRate] = useState(0)

useEffect(() => {
  async function fetchRate() {
    const res = await fetch(
      `https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&quotes=${toCurrency}`
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch rate: ${res.status}`)
    }

    const data = await res.json()

    console.log(data)

    setRate(data[0]?.rate ?? 0)
  }

  fetchRate()
}, [fromCurrency, toCurrency])

const receive = Number(amount || 0) * rate
const exchangeRate = rate ? `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}` : "Loading..."

  return (
    <section className="w-full mt-8 px-4">
    <div className="w-full max-w-[1200px] mx-auto">
      <h2 className="text-xl lg:text-2xl uppercase mb-4 lg:my-8">Check the rate</h2>
    
    <div className="w-full md:w-[750px] lg:w-[1200px] mx-auto rounded-3xl bg-neutral-900 p-6">
        <div className="md:flex md:gap-6 md:justify-between">
        <div className="rounded-2xl border border-neutral-700 bg-neutral-800 p-6">
          <p className="text-sm lg:text-lg uppercase text-neutral-400 mb-4">Send</p>
        <div className="md:w-[252px] lg:w-[450px] flex items-end justify-between gap-4">
            <input
              type="number"
              name="send"
              value={amount}
              placeholder="0.00"
              onChange={(e) => setAmount(e.target.value)}
              className="w-full min-w-0 bg-transparent text-4xl font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Currency type="from" />
          </div>
        </div>
        <div className="flex justify-center py-4">
        <button
            type="button"
            className="md:hidden flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-700 text-2xl">
            <IoSwapVerticalOutline/>
        </button>
        <button
            type="button"
            className="hidden md:flex w-16 h-16 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-700 text-3xl text-white">
            <VscArrowSwap/>
        </button>
        </div>
        <div className="rounded-2xl border border-neutral-700 bg-neutral-800 p-6">
          <p className="text-sm lg:text-lg uppercase text-neutral-400 mb-4">Receive</p>
            <div className="md:w-[252px] lg:w-[450px] flex items-end justify-between gap-4">
            <span className="min-w-0 text-4xl font-semibold text-lime-400">{receive.toFixed(2)}</span>
            <Currency type="to" />
          </div>
        </div>
        </div>
        <div className="mt-6 md:pt-8 pt-4 text-center border-t-4 border-neutral-700 border-dashed md:flex md:justify-between md:items-center">
        <p className="text-sm lg:text-lg">{exchangeRate}</p>
        <div className="mt-4 md:mt-0 flex gap-4 justify-center">
        <button className="py-2 px-4 md:py-3 md:px-4 lg:py-4 lg:px-5 bg-lime-500 text-neutral-900 flex items-center justify-center gap-2 rounded-xl lg:text-lg leading-none"><FaRegStar/> FAVORITE</button>
        <button className="py-2 px-4 md:py-3 md:px-4 lg:py-4 lg:px-5 border-2 border-lime-500 rounded-xl whitespace-nowrap lg:text-lg leading-none">LOG CONVERSION</button>
        </div>
        </div>
      </div>
      </div>
    </section>
  )
}