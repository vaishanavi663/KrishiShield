import React, { useEffect, useState } from 'react'
import { api } from '../store/useAppStore'
import { useTranslation } from 'react-i18next'

function SummaryCard({ title, value, delta }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="text-xs text-forest-500">{title}</div>
      <div className="text-2xl font-semibold text-forest-800">{value}</div>
      {delta && <div className="text-xs text-forest-500">{delta}</div>}
    </div>
  )
}

export default function ProfitReportsPage() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.profitReport()
      .then(data => {
        setSummary(data.summary || []);
        setRows(data.rows || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('Profit Reports')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {summary.map(s => (
          <SummaryCard key={s.title} {...s} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-forest-50 text-forest-600">
            <tr>
              <th className="text-left px-4 py-3">{t('Crop')}</th>
              <th className="text-right px-4 py-3">{t('Revenue')}</th>
              <th className="text-right px-4 py-3">{t('Cost')}</th>
              <th className="text-right px-4 py-3">{t('Profit')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.crop} className="border-t">
                <td className="px-4 py-3">{r.crop}</td>
                <td className="px-4 py-3 text-right">{r.revenue}</td>
                <td className="px-4 py-3 text-right">{r.cost}</td>
                <td className="px-4 py-3 text-right font-semibold">{r.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-forest-500">{t('Tip: Use seasonal price estimates and input costs to refine profit forecasts.')}</div>
    </div>
  )
}
