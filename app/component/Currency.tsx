"use client";

import { useState } from "react";
import { currencies, type Currency } from "@/app/data/currencies"
import { IoSearch } from "react-icons/io5"
import { MdArrowDropDown } from "react-icons/md"

type CurrencySelectorProps = {
  defaultCurrency?: string
}

const popularCurrencies = currencies.slice(0, 5)

export default function CurrencySelector({ defaultCurrency }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const initialCurrency =currencies.find((currency) => currency.code === defaultCurrency) ??currencies[0]
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(initialCurrency)

  function handleToggle() {
    setIsOpen((prev) => !prev)
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  function handleSelect(currency: Currency) {
    setSelectedCurrency(currency)
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
        className="flex items-center gap-3 rounded-xl bg-neutral-700 px-4 py-3"
      >
       <span>{selectedCurrency.code}</span>
        <span><MdArrowDropDown className="text-xl"/></span>
      </button>

      {isOpen && (
        <div className=" absolute right-0 top-full mt-8 z-50 w-80 rounded-xl bg-neutral-800 p-3">
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
                  className="flex w-full items-center gap-4 rounded-lg p-3 text-left"
                >
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