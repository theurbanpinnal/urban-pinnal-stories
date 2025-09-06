import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import Breadcrumb from '@/components/Breadcrumb';
import { useCanonicalUrl } from '@/hooks/use-canonical-url';

const FAQPage: React.FC = () => {
  // Set canonical URL for FAQ page
  useCanonicalUrl();

  const faqs = [
    {
      question: "What makes The Urban Pinnal products unique?",
      answer: "Our products are handcrafted by skilled artisans from Tamil Nadu villages using traditional techniques passed down through generations. Each piece is made with natural materials like cane, bamboo, and recycled plastic, ensuring sustainability while preserving cultural heritage."
    },
    {
      question: "How do you ensure the quality of your handmade products?",
      answer: "We work directly with master craftspeople and NGOs across Tamil Nadu. Each product undergoes quality checks, and we maintain close relationships with our artisans to ensure consistent craftsmanship. Our products come with quality guarantees and are built to last."
    },
    {
      question: "What materials do you use in your products?",
      answer: "We use only natural and sustainable materials including cane, bamboo, recycled plastic, and natural dyes derived from plants and minerals. All materials are sourced ethically and locally from Tamil Nadu, supporting the local economy and reducing environmental impact."
    },
    {
      question: "How long does shipping take within India?",
      answer: "We offer fast and secure shipping across India. Standard delivery takes 3-5 business days for metro cities and 5-7 business days for other locations. We provide tracking information for all orders and ensure careful packaging to protect your handcrafted items."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship internationally to select countries. International shipping typically takes 7-14 business days depending on the destination. Please contact us for specific shipping rates and delivery times to your location."
    },
    {
      question: "What is your return and exchange policy?",
      answer: "We offer a 15-day return policy for unused items in original packaging. Due to the handmade nature of our products, we cannot accept returns for custom or personalized items. Exchanges are available for size or color variations, subject to availability."
    },
    {
      question: "How do you support women artisans in Tamil Nadu?",
      answer: "We partner with rural craftswomen and NGOs across Tamil Nadu, providing fair wages, skill development opportunities, and market access. Our mission is to empower women artisans economically while preserving traditional craft techniques and cultural heritage."
    },
    {
      question: "Are your products eco-friendly and sustainable?",
      answer: "Absolutely! We prioritize sustainability in every aspect of our business. Our products use natural materials, traditional techniques that require minimal energy, and we support local communities. We're committed to reducing environmental impact while creating beautiful, functional products."
    },
    {
      question: "Can I customize or personalize products?",
      answer: "Yes, we offer customization options for many of our products. You can request specific colors, sizes, or personalization. Custom orders may take 2-3 weeks to complete. Please contact us with your requirements and we'll work with our artisans to create something special for you."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is processed, you'll receive a confirmation email with tracking information. You can track your package using the provided tracking number on our website or the courier's website. We'll also send updates at key stages of delivery."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including credit cards, debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our payment partners. We also offer cash on delivery for select locations."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team via email at hello@theurbanpinnal.com or through our contact form. We typically respond within 24 hours. You can also connect with us on social media for quick updates and product information."
    }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <title>FAQ - The Urban Pinnal | Handmade Crafts Questions & Answers</title>
      <meta name="description" content="Find answers to frequently asked questions about The Urban Pinnal's handmade products, shipping, returns, artisan support, and sustainability practices." />
      <meta name="keywords" content="FAQ, handmade crafts questions, Tamil Nadu artisans, shipping information, return policy, sustainable products, women empowerment" />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb 
            items={[
              { name: 'FAQ', url: '/faq' }
            ]} 
          />
        </div>
        
        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <FAQ faqs={faqs} />
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default FAQPage;
