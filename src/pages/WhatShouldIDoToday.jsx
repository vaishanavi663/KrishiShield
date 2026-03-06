import { Sprout } from "lucide-react";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api, useAppStore } from '../store/useAppStore';

function buildLocalAdvisory({ onboarding, cropRecommendation, diseaseResult, yieldData, riskLevel }) {
  const recommendations = [];

  if (riskLevel === 'high') {
    recommendations.push({
      titleKey: 'highRiskActionsTitle',
      messageKey: 'highRiskActionsMessage',
      icon: '⚠️',
      priority: 'high',
    });
  }

  if (cropRecommendation?.recommendations?.length) {
    const topCrop = cropRecommendation.recommendations[0];
    recommendations.push({
      titleKey: 'localCropRecommendationTitle',
      messageKey: 'localCropRecommendationMessage',
      vars: { crop: topCrop.name },
      icon: '🌱',
      priority: 'medium',
    });
  }

  if (diseaseResult?.result) {
    const { name, severity } = diseaseResult.result;
    if (severity > 20) {
      recommendations.push({
        titleKey: 'localDiseaseManagementTitle',
        messageKey: 'localDiseaseManagementMessage',
        vars: { diseaseName: name, severity },
        icon: '🩺',
        priority: 'high',
      });
    } else {
      recommendations.push({
        titleKey: 'diseaseCheckTitle',
        messageKey: 'diseaseCheckMessage',
        vars: { diseaseName: name },
        icon: '🔍',
        priority: 'low',
      });
    }
  }

  if (yieldData?.expectedYield) {
    recommendations.push({
      titleKey: 'yieldPlanningTitle',
      messageKey: 'yieldPlanningMessage',
      vars: { expectedYield: yieldData.expectedYield },
      icon: '📈',
      priority: 'medium',
    });
  }

  if (onboarding?.farmSize) {
    const size = parseFloat(onboarding.farmSize);
    if (!Number.isNaN(size) && size > 10) {
      recommendations.push({
        titleKey: 'equipmentCheckTitle',
        messageKey: 'equipmentCheckMessage',
        icon: '🔧',
        priority: 'medium',
      });
    }
  }

  if (!recommendations.length) {
    recommendations.push({
      titleKey: 'generalMonitoringTitle',
      messageKey: 'generalMonitoringMessage',
      icon: '🌾',
      priority: 'low',
    });
  }

  const sorted = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
  });

  return {
    weather: null,
    recommendations: sorted.slice(0, 5),
  };
}

export default function WhatShouldIDoToday() {
  const { t } = useTranslation();
  const { onboarding, cropRecommendation, diseaseResult, yieldData, riskLevel } = useAppStore((s) => ({
    onboarding: s.onboarding,
    cropRecommendation: s.cropRecommendation,
    diseaseResult: s.diseaseResult,
    yieldData: s.yieldData,
    riskLevel: s.riskLevel,
  }));

  const [advisory, setAdvisory] = useState({ weather: null, recommendations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvisory = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await api.getAdvisory().catch((err) => {
          console.error('failed to fetch advisory from backend, falling back to local data', err);
          return null;
        });

        if (data && Array.isArray(data.recommendations)) {
          setAdvisory(data);
        } else {
          const localAdvisory = buildLocalAdvisory({
            onboarding,
            cropRecommendation,
            diseaseResult,
            yieldData,
            riskLevel,
          });
          setAdvisory(localAdvisory);
        }
      } catch (err) {
        console.error('unexpected error while building advisory', err);
        setError(t('Failed to load recommendations'));
        setAdvisory({ weather: null, recommendations: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisory();
    // Refresh advisory every 5 minutes
    const interval = setInterval(fetchAdvisory, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [onboarding, cropRecommendation, diseaseResult, yieldData, riskLevel, t]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50/30';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50/30';
      case 'low':
        return 'border-green-300 bg-green-50/30';
      default:
        return 'border-white/20 bg-white/5';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#16a34a] to-[#15803d] text-white rounded-2xl shadow-lg p-6 space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Sprout className="w-6 h-6" />
          {t('whatShouldIDo')}
        </h2>
        <p className="text-sm text-white/80">
          {t('todaysRecommendations')}
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm">
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          {t('loading')}
        </div>
      )}

      {error && (
        <div className="text-sm bg-red-500/20 border border-red-300 rounded-lg p-3">
          {error}
        </div>
      )}

      {!loading && !error && advisory.recommendations.length === 0 && (
        <div className="text-sm text-white/80">{t('noRecommendations')}</div>
      )}

      {!loading && advisory.recommendations.map((rec, i) => (
        <div 
          key={i} 
          className={`rounded-xl p-4 border-l-4 transition-all hover:shadow-md ${getPriorityColor(rec.priority)}`}
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl flex-shrink-0">{rec.icon || '🌾'}</div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">
                  {t(rec.titleKey || rec.title)}
                </h4>
                {rec.priority && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    rec.priority === 'high' ? 'bg-red-400/30 text-red-100' :
                    rec.priority === 'medium' ? 'bg-yellow-400/30 text-yellow-100' :
                    'bg-green-400/30 text-green-100'
                  }`}>
                    {t(rec.priority)}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/90 mt-1">
                {rec.messageKey ? t(rec.messageKey, rec.vars || {}) : t(rec.message)}
              </p>
            </div>
          </div>
        </div>
      ))}

      {!loading && advisory.weather && (
        <div className="text-xs text-white/60 mt-4 pt-4 border-t border-white/20">
          <p>{t('currentConditions')}: {advisory.weather.temp}°C, {t('humidity')}: {advisory.weather.humidity}%</p>
        </div>
      )}
    </div>
  );
}
        