import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  className?: string;
}

const FAQ: React.FC<FAQProps> = ({ faqs, className = '' }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // Generate FAQ structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq, index) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      {/* FAQ Component */}
      <div className={`space-y-4 ${className}`}>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-6 sm:mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden shadow-sm">
              <div
                className={`w-full p-4 sm:p-6 text-left font-serif font-medium text-base sm:text-lg min-h-[44px] touch-manipulation cursor-pointer ${
                  openItems.has(index)
                    ? 'bg-craft-terracotta text-craft-ivory hover:bg-craft-terracotta/80 hover:text-white'
                    : 'hover:bg-muted/50 hover:text-foreground'
                }`}
                onClick={() => toggleItem(index)}
                aria-expanded={openItems.has(index)}
                aria-controls={`faq-answer-${index}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleItem(index);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="leading-snug break-words flex-1">{faq.question}</span>
                  <div className="flex-shrink-0 mt-1">
                    {openItems.has(index) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {openItems.has(index) && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-6 text-muted-foreground font-sans leading-relaxed"
                  aria-labelledby={`faq-question-${index}`}
                >
                  <div className="prose prose-sm max-w-none">
                    {faq.answer.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="mb-3 last:mb-0 text-sm sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
