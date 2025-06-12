import React from 'react';
import { Link } from 'react-router-dom';
import { typeColors, getTextColorForBackground } from '../../utils/pokemon';

interface TypeBadgeProps {
  type: string;
  clickable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ 
  type, 
  clickable = false, 
  size = 'md' 
}) => {
  const backgroundColor = typeColors[type] || '#68D391';
  const textColor = getTextColorForBackground(backgroundColor);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const badgeContent = (
    <span 
      className={`${sizeClasses[size]} rounded-full font-medium capitalize transition-all duration-200 ${
        clickable ? 'hover:scale-105 hover:shadow-md cursor-pointer' : ''
      }`}
      style={{ 
        backgroundColor, 
        color: textColor,
        boxShadow: clickable ? `0 2px 8px ${backgroundColor}40` : undefined
      }}
    >
      {type}
    </span>
  );

  if (clickable) {
    return (
      <Link 
        to={`/type/${type}`}
        className="transition-transform hover:scale-105"
        aria-label={`View all ${type} type Pokémon`}
      >
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
};