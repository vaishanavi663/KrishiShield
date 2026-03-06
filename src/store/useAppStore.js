import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import axios from 'axios'

// API client that points at our backend; configure base URL via VITE_API_URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// automatically include token when available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('krishi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  register: (data) => apiClient.post('/auth/register', data).then(r => r.data),
  login: (data) => apiClient.post('/auth/login', data).then(r => r.data),
  saveOnboarding: (data) => apiClient.post('/auth/onboarding', data).then(r => r.data),

  analyzeCrop: (params) => apiClient.post('/analyze-crop', params).then(r => r.data),
  detectDisease: (info) => {
    const form = new FormData();
    if (info.imageFile) form.append('image', info.imageFile);
    if (info.crop) form.append('crop', info.crop);
    if (info.imageUrl) form.append('imageUrl', info.imageUrl);
    return apiClient.post('/detect-disease', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
  },

  weatherForecast: (lat, lon) => apiClient.get('/weather-forecast', { params: { lat, lon } }).then(r => r.data),
  yieldEstimate: (params) => apiClient.post('/yield', params).then(r => r.data),
  profitReport: () => apiClient.get('/profit-report').then(r => r.data),
  simulate: (params) => apiClient.post('/simulate', params).then(r => r.data),

  getAdvisory: () => apiClient.get('/advisory/today').then(r => r.data),
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      token: null,
      isAuthenticated: false,
      language: 'en',

//language
  language: localStorage.getItem("language") || "en",

  setLanguage: (lang) => {
    localStorage.setItem("language", lang)
    set({ language: lang })
  },

      // Onboarding data
      onboarding: {
        landType: '',
        state: '',
        requirement: '',
        farmSize: '',
      },

      // Analysis results
      cropRecommendation: null,
      diseaseResult: null,
      yieldData: null,
      riskLevel: 'medium',

      // Actions
      login: async (credentials) => {
        const data = await api.login(credentials);
        // populate onboarding values if provided by server
        const onboard = {
          landType: data.user.landType || '',
          state: data.user.state || '',
          requirement: data.user.requirement || '',
          farmSize: data.user.farmSize || ''
        };
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          onboarding: onboard
        });
        localStorage.setItem('krishi_token', data.token);
        localStorage.setItem('token', data.token);
        return data;
      },      register: async (details) => {
        const data = await api.register(details);
        const onboard = {
          landType: data.user.landType || '',
          state: data.user.state || '',
          requirement: data.user.requirement || '',
          farmSize: data.user.farmSize || ''
        };
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          onboarding: onboard
        });
        localStorage.setItem('krishi_token', data.token);
        localStorage.setItem('token', data.token);
        return data;
      },
      logout: () => {
        localStorage.removeItem('krishi_token');
        set({ user: null, token: null, isAuthenticated: false, cropRecommendation: null, diseaseResult: null });
      },

      setLanguage: (lang) => set({ language: lang }),

      updateOnboarding: (data) => set((s) => ({
        onboarding: { ...s.onboarding, ...data }
      })),

      saveOnboarding: async (data) => {
        const resp = await api.saveOnboarding(data);
        // update store with returned user and onboarding fields
        const updated = resp.user;
        const onboard = {
          landType: updated.landType || '',
          state: updated.state || '',
          requirement: updated.requirement || '',
          farmSize: updated.farmSize || ''
        };
        set({ user: { ...get().user, ...updated }, onboarding: onboard });
        return resp;
      },

      setCropRecommendation: (data) => set({ cropRecommendation: data }),
      setDiseaseResult: (data) => set({ diseaseResult: data }),
      setYieldData: (data) => set({ yieldData: data }),
      setRiskLevel: (level) => set({ riskLevel: level }),
    }),
    { name: 'krishishield-store', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated, language: s.language, onboarding: s.onboarding }) }
  )
)

