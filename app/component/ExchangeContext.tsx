"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getFavorites,toggleFavorite,type Favorite } from "@/app/lib/favorites"

type ExchangeContextType = {
  amount: string
  fromCurrency: string
  toCurrency: string
  favorites: Favorite[]
  setAmount: (amount: string) => void
  setFromCurrency: (currency: string) => void
  setToCurrency: (currency: string) => void
  handleFavorite: (fromCurrency: string,toCurrency: string) => void
}

const ExchangeContext = createContext<ExchangeContextType | null>(null)

export function ExchangeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [amount,setAmount] = useState("")
  const [fromCurrency,setFromCurrency] = useState("USD")
  const [toCurrency,setToCurrency] = useState("EUR")
  const [favorites,setFavorites] = useState<Favorite[]>([])

  useEffect(() => {
    setFavorites(getFavorites())
  },[])

  function handleFavorite(fromCurrency: string,toCurrency: string){
    const updatedFavorites = toggleFavorite(fromCurrency,toCurrency)
    setFavorites(updatedFavorites)
  }

  return (
    <ExchangeContext.Provider
      value={{
        amount,
        fromCurrency,
        toCurrency,
        favorites,
        setAmount,
        setFromCurrency,
        setToCurrency,
        handleFavorite,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  )
}

export function useExchange() {
  const context = useContext(ExchangeContext)

  if(!context){
    throw new Error("useExchange must be used inside ExchangeProvider")
  }

  return context
}