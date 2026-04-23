import { useMemo, useState } from 'react'
import { formatCurrency } from '../utils/formatters'

const clampNumber = (value) => Math.max(Number(value) || 0, 0)

export default function SmartCalculator() {
  const [emi, setEmi] = useState({
    principal: 750000,
    annualRate: 9,
    years: 5,
  })
  const [sip, setSip] = useState({
    monthlyInvestment: 10000,
    annualReturn: 12,
    years: 10,
  })
  const [goal, setGoal] = useState({
    targetAmount: 500000,
    currentSavings: 75000,
    annualReturn: 8,
    years: 4,
  })

  const emiResult = useMemo(() => {
    const principal = clampNumber(emi.principal)
    const months = clampNumber(emi.years) * 12
    const monthlyRate = clampNumber(emi.annualRate) / 12 / 100

    if (principal === 0 || months === 0) {
      return { monthlyEmi: 0, totalPayment: 0, totalInterest: 0 }
    }

    const monthlyEmi =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * (1 + monthlyRate) ** months) /
          ((1 + monthlyRate) ** months - 1)
    const totalPayment = monthlyEmi * months

    return {
      monthlyEmi,
      totalPayment,
      totalInterest: totalPayment - principal,
    }
  }, [emi])

  const sipResult = useMemo(() => {
    const monthlyInvestment = clampNumber(sip.monthlyInvestment)
    const months = clampNumber(sip.years) * 12
    const monthlyRate = clampNumber(sip.annualReturn) / 12 / 100
    const investedAmount = monthlyInvestment * months

    if (monthlyInvestment === 0 || months === 0) {
      return { investedAmount: 0, futureValue: 0, wealthGain: 0 }
    }

    const futureValue =
      monthlyRate === 0
        ? investedAmount
        : monthlyInvestment *
          (((1 + monthlyRate) ** months - 1) / monthlyRate) *
          (1 + monthlyRate)

    return {
      investedAmount,
      futureValue,
      wealthGain: futureValue - investedAmount,
    }
  }, [sip])

  const goalResult = useMemo(() => {
    const targetAmount = clampNumber(goal.targetAmount)
    const currentSavings = clampNumber(goal.currentSavings)
    const months = clampNumber(goal.years) * 12
    const monthlyRate = clampNumber(goal.annualReturn) / 12 / 100
    const currentFutureValue = currentSavings * (1 + monthlyRate) ** months
    const gap = Math.max(targetAmount - currentFutureValue, 0)

    if (targetAmount === 0 || months === 0 || gap === 0) {
      return { monthlyRequired: 0, currentFutureValue, gap }
    }

    const monthlyRequired =
      monthlyRate === 0
        ? gap / months
        : gap /
          ((((1 + monthlyRate) ** months - 1) / monthlyRate) *
            (1 + monthlyRate))

    return { monthlyRequired, currentFutureValue, gap }
  }, [goal])

  return (
    <section className="grid gap-5 xl:grid-cols-3">
      <CalculatorCard
        eyebrow="Loan planner"
        title="EMI Calculator"
        description="Estimate monthly EMI, total payment, and interest before taking a loan."
        fields={[
          {
            label: 'Loan amount',
            name: 'principal',
            value: emi.principal,
            prefix: '₹',
          },
          {
            label: 'Annual interest (%)',
            name: 'annualRate',
            value: emi.annualRate,
          },
          {
            label: 'Tenure in years',
            name: 'years',
            value: emi.years,
          },
        ]}
        onChange={(name, value) =>
          setEmi((current) => ({ ...current, [name]: value }))
        }
        results={[
          { label: 'Monthly EMI', value: formatCurrency(emiResult.monthlyEmi) },
          {
            label: 'Total interest',
            value: formatCurrency(emiResult.totalInterest),
          },
          {
            label: 'Total payment',
            value: formatCurrency(emiResult.totalPayment),
          },
        ]}
      />

      <CalculatorCard
        eyebrow="Investment planner"
        title="SIP Calculator"
        description="Project how monthly investing can grow with compounding over time."
        fields={[
          {
            label: 'Monthly SIP',
            name: 'monthlyInvestment',
            value: sip.monthlyInvestment,
            prefix: '₹',
          },
          {
            label: 'Expected return (%)',
            name: 'annualReturn',
            value: sip.annualReturn,
          },
          {
            label: 'Years',
            name: 'years',
            value: sip.years,
          },
        ]}
        onChange={(name, value) =>
          setSip((current) => ({ ...current, [name]: value }))
        }
        results={[
          {
            label: 'Invested amount',
            value: formatCurrency(sipResult.investedAmount),
          },
          {
            label: 'Estimated value',
            value: formatCurrency(sipResult.futureValue),
          },
          { label: 'Wealth gain', value: formatCurrency(sipResult.wealthGain) },
        ]}
      />

      <CalculatorCard
        eyebrow="Goal planner"
        title="Monthly Saving Needed"
        description="Find how much to save monthly to hit a goal by a deadline."
        fields={[
          {
            label: 'Target amount',
            name: 'targetAmount',
            value: goal.targetAmount,
            prefix: '₹',
          },
          {
            label: 'Current savings',
            name: 'currentSavings',
            value: goal.currentSavings,
            prefix: '₹',
          },
          {
            label: 'Expected return (%)',
            name: 'annualReturn',
            value: goal.annualReturn,
          },
          {
            label: 'Years',
            name: 'years',
            value: goal.years,
          },
        ]}
        onChange={(name, value) =>
          setGoal((current) => ({ ...current, [name]: value }))
        }
        results={[
          {
            label: 'Monthly required',
            value: formatCurrency(goalResult.monthlyRequired),
          },
          {
            label: 'Current savings may grow to',
            value: formatCurrency(goalResult.currentFutureValue),
          },
          { label: 'Remaining gap', value: formatCurrency(goalResult.gap) },
        ]}
      />
    </section>
  )
}

function CalculatorCard({ eyebrow, title, description, fields, onChange, results }) {
  return (
    <article className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black text-slate-950">{title}</h2>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-6 grid gap-4">
        {fields.map((field) => (
          <label key={field.name} className="text-sm font-bold text-slate-600">
            {field.label}
            <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
              {field.prefix && (
                <span className="flex items-center bg-slate-100 px-4 font-black text-slate-500">
                  {field.prefix}
                </span>
              )}
              <input
                min="0"
                step="0.01"
                type="number"
                value={field.value}
                onChange={(event) => onChange(field.name, event.target.value)}
                className="w-full border-0 px-4 py-3 text-slate-900 outline-none"
              />
            </div>
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-3">
        {results.map((result, index) => (
          <div
            key={result.label}
            className={`rounded-3xl p-4 ${
              index === 0
                ? 'bg-slate-950 text-white'
                : 'bg-emerald-50 text-emerald-900'
            }`}
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] opacity-70">
              {result.label}
            </p>
            <p className="mt-2 text-2xl font-black">{result.value}</p>
          </div>
        ))}
      </div>
    </article>
  )
}
