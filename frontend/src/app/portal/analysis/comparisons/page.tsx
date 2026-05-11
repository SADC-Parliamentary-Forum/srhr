'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const TABS = [
  { label: 'Visual Explorer', href: '/portal/analysis' },
  { label: 'Matrix Builder', href: '/portal/analysis/matrix' },
  { label: 'Comparisons', href: '/portal/analysis/comparisons' },
  { label: 'AI Insights', href: '/portal/analysis/ai-insights' },
];

const AVAILABLE_COUNTRIES = [
  'Angola',
  'Botswana',
  'DRC',
  'Eswatini',
  'Lesotho',
  'Madagascar',
  'Malawi',
  'Mauritius',
  'Mozambique',
  'Namibia',
  'South Africa',
  'Tanzania',
  'Zambia',
  'Zimbabwe',
];
const METRICS = ['SRHR Composite Score', 'Maternal Mortality Rate', 'Contraceptive Prevalence', 'Youth Health Access'];
const PERIODS = ['Q1 2026', 'Q4 2025', 'Annual 2025'];

const countryDataMap = {
  Angola: {
    score: 62,
    target: 78,
    region: 'Southern Africa',
    metrics: {
      'SRHR Composite Score': '62%',
      'Maternal Mortality Rate': '415',
      'Contraceptive Prevalence': '47%',
      'Youth Health Access': '55%',
    },
  },
  Botswana: {
    score: 84,
    target: 88,
    region: 'Southern Africa',
    metrics: {
      'SRHR Composite Score': '84%',
      'Maternal Mortality Rate': '248',
      'Contraceptive Prevalence': '66%',
      'Youth Health Access': '74%',
    },
  },
  DRC: {
    score: 58,
    target: 76,
    region: 'Central Africa',
    metrics: {
      'SRHR Composite Score': '58%',
      'Maternal Mortality Rate': '473',
      'Contraceptive Prevalence': '39%',
      'Youth Health Access': '49%',
    },
  },
  Eswatini: {
    score: 73,
    target: 82,
    region: 'Southern Africa',
    metrics: {
      'SRHR Composite Score': '73%',
      'Maternal Mortality Rate': '325',
      'Contraceptive Prevalence': '57%',
      'Youth Health Access': '63%',
    },
  },
  Lesotho: {
    score: 67,
    target: 79,
    region: 'Southern Africa',
    metrics: {
      'SRHR Composite Score': '67%',
      'Maternal Mortality Rate': '392',
      'Contraceptive Prevalence': '49%',
      'Youth Health Access': '58%',
    },
  },
  Madagascar: {
    score: 64,
    target: 77,
    region: 'Eastern Africa',
    metrics: {
      'SRHR Composite Score': '64%',
      'Maternal Mortality Rate': '408',
      'Contraceptive Prevalence': '45%',
      'Youth Health Access': '57%',
    },
  },
  Malawi: {
    score: 78,
    target: 84,
    region: 'Southern Africa',
    metrics: {
      'SRHR Composite Score': '78%',
      'Maternal Mortality Rate': '381',
      'Contraceptive Prevalence': '58%',
      'Youth Health Access': '66%',
    },
  },
  Mauritius: {
    score: 86,
    target: 90,
    region: 'Eastern Africa',
    metrics: {
      'SRHR Composite Score': '86%',
      'Maternal Mortality Rate': '214',
      'Contraceptive Prevalence': '69%',
      'Youth Health Access': '76%',
    },
  },
  Mozambique: {
    score: 69,
    target: 81,
    region: 'Southern Africa',
    metrics: {
      'SRHR Composite Score': '69%',
      'Maternal Mortality Rate': '421',
      'Contraceptive Prevalence': '50%',
      'Youth Health Access': '59%',
    },
  },
  Namibia: {
    score: 82,
    target: 87,
    region: 'Southern Africa',
    metrics: {
      'SRHR Composite Score': '82%',
      'Maternal Mortality Rate': '268',
      'Contraceptive Prevalence': '64%',
      'Youth Health Access': '71%',
    },
  },
  'South Africa': {
    score: 88,
    target: 91,
    region: 'Southern Africa',
    metrics: {
      'SRHR Composite Score': '88%',
      'Maternal Mortality Rate': '238',
      'Contraceptive Prevalence': '68%',
      'Youth Health Access': '78%',
    },
  },
  Tanzania: {
    score: 72,
    target: 83,
    region: 'East Africa',
    metrics: {
      'SRHR Composite Score': '72%',
      'Maternal Mortality Rate': '410',
      'Contraceptive Prevalence': '54%',
      'Youth Health Access': '62%',
    },
  },
  Zambia: {
    score: 81,
    target: 86,
    region: 'Southern Africa',
    metrics: {
      'SRHR Composite Score': '81%',
      'Maternal Mortality Rate': '296',
      'Contraceptive Prevalence': '63%',
      'Youth Health Access': '69%',
    },
  },
  Zimbabwe: {
    score: 79,
    target: 85,
    region: 'Southern Africa',
    metrics: {
      'SRHR Composite Score': '79%',
      'Maternal Mortality Rate': '312',
      'Contraceptive Prevalence': '60%',
      'Youth Health Access': '68%',
    },
  },
} as const;

type CountryName = keyof typeof countryDataMap;

function parseMetricValue(value: string) {
  return Number(value.replace('%', ''));
}

function varianceTone(value: number) {
  if (value >= 0) {
    return 'text-emerald-700';
  }

  return 'text-rose-700';
}

export default function ComparisonPage() {
  const [selectedCountries, setSelectedCountries] = useState<CountryName[]>(['Malawi', 'South Africa', 'Zambia']);
  const [selectedMetric, setSelectedMetric] = useState(METRICS[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);

  const selectedData = useMemo(
    () => selectedCountries.map((country) => ({ country, ...countryDataMap[country] })),
    [selectedCountries]
  );

  const metricRows = useMemo(() => {
    return selectedData.map((entry) => {
      const actual =
        selectedMetric === 'SRHR Composite Score'
          ? entry.score
          : parseMetricValue(entry.metrics[selectedMetric as keyof typeof entry.metrics]);
      const target =
        selectedMetric === 'Maternal Mortality Rate'
          ? Math.max(actual - 28, 250)
          : Math.min(entry.target, actual + 8);
      const variance = actual - target;

      return {
        country: entry.country,
        region: entry.region,
        indicator: selectedMetric,
        target,
        actual,
        variance,
      };
    });
  }, [selectedData, selectedMetric]);

  const leaderboard = useMemo(
    () => [...selectedData].sort((a, b) => b.score - a.score),
    [selectedData]
  );

  const totalActual = metricRows.reduce((sum, row) => sum + row.actual, 0);
  const totalTarget = metricRows.reduce((sum, row) => sum + row.target, 0);
  const averageGap = Math.round((totalActual - totalTarget) / Math.max(metricRows.length, 1));

  const handleCountryChange = (country: CountryName) => {
    setSelectedCountries((current) => {
      if (current.includes(country)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter((item) => item !== country);
      }

      if (current.length >= 4) {
        return [...current.slice(1), country];
      }

      return [...current, country];
    });
  };

  return (
    <main className="min-h-screen bg-[#f4f1e8] text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[28px] border border-black/10 bg-[linear-gradient(135deg,#1c4d43_0%,#285f52_58%,#d7bf6a_180%)] text-white shadow-[0_28px_60px_rgba(28,77,67,0.18)]">
          <div className="flex flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/86">
                Comparative Analytics
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Comparison Insights</h1>
                <p className="max-w-2xl text-sm leading-6 text-white/82 sm:text-base">
                  Compare country performance, expose target gaps, and export a presentation-ready evidence view for
                  parliamentary oversight and regional coordination.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-white/78 sm:text-sm">
                <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5">{selectedPeriod}</span>
                <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5">{selectedMetric}</span>
                <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5">
                  {selectedCountries.length} countries selected
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-full border border-white/24 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                Share View
              </button>
              <button
                type="button"
                className="rounded-full bg-[#f4d370] px-5 py-2.5 text-sm font-semibold text-[#1b4337] transition hover:bg-[#f0cc5d]"
              >
                Export Report
              </button>
            </div>
          </div>
        </header>

        <nav className="overflow-x-auto rounded-[24px] border border-black/8 bg-white/80 px-3 py-3 shadow-sm">
          <div className="flex min-w-max items-center gap-2">
            {TABS.map((tab) => {
              const active = tab.href === '/portal/analysis/comparisons';

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-[#1c4d43] text-white shadow-[0_12px_24px_rgba(28,77,67,0.18)]'
                      : 'text-[var(--foreground)] hover:bg-black/5'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <section className="rounded-[28px] border border-black/8 bg-white px-5 py-5 shadow-sm sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a6f54]">Analysis Filters</p>
              <h2 className="text-xl font-semibold text-[#163c33]">Refine the comparison view</h2>
              <p className="max-w-2xl text-sm leading-6 text-[#5f5a4d]">
                Select a reporting window, choose the indicator dimension, and compare up to four countries side by
                side without crowding the page.
              </p>
            </div>
            <div className="rounded-2xl bg-[#f6f3ea] px-4 py-3 text-sm text-[#5f5a4d]">
              View average gap:
              <span className={`ml-2 font-semibold ${varianceTone(averageGap)}`}>
                {averageGap >= 0 ? '+' : ''}
                {averageGap}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.9fr_1.2fr]">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#3d473f]">Reporting period</span>
              <select
                value={selectedPeriod}
                onChange={(event) => setSelectedPeriod(event.target.value)}
                className="h-12 rounded-2xl border border-black/10 bg-[#fbfaf6] px-4 text-sm text-[#18382f] outline-none transition focus:border-[#1c4d43] focus:ring-2 focus:ring-[#1c4d43]/15"
              >
                {PERIODS.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#3d473f]">Indicator set</span>
              <select
                value={selectedMetric}
                onChange={(event) => setSelectedMetric(event.target.value)}
                className="h-12 rounded-2xl border border-black/10 bg-[#fbfaf6] px-4 text-sm text-[#18382f] outline-none transition focus:border-[#1c4d43] focus:ring-2 focus:ring-[#1c4d43]/15"
              >
                {METRICS.map((metric) => (
                  <option key={metric} value={metric}>
                    {metric}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#3d473f]">Countries</span>
              <div className="flex flex-wrap gap-2 rounded-[22px] border border-black/10 bg-[#fbfaf6] p-3">
                {AVAILABLE_COUNTRIES.map((country) => {
                  const active = selectedCountries.includes(country as CountryName);

                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => handleCountryChange(country as CountryName)}
                      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                        active
                          ? 'bg-[#1c4d43] text-white shadow-[0_10px_20px_rgba(28,77,67,0.18)]'
                          : 'bg-white text-[#28443c] hover:bg-[#efe7ce]'
                      }`}
                    >
                      {country}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
          <article className="rounded-[28px] border border-black/8 bg-white px-5 py-5 shadow-sm sm:px-6">
            <div className="flex flex-col gap-4 border-b border-black/6 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a6f54]">
                  Indicator Performance vs Target
                </p>
                <h2 className="text-xl font-semibold text-[#163c33]">Regional comparison canvas</h2>
                <p className="max-w-2xl text-sm leading-6 text-[#5f5a4d]">
                  A direct visual read of how each selected country is performing against the current target benchmark.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-medium text-[#4b5f58]">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#ecf7f1] px-3 py-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1c7c54]" />
                  Actual
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4cf] px-3 py-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d4a72c]" />
                  Target
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="grid grid-cols-[54px_minmax(0,1fr)] gap-4">
                <div className="flex h-[340px] flex-col justify-between pb-6 pt-1 text-xs font-medium text-[#7a6f54]">
                  {[100, 80, 60, 40, 20, 0].map((mark) => (
                    <span key={mark}>{mark}</span>
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-[24px] bg-[#f8f5ec] px-4 pb-6 pt-4">
                  <div className="pointer-events-none absolute inset-0">
                    {[0, 1, 2, 3, 4].map((line) => (
                      <div
                        key={line}
                        className="absolute left-0 right-0 border-t border-dashed border-black/7"
                        style={{ top: `${line * 20 + 10}%` }}
                      />
                    ))}
                  </div>

                  <div className="relative flex h-[300px] items-end justify-around gap-4 overflow-x-auto pb-2">
                    {metricRows.map((row) => (
                      <div key={row.country} className="flex min-w-[120px] flex-col items-center gap-3">
                        <div className="flex h-full items-end gap-3">
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className="w-10 rounded-t-2xl bg-[#1c7c54] shadow-[0_18px_30px_rgba(28,124,84,0.18)]"
                              style={{ height: `${Math.max(row.actual, 8) * 2.5}px` }}
                            />
                            <span className="text-xs font-semibold text-[#1c7c54]">{row.actual}</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className="w-10 rounded-t-2xl bg-[#d4a72c] shadow-[0_18px_30px_rgba(212,167,44,0.16)]"
                              style={{ height: `${Math.max(row.target, 8) * 2.5}px` }}
                            />
                            <span className="text-xs font-semibold text-[#916b09]">{row.target}</span>
                          </div>
                        </div>
                        <div className="space-y-1 text-center">
                          <p className="text-sm font-semibold text-[#17382f]">{row.country}</p>
                          <p className="text-xs text-[#7a6f54]">{row.region}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-[28px] border border-black/8 bg-white px-5 py-5 shadow-sm sm:px-6">
              <div className="space-y-2 border-b border-black/6 pb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a6f54]">Snapshot</p>
                <h2 className="text-xl font-semibold text-[#163c33]">Comparison summary</h2>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-2xl bg-[#f7f4ea] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a6f54]">Countries</p>
                  <p className="mt-2 text-3xl font-semibold text-[#17382f]">{selectedCountries.length}</p>
                </div>
                <div className="rounded-2xl bg-[#ecf7f1] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4d6c62]">Actual total</p>
                  <p className="mt-2 text-3xl font-semibold text-[#1c7c54]">{totalActual}</p>
                </div>
                <div className="rounded-2xl bg-[#fff4cf] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7e681a]">Target total</p>
                  <p className="mt-2 text-3xl font-semibold text-[#916b09]">{totalTarget}</p>
                </div>
              </div>
            </article>

            <article className="rounded-[28px] border border-black/8 bg-white px-5 py-5 shadow-sm sm:px-6">
              <div className="space-y-2 border-b border-black/6 pb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a6f54]">Target Leaderboard</p>
                <h2 className="text-xl font-semibold text-[#163c33]">Best performing countries</h2>
              </div>

              <div className="mt-5 space-y-4">
                {leaderboard.map((entry, index) => {
                  const progress = Math.min(Math.round((entry.score / Math.max(entry.target, 1)) * 100), 100);

                  return (
                    <div key={entry.country} className="rounded-[22px] bg-[#f8f5ec] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1c4d43] text-sm font-semibold text-white">
                              {index + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#17382f]">{entry.country}</p>
                              <p className="text-xs text-[#7a6f54]">{entry.region}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-[#17382f]">{entry.score}%</p>
                          <p className="text-xs text-[#7a6f54]">Target {entry.target}%</p>
                        </div>
                      </div>
                      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#1c7c54_0%,#d4a72c_100%)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/8 bg-white px-5 py-5 shadow-sm sm:px-6">
          <div className="flex flex-col gap-4 border-b border-black/6 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a6f54]">Variance Report Details</p>
              <h2 className="text-xl font-semibold text-[#163c33]">Country-by-country gap review</h2>
              <p className="max-w-2xl text-sm leading-6 text-[#5f5a4d]">
                Use this table to identify outliers quickly before exporting the comparison set into a policy brief or
                committee pack.
              </p>
            </div>
            <div className="rounded-2xl bg-[#f6f3ea] px-4 py-3 text-sm text-[#5f5a4d]">
              Highest score:
              <span className="ml-2 font-semibold text-[#17382f]">{leaderboard[0]?.country ?? 'N/A'}</span>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-black/6 text-left">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a6f54]">
                  <th className="px-4 py-3">Indicator</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Region</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Actual</th>
                  <th className="px-4 py-3">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/6">
                {metricRows.map((row) => (
                  <tr key={row.country} className="text-sm text-[#24453d]">
                    <td className="px-4 py-4 font-medium">{row.indicator}</td>
                    <td className="px-4 py-4">{row.country}</td>
                    <td className="px-4 py-4">{row.region}</td>
                    <td className="px-4 py-4">{row.target}</td>
                    <td className="px-4 py-4">{row.actual}</td>
                    <td className={`px-4 py-4 font-semibold ${varianceTone(row.variance)}`}>
                      {row.variance >= 0 ? '+' : ''}
                      {row.variance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
