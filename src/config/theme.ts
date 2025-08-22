export interface ThemeColors {
  primary: string;
  primaryLight: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Text colors
  text: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  
  // Background colors
  background: string;
  backgroundPaper: string;
  backgroundElevated: string;
  
  // Border colors
  border: string;
  
  // Other
  hover: string;
  surface: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  fonts: {
    mono: string;
  };
  mode: 'light' | 'dark';
  isDark: boolean;
}

export const lightTheme: ThemeConfig = {
  mode: 'light',
  isDark: false,
  colors: {
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    secondary: '#8b5cf6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    
    text: '#1f2937',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textDisabled: '#9ca3af',
    
    background: '#ffffff',
    backgroundPaper: '#f9fafb',
    backgroundElevated: '#f3f4f6',
    
    border: '#e5e7eb',
    hover: '#f3f4f6',
    surface: '#ffffff',
  },
  fonts: {
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
};

export const darkTheme: ThemeConfig = {
  mode: 'dark',
  isDark: true,
  colors: {
    primary: '#60a5fa',
    primaryLight: '#93c5fd',
    secondary: '#a78bfa',
    success: '#34d399',
    error: '#f87171',
    warning: '#fbbf24',
    info: '#22d3ee',
    
    text: '#f9fafb',
    textPrimary: '#ffffff',
    textSecondary: '#d1d5db',
    textDisabled: '#6b7280',
    
    background: '#111827',
    backgroundPaper: '#1f2937',
    backgroundElevated: '#374151',
    
    border: '#374151',
    hover: '#374151',
    surface: '#1f2937',
  },
  fonts: {
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
};

export const getTheme = (mode: 'light' | 'dark'): ThemeConfig => {
  return mode === 'dark' ? darkTheme : lightTheme;
};