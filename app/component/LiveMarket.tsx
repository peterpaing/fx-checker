type Rate = {
  quote: string,
  rate: number
}

type Change = {
  currency: string,
  currentRate: number,
  percentageChange: number
}

export default async function LiveMarket() {

try {
const currencies ="EUR,GBP,JPY,CHF,AUD,CAD,NZD,CNY,HKD,SGD,KRW,INR,THB,MYR,PHP,IDR,SEK,NOK,DKK,PLN"

const currentRes  = await fetch(
  `https://api.frankfurter.dev/v2/rates?base=USD&quotes=${currencies}`,
  {
    next: { revalidate: 60 },
  }
)
if (!currentRes.ok) {
    throw new Error("Failed to fetch current rates")
}

const currentRates: Rate[]  = await currentRes .json()

const today = new Date()
const previousDay = new Date(today)
previousDay.setDate(today.getDate() - 1)

if (previousDay.getDay() === 0) {
  previousDay.setDate(previousDay.getDate() - 2)
}

if (previousDay.getDay() === 6) {
  previousDay.setDate(previousDay.getDate() - 1)
}

const previousRes = await fetch(
    `https://api.frankfurter.dev/v2/rates?date=${previousDay.toISOString().split("T")[0]}&base=USD&quotes=${currencies}`,
    {
      next: { revalidate: 60 },
    }
  )

if (!previousRes.ok) {
    throw new Error("Failed to fetch previous rates")
}

const previousRates: Rate[] = await previousRes.json()

const changes: Change[] = currentRates.map((current) => {
  const previous = previousRates.find(
    (item) =>
      item.quote === current.quote
  )

    if (!previous) {
        throw new Error(`Previous rate not found for ${current.quote}`)
    }

    const percentageChange =
    ((current.rate - previous.rate) / previous.rate) * 100

  return {
    currency: current.quote,
    currentRate: current.rate,
    percentageChange,
  }
})
    return (
        <section className="flex items-center text-sm md:text-base">
            <h2 className="p-4 bg-lime-500 text-neutral-900 font-semibold whitespace-nowrap uppercase">Live Market</h2>
            <div className="flex-1 gap-2 overflow-x-auto bg-neutral-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex w-max animate-ticker">
                {changes.map((item) => (
          <div key={item.currency} className="p-4 border-r-2 border-neutral-600 flex items-center gap-2">
            <span className="text-neutral-300">USD/{item.currency}</span>
            <span>{item.currentRate}</span>
            <span className={`whitespace-nowrap ${item.percentageChange >= 0 ?'text-green-500' :'text-red-500'}`}>
              {item.percentageChange >= 0 ? "▲ + " : "▼ "}
              {item.percentageChange.toFixed(2)}%
            </span>
          </div>
        ))}
            </div>
            </div>
        </section>
    )
}catch (error) {
    console.error("Live market error:", error)

    return (
      <section className="flex">
        <h2 className="p-4 bg-lime-500 text-neutral-900 font-semibold whitespace-nowrap uppercase">Live Market</h2>
        <p className="p-4 bg-neutral-800 text-red-500 text-sm md:text-base">Unable to load exchange rates. Please try again later.</p>
      </section>
    )
  }
}