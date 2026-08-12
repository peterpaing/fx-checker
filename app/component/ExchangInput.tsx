"use client";

import { useExchange } from "@/app/component/ExchangeContext"
import { IoSwapVerticalOutline } from "react-icons/io5"
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
              value={amount}
              placeholder="0.00"
              onChange={(e) => setAmount(e.target.value)}
              className="w-full min-w-0 bg-transparent text-4xl font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Currency type="from" />
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
            <span className="min-w-0 text-4xl font-semibold text-lime-400">{receive.toFixed(2)}</span>
            <Currency type="to" />
          </div>
        </div>
      </div>
    </section>
  )
}