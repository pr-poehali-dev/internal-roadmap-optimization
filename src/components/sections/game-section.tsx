import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"
import { MagneticButton } from "@/components/magnetic-button"

const REGIONS = [
  { id: "moscow", name: "Москва", salary: 110000, rent: 45000, food: 18000, transport: 4000, utilities: 5000, entertainment: 8000 },
  { id: "spb", name: "Санкт-Петербург", salary: 80000, rent: 32000, food: 15000, transport: 3500, utilities: 4500, entertainment: 6000 },
  { id: "novosibirsk", name: "Новосибирск", salary: 52000, rent: 18000, food: 12000, transport: 2500, utilities: 3500, entertainment: 4000 },
  { id: "yekaterinburg", name: "Екатеринбург", salary: 56000, rent: 20000, food: 13000, transport: 2800, utilities: 3800, entertainment: 4500 },
  { id: "kazan", name: "Казань", salary: 48000, rent: 16000, food: 11000, transport: 2200, utilities: 3200, entertainment: 3500 },
  { id: "krasnodar", name: "Краснодар", salary: 45000, rent: 18000, food: 11000, transport: 2000, utilities: 3000, entertainment: 3000 },
  { id: "voronezh", name: "Воронеж", salary: 38000, rent: 12000, food: 10000, transport: 1800, utilities: 2800, entertainment: 2500 },
  { id: "perm", name: "Пермь", salary: 46000, rent: 14000, food: 11000, transport: 2000, utilities: 3200, entertainment: 3000 },
  { id: "ufa", name: "Уфа", salary: 44000, rent: 13000, food: 10500, transport: 1900, utilities: 3000, entertainment: 2800 },
  { id: "samara", name: "Самара", salary: 42000, rent: 15000, food: 11000, transport: 2000, utilities: 3000, entertainment: 3000 },
  { id: "omsk", name: "Омск", salary: 38000, rent: 11000, food: 10000, transport: 1700, utilities: 2800, entertainment: 2200 },
  { id: "chelyabinsk", name: "Челябинск", salary: 44000, rent: 13000, food: 10500, transport: 1900, utilities: 3000, entertainment: 2800 },
  { id: "rostov", name: "Ростов-на-Дону", salary: 43000, rent: 16000, food: 11000, transport: 2000, utilities: 3000, entertainment: 3000 },
  { id: "krasnoyarsk", name: "Красноярск", salary: 54000, rent: 17000, food: 12000, transport: 2500, utilities: 3800, entertainment: 4000 },
  { id: "tyumen", name: "Тюмень", salary: 68000, rent: 22000, food: 14000, transport: 3000, utilities: 4200, entertainment: 5000 },
  { id: "irkutsk", name: "Иркутск", salary: 48000, rent: 14000, food: 11500, transport: 2200, utilities: 3500, entertainment: 3200 },
  { id: "vladivostok", name: "Владивосток", salary: 62000, rent: 24000, food: 16000, transport: 3000, utilities: 4500, entertainment: 5000 },
  { id: "khabarovsk", name: "Хабаровск", salary: 58000, rent: 20000, food: 14000, transport: 2800, utilities: 4000, entertainment: 4200 },
  { id: "murmansk", name: "Мурманск", salary: 72000, rent: 18000, food: 16000, transport: 2500, utilities: 5500, entertainment: 4500 },
  { id: "yakutsk", name: "Якутск", salary: 78000, rent: 20000, food: 18000, transport: 3000, utilities: 7000, entertainment: 5000 },
  { id: "stavropol", name: "Ставрополь", salary: 35000, rent: 12000, food: 10000, transport: 1700, utilities: 2600, entertainment: 2000 },
  { id: "volgograd", name: "Волгоград", salary: 36000, rent: 12000, food: 10000, transport: 1700, utilities: 2700, entertainment: 2200 },
  { id: "saratov", name: "Саратов", salary: 34000, rent: 10000, food: 9500, transport: 1500, utilities: 2500, entertainment: 2000 },
  { id: "ulyanovsk", name: "Ульяновск", salary: 33000, rent: 9000, food: 9000, transport: 1500, utilities: 2400, entertainment: 1800 },
]

const EXPENSES_CONFIG = [
  { key: "rent", label: "Аренда жилья", emoji: "🏠", description: "Однушка в среднем районе" },
  { key: "food", label: "Продукты и питание", emoji: "🛒", description: "Базовый набор на месяц" },
  { key: "transport", label: "Транспорт", emoji: "🚌", description: "Проездной + иногда такси" },
  { key: "utilities", label: "Коммунальные услуги", emoji: "💡", description: "ЖКХ, интернет, телефон" },
  { key: "entertainment", label: "Развлечения", emoji: "🎮", description: "Кино, кафе, подписки" },
]

type Region = typeof REGIONS[0]
type GameState = "map" | "expenses" | "result"

function formatMoney(amount: number) {
  return amount.toLocaleString("ru-RU") + " ₽"
}

export function GameSection() {
  const { ref, isVisible } = useReveal(0.2)
  const [gameState, setGameState] = useState<GameState>("map")
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [expenses, setExpenses] = useState<Record<string, number>>({})
  const [search, setSearch] = useState("")

  const filteredRegions = REGIONS.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleRegionClick = (region: Region) => {
    setSelectedRegion(region)
    setExpenses({
      rent: region.rent,
      food: region.food,
      transport: region.transport,
      utilities: region.utilities,
      entertainment: region.entertainment,
    })
    setGameState("expenses")
  }

  const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0)
  const balance = selectedRegion ? selectedRegion.salary - totalExpenses : 0
  const survived = balance >= 0

  const handleResult = () => setGameState("result")
  const handleReset = () => {
    setGameState("map")
    setSelectedRegion(null)
    setExpenses({})
    setSearch("")
  }

  const getSalaryColor = (salary: number) => {
    if (salary >= 70000) return "text-emerald-400"
    if (salary >= 50000) return "text-yellow-400"
    if (salary >= 40000) return "text-orange-400"
    return "text-red-400"
  }

  const getSalaryBg = (salary: number) => {
    if (salary >= 70000) return "bg-emerald-500/20 border-emerald-500/30 hover:bg-emerald-500/30"
    if (salary >= 50000) return "bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30"
    if (salary >= 40000) return "bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30"
    return "bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 pb-6 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl h-full flex flex-col justify-center">

        {/* MAP STATE */}
        {gameState === "map" && (
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="mb-6 md:mb-8">
              <h2 className="mb-1 font-sans text-4xl font-light tracking-tight text-foreground md:text-6xl">
                Симулятор жизни
              </h2>
              <p className="font-mono text-sm text-foreground/60">/ Выберите регион и узнайте, хватит ли зарплаты</p>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск региона..."
                className="w-full max-w-sm border-b border-foreground/30 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/60 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 overflow-y-auto max-h-[50vh]"
              style={{ scrollbarWidth: "none" }}>
              {filteredRegions.map((region, i) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionClick(region)}
                  className={`group relative border rounded-lg p-2 text-left transition-all duration-200 cursor-pointer ${getSalaryBg(region.salary)}`}
                  style={{ transitionDelay: `${i * 20}ms` }}
                >
                  <div className={`font-mono text-xs font-semibold mb-1 ${getSalaryColor(region.salary)}`}>
                    {formatMoney(region.salary)}
                  </div>
                  <div className="text-foreground/90 text-xs leading-tight font-sans">{region.name}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-4 text-xs font-mono text-foreground/50">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> от 70 000 ₽</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> от 50 000 ₽</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> от 40 000 ₽</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> до 40 000 ₽</span>
            </div>
          </div>
        )}

        {/* EXPENSES STATE */}
        {gameState === "expenses" && selectedRegion && (
          <div className={`transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <button onClick={handleReset} className="mb-4 font-mono text-xs text-foreground/50 hover:text-foreground/80 transition-colors flex items-center gap-2">
              ← Назад к карте
            </button>

            <div className="mb-6">
              <h2 className="font-sans text-3xl font-light text-foreground md:text-5xl">{selectedRegion.name}</h2>
              <p className="font-mono text-sm text-foreground/60 mt-1">
                Средняя зарплата: <span className={`font-semibold ${getSalaryColor(selectedRegion.salary)}`}>{formatMoney(selectedRegion.salary)}</span>
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-6">
              {EXPENSES_CONFIG.map(({ key, label, emoji, description }) => (
                <div key={key} className="border border-foreground/15 rounded-xl p-4 bg-foreground/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{emoji}</span>
                      <div>
                        <div className="font-sans text-sm text-foreground">{label}</div>
                        <div className="font-mono text-xs text-foreground/40">{description}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={Math.round(expenses[key] * 0.3)}
                      max={Math.round(expenses[key] * 2.5)}
                      value={expenses[key]}
                      onChange={e => setExpenses(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                      className="flex-1 accent-white/80 h-1"
                    />
                    <span className="font-mono text-sm text-foreground/90 w-24 text-right">
                      {formatMoney(expenses[key])}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-foreground/20 pt-4">
              <div>
                <div className="font-mono text-xs text-foreground/50 mb-1">Итого расходов</div>
                <div className="font-sans text-2xl text-foreground">{formatMoney(totalExpenses)}</div>
              </div>
              <MagneticButton variant="primary" size="lg" onClick={handleResult}>
                Подвести итог месяца →
              </MagneticButton>
            </div>
          </div>
        )}

        {/* RESULT STATE */}
        {gameState === "result" && selectedRegion && (
          <div className={`transition-all duration-500 text-center ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="text-6xl mb-4">{survived ? "🎉" : "😰"}</div>
            <h2 className="font-sans text-4xl font-light text-foreground mb-2 md:text-6xl">
              {survived ? "Хватило!" : "Не хватило"}
            </h2>
            <p className="font-mono text-sm text-foreground/60 mb-8">
              {selectedRegion.name} · Зарплата {formatMoney(selectedRegion.salary)}
            </p>

            <div className="inline-block border border-foreground/20 rounded-2xl p-8 mb-8 bg-foreground/5 min-w-64">
              <div className="font-mono text-xs text-foreground/50 mb-2">Остаток в конце месяца</div>
              <div className={`font-sans text-5xl font-light mb-4 ${survived ? "text-emerald-400" : "text-red-400"}`}>
                {balance >= 0 ? "+" : ""}{formatMoney(balance)}
              </div>
              <div className="space-y-2 text-left border-t border-foreground/10 pt-4">
                <div className="flex justify-between font-mono text-xs text-foreground/60">
                  <span>Доход</span><span className="text-emerald-400">+{formatMoney(selectedRegion.salary)}</span>
                </div>
                <div className="flex justify-between font-mono text-xs text-foreground/60">
                  <span>Расходы</span><span className="text-red-400">−{formatMoney(totalExpenses)}</span>
                </div>
              </div>
            </div>

            <p className="max-w-md mx-auto text-foreground/70 text-sm mb-8 leading-relaxed">
              {survived
                ? `Отлично! Вы прожили месяц в ${selectedRegion.name} и у вас ещё осталось ${formatMoney(balance)}. Попробуйте другой регион!`
                : `Увы, в ${selectedRegion.name} денег не хватило. Не хватает ${formatMoney(Math.abs(balance))}. Попробуйте сократить расходы или выбрать другой регион.`
              }
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <MagneticButton variant="primary" size="lg" onClick={() => setGameState("expenses")}>
                Изменить расходы
              </MagneticButton>
              <MagneticButton variant="secondary" size="lg" onClick={handleReset}>
                Выбрать другой регион
              </MagneticButton>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
