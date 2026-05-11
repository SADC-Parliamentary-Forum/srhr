export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-full overflow-x-hidden [overflow-wrap:anywhere] [&_table]:w-full [&_table]:table-fixed [&_th]:align-top [&_th]:break-words [&_td]:align-top [&_td]:break-words">
      {children}
    </div>
  )
}
