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

const currencies ="EUR,GBP,JPY,CHF,AUD,CAD,NZD,CNY,HKD,SGD,KRW,INR,THB,MYR,PHP,IDR,SEK,NOK,DKK,PLN"

const currentRes  = await fetch(
  `https://api.frankfurter.dev/v2/rates?base=USD&quotes=${currencies}`,
  {
    next: { revalidate: 60 },
  }
)

const currentRates: Rate[]  = await currentRes .json()

const today = new Date()
const previousDay = new Date(today)
previousDay.setDate(today.getDate() - 1)

if (previousDay.getDay() === 0) {
  previousDay.setDate(previousDay.getDate() - 2);
}

if (previousDay.getDay() === 6) {
  previousDay.setDate(previousDay.getDate() - 1);
}

const previousRes = await fetch(
    `https://api.frankfurter.dev/v2/rates?date=${previousDay.toISOString().split("T")[0]}&base=USD&quotes=${currencies}`,
    {
      next: { revalidate: 60 },
    }
  )

const previousRates: Rate[] = await previousRes.json()

const changes: Change[] = currentRates.map((current) => {
  const previous = previousRates.find(
    (item) =>
      item.quote === current.quote
  )

    if (!previous) {
        throw new Error(`Previous rate not found for ${current.quote}`);
    }

    const percentageChange =
    ((current.rate - previous.rate) / previous.rate) * 100;

  return {
    currency: current.quote,
    currentRate: current.rate,
    percentageChange,
  }
})
    return (
        <section className="flex items-center text-sm md:text-base">
            <h2 className="p-4 bg-lime-500 text-black font-semibold whitespace-nowrap">Live Market</h2>
            <div className="flex gap-2 overflow-x-auto bg-neutral-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
        </section>
    )
}