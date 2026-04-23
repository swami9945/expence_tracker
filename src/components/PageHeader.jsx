export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-700">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-500">
            {description}
          </p>
        </div>
        {action}
      </div>
    </section>
  )
}
