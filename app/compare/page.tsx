"use client"

import { useEffect, useState } from "react"
import { useExchange } from "@/app/component/ExchangeContext"
import { currencies } from "@/app/data/currencies"
import Image from "next/image"
import { FaStar } from "react-icons/fa6"
import { FaRegStar } from "react-icons/fa6"

type Rate = {
  quote: string
  rate: number
}

export default function Compare() {
  const {
    fromCurrency,
    toCurrency,
    amount,
    favorites,
    handleFavorite,
  } = useExchange()

  const [rates, setRates] = useState<Rate[]>([])

  const compareCurrencies = currencies
    .filter(
      (currency) =>
        currency.code !== toCurrency &&
        currency.code !== fromCurrency
    )
    .slice(0, 8)

  useEffect(() => {
    async function fetchRates() {
      const quotes = compareCurrencies
        .map((currency) => currency.code)
        .join(",")

      const res = await fetch(
        `https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&quotes=${quotes}`
      )

      if (!res.ok) {
        throw new Error(`Failed to fetch rates: ${res.status}`)
      }

      const data = await res.json()

      setRates(data)
    }

    fetchRates()
  }, [fromCurrency, toCurrency])


  if(!amount){
    return (
      <div className="w-full max-w-[460px] p-4 mx-auto text-center my-10 md:my-18">
        <h3 className="text-base mb-4">No comparison available</h3>
        <p className="text-sm text-neutral-400">Enter an amount in SEND above to see what your money is worth in other currencies.</p>
        </div>
    )
  }

  return (
    <section className="w-6/7 max-w-[1036px] my-6 px-4 pt-2 pb-4 bg-neutral-900 mx-auto rounded-xl">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 px-4 pt-4">
    <div className="flex items-center gap-3">
      <h3 className="text-sm text-neutral-400 ">MULTI-CURRENCY</h3>
      <p className="text-base">{amount} FROM {fromCurrency}</p>
      </div>
      <p className="text-xs text-neutral-400">{compareCurrencies.length} PAIRS</p>
        </div>
      {rates.map((item) => {
        const currency = currencies.find(
          (currency) => currency.code === item.quote
        )

        if (!currency) {
          return null
        }

        const convertedAmount = Number(amount) * item.rate

        const isFavorite = favorites.some(
          (favorite) =>
            favorite.fromCurrency === fromCurrency &&
            favorite.toCurrency === item.quote
        )

        return (
          <div key={item.quote} className="p-4 flex justify-between items-center mt-4 bg-neutral-800 rounded-xl">
            <div className="flex items-center gap-4">
              <Image
                src={currency.flag}
                alt={currency.name}
                width={24}
                height={24}
                className="rounded-full"
              />
                <div>
              <p className="text-sm">{item.quote}</p>
              <p className="text-xs text-neutral-400">{currency.name}</p>
            </div>
            </div>

            <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
                <p className="text-base">{convertedAmount.toFixed(2)}</p>
                <p className="pt-1 text-xs text-neutral-400 flex items-center whitespace-nowrap">rate: {item.rate.toFixed(4)}</p>
              </div>

            <button
            type="button"
            onClick={() => handleFavorite(fromCurrency, item.quote)}
            className={`w-[32px] h-[32px] border rounded-lg ${
                isFavorite
                ? "border-lime-400"
                : "border-neutral-300"
            }`}
            >
            {isFavorite ? (
                <FaStar className="mx-auto text-lime-400" />
            ) : (
                <FaRegStar className="mx-auto" />
            )}
            </button>
            </div>
          </div>
        )
      })}
    </section>
  )
}