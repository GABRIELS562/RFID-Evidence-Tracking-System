import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style = {} }) => {
  return (
    <div className={`card ${className}`} style={{
      background: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      ...style
    }}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', style = {} }) => {
  return (
    <div className={`card-header ${className}`} style={{
      marginBottom: '15px',
      ...style
    }}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '', style = {} }) => {
  return (
    <h3 className={`card-title ${className}`} style={{
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: 0,
      ...style
    }}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '', style = {} }) => {
  return (
    <div className={`card-content ${className}`} style={style}>
      {children}
    </div>
  );
};