"use client"

import { useExchange } from "@/app/component/ExchangeContext"
import { useState } from "react"
import { currencies, type Currency } from "@/app/data/currencies"
import { IoSearch } from "react-icons/io5"
import { MdArrowDropDown } from "react-icons/md"
import Image from "next/image"

type CurrencySelectorProps = {
  type: "from" | "to"
}

const popularCurrencies = currencies.slice(0, 5)

export default function CurrencySelector({type}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const {
  fromCurrency,
  toCurrency,
  setFromCurrency,
  setToCurrency,
} = useExchange()

const selectedCode = type === "from" ? fromCurrency : toCurrency

const selectedCurrency = currencies.find((currency) => currency.code === selectedCode) ?? currencies[0]

  function handleToggle() {
    setIsOpen((prev) => !prev)
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

function handleSelect(currency: Currency) {
  if (type === "from") {
    setFromCurrency(currency.code)
  } else {
    setToCurrency(currency.code)
  }

  setIsOpen(false)
  setSearch("")
}

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(search.toLowerCase()) ||
      currency.name.toLowerCase().includes(search.toLowerCase())
  )

  const displayedCurrencies = search
    ? filteredCurrencies
    : popularCurrencies

  return (
    <div className="relative">
      <button
      type="button"
      onClick={handleToggle}
      className="w-[96px] flex items-center gap-1 rounded-lg bg-neutral-700 px-3 py-1
      focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black"
    >
      <Image
        src={selectedCurrency.flag}
        alt={selectedCurrency.code}
        width={20}
        height={20}
        className="rounded-full mr-1"
      />
      <span className="text-base lg:mt-1">{selectedCurrency.code}</span>
      <span><MdArrowDropDown className="text-xl lg:mt-1"/></span>
    </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-6 z-50 w-72 rounded-xl bg-neutral-800 p-3">
            <div className="relative">
            <IoSearch className="absolute mt-4 ml-2 text-lg"/>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder={"Search currencies..."}
            className="w-full rounded-lg border border-neutral-600 bg-transparent py-3 px-8 outline-none"
          />
            </div>
          <div className="mt-4">
            <div className="flex justify-between px-2 text-sm text-neutral-400">
              <span>
                {search ? "SEARCH RESULTS" : "POPULAR"}
              </span>

              <span>
                {search
                  ? filteredCurrencies.length
                  : popularCurrencies.length}
              </span>
            </div>

            <div className="mt-2">
              {displayedCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => handleSelect(currency)}
                  className="flex w-full items-center gap-4 rounded-lg p-3 text-left
                  focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-black"
                >
                <Image
                  src={currency.flag}
                  alt={currency.code}
                  width={20}
                  height={20}
                  className="rounded-full mr-1"
                />
                <span>{currency.code}</span>
                <span className="text-neutral-400">{currency.name}</span>
                {selectedCurrency.code === currency.code && (
                    <span className="ml-auto">✓</span>
                )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}