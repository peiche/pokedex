import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: React.ReactNode | string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  defaultExpanded?: string | null;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
  defaultExpanded = null
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    defaultExpanded ? new Set([defaultExpanded]) : new Set()
  );
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Reset accordion when items change (e.g., navigating between Pokemon)
  useEffect(() => {
    setExpandedItems(defaultExpanded ? new Set([defaultExpanded]) : new Set());
  }, [items, defaultExpanded]);

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      
      if (newSet.has(itemId)) {
        // Collapse the item
        newSet.delete(itemId);
      } else {
        // Expand the item
        if (!allowMultiple) {
          // If only one item can be expanded, clear all others
          newSet.clear();
        }
        newSet.add(itemId);
      }
      
      return newSet;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(itemId);
    }
  };

  return (
    <div className={`space-y-2 ${className}`} role="region" aria-label="Accordion">
      {items.map((item) => {
        const isExpanded = expandedItems.has(item.id);
        const contentRef = contentRefs.current[item.id];
        const contentHeight = isExpanded && contentRef ? contentRef.scrollHeight : 0;

        return (
          <div
            key={item.id}
            className="bg-background-light-secondary dark:bg-gray-700 rounded-lg border border-border-light dark:border-gray-600 overflow-hidden transition-all duration-200"
          >
            {/* Accordion Header */}
            <button
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-background-neutral-muted dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              onClick={() => toggleItem(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              aria-expanded={isExpanded}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-header-${item.id}`}
            >
              <div className="flex items-center gap-3 flex-1">
                {item.icon && (
                  <div className="flex-shrink-0 text-gray-600 dark:text-gray-400">
                    {item.icon}
                  </div>
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.title}
                </span>
                {item.badge && (
                  <div className="flex-shrink-0">
                    {item.badge}
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0 ml-2">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
                )}
              </div>
            </button>

            {/* Accordion Content */}
            <div
              style={{
                height: contentHeight,
                transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className="overflow-hidden"
            >
              <div
                ref={(el) => {
                  contentRefs.current[item.id] = el;
                }}
                id={`accordion-content-${item.id}`}
                role="region"
                aria-labelledby={`accordion-header-${item.id}`}
                className="px-4 pb-4 pt-2"
              >
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};