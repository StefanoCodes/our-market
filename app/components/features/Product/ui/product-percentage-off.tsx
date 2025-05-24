export function ProductPercentageOff({ percentageOff }: { percentageOff: number }) {
  return (
    <div className="rounded-full bg-brand-red px-2 py-1 text-xs text-white">
      {percentageOff}% off
    </div>
  )
}
