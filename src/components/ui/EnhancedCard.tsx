import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'glass' | 'solid' | 'gradient' | 'neumorphic';
  hover?: boolean;
  animated?: boolean;
  glow?: boolean;
}

export const EnhancedCard: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  style = {},
  variant = 'glass',
  hover = true,
  animated = false,
  glow = false
}) => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';
  
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'glass':
        return {
          background: theme === 'dark' 
            ? 'rgba(17, 25, 40, 0.75)' 
            : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.125)' : 'rgba(255, 255, 255, 0.2)'}`,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
          color: 'white',
          boxShadow: '0 10px 30px rgba(30, 58, 95, 0.2)',
        };
      case 'neumorphic':
        return {
          background: theme === 'dark' ? '#1a1a2e' : '#ffffff',
          boxShadow: theme === 'dark'
            ? '20px 20px 60px #0f0f1e, -20px -20px 60px #252538'
            : '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
        };
      case 'solid':
      default:
        return {
          background: theme === 'dark' ? '#1e293b' : 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        };
    }
  };

  const cardStyles: React.CSSProperties = {
    borderRadius: '20px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ...getVariantStyles(),
    ...style
  };

  const hoverClass = hover ? 'enhanced-card-hover' : '';
  const animatedClass = animated ? 'fade-in' : '';
  const glowClass = glow ? 'card-glow' : '';

  return (
    <div 
      className={`enhanced-card ${variant}-card ${hoverClass} ${animatedClass} ${glowClass} ${className}`} 
      style={cardStyles}
    >
      {animated && (
        <div className="card-shimmer" style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          animation: 'shimmer 3s infinite',
        }} />
      )}
      {children}
    </div>
  );
};

export const EnhancedCardHeader: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  style = {} 
}) => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';
  
  return (
    <div className={`enhanced-card-header ${className}`} style={{
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: `2px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(102, 126, 234, 0.2)'}`,
      ...style
    }}>
      {children}
    </div>
  );
};

export const EnhancedCardTitle: React.FC<CardProps & { gradient?: boolean }> = ({ 
  children, 
  className = '', 
  style = {},
  gradient = false
}) => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';
  
  const titleStyles: React.CSSProperties = gradient ? {
    fontSize: '1.75rem',
    fontWeight: '700',
    margin: 0,
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    ...style
  } : {
    fontSize: '1.75rem',
    fontWeight: '700',
    margin: 0,
    color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
    ...style
  };
  
  return (
    <h3 className={`enhanced-card-title ${className}`} style={titleStyles}>
      {children}
    </h3>
  );
};

export const EnhancedCardContent: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  style = {} 
}) => {
  return (
    <div className={`enhanced-card-content ${className}`} style={{
      animation: 'fadeIn 0.5s ease-in',
      ...style
    }}>
      {children}
    </div>
  );
};

export const EnhancedCardFooter: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  style = {} 
}) => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';
  
  return (
    <div className={`enhanced-card-footer ${className}`} style={{
      marginTop: '20px',
      paddingTop: '12px',
      borderTop: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      ...style
    }}>
      {children}
    </div>
  );
};

// Additional specialized card components
export const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}> = ({ title, value, change, icon, color = 'primary' }) => {
  const context = useContext(ThemeContext);
  const theme = context?.isDark ? 'dark' : 'light';
  
  const getColorGradient = () => {
    switch (color) {
      case 'success': return 'linear-gradient(135deg, #00695c 0%, #4caf50 100%)';
      case 'warning': return 'linear-gradient(135deg, #ff6f00 0%, #ffb74d 100%)';
      case 'danger': return 'linear-gradient(135deg, #c62828 0%, #e57373 100%)';
      default: return 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)';
    }
  };
  
  return (
    <div className="stat-card" style={{
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 0.7))'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(102, 126, 234, 0.2)'}`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ 
            fontSize: '0.875rem', 
            color: theme === 'dark' ? '#94a3b8' : '#64748b',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '600'
          }}>
            {title}
          </p>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: getColorGradient(),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
            animation: 'countUp 1s ease-out',
          }}>
            {value}
          </div>
          {change !== undefined && (
            <div style={{
              marginTop: '8px',
              fontSize: '0.875rem',
              color: change >= 0 ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>{change >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            width: '48px',
            height: '48px',
            background: getColorGradient(),
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(30, 58, 95, 0.2)',
          }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
        animation: 'pulse 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
    </div>
  );
};