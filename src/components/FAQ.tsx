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
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-8 text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                className="w-full justify-between p-6 text-left font-medium text-lg hover:bg-muted/50"
                onClick={() => toggleItem(index)}
                aria-expanded={openItems.has(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="pr-4">{faq.question}</span>
                {openItems.has(index) ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0" />
                )}
              </Button>
              
              {openItems.has(index) && (
                <div 
                  id={`faq-answer-${index}`}
                  className="px-6 pb-6 text-muted-foreground leading-relaxed"
                  aria-labelledby={`faq-question-${index}`}
                >
                  <div className="prose prose-sm max-w-none">
                    {faq.answer.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="mb-3 last:mb-0">
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
