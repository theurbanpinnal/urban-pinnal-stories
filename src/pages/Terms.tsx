import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FileText, Shield, Truck, CreditCard, Users, Heart } from "lucide-react";

const Terms = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>Terms of Service - The Urban Pinnal</title>
      <meta name="description" content="Terms of Service for The Urban Pinnal. Read our terms and conditions for using our website and services." />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 text-center">
            <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-craft-terracotta" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Terms of Service
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              The terms and conditions that govern your use of our website and services.
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
              
              {/* Last Updated */}
              <div className="text-center mb-12">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Introduction */}
              <div className="mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Welcome to The Urban Pinnal
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These Terms of Service ("Terms") govern your use of The Urban Pinnal website and services. 
                  By accessing or using our website, you agree to be bound by these Terms. If you disagree 
                  with any part of these terms, you may not access our service.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The Urban Pinnal is a handmade collective that connects skilled artisans from Tamil Nadu 
                  with customers worldwide, offering authentic Indian craftsmanship through contemporary design.
                </p>
              </div>

              {/* Key Sections */}
              <div className="space-y-12">
                
                {/* Account and Registration */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <Users className="w-6 h-6 mr-3 text-craft-terracotta" />
                    Account Registration and Use
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      To access certain features of our website, you may be required to create an account. 
                      You are responsible for maintaining the confidentiality of your account information 
                      and for all activities that occur under your account.
                    </p>
                    <p>
                      You must provide accurate, current, and complete information during registration 
                      and keep your account information updated. You are responsible for safeguarding 
                      your password and for any activities or actions under your account.
                    </p>
                    <p>
                      You agree not to use the service for any unlawful purpose or to solicit others 
                      to perform unlawful acts. You may not use our service to transmit any viruses, 
                      malware, or other harmful code.
                    </p>
                  </div>
                </div>

                {/* Products and Orders */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <Heart className="w-6 h-6 mr-3 text-craft-terracotta" />
                    Products and Orders
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong>Handmade Nature:</strong> All products sold through The Urban Pinnal are 
                      handmade by skilled artisans. As such, each piece may have slight variations in 
                      color, texture, and finish, which are inherent characteristics of handmade items 
                      and should not be considered defects.
                    </p>
                    <p>
                      <strong>Product Availability:</strong> Due to the handmade nature of our products, 
                      availability may be limited. We reserve the right to discontinue any product 
                      at any time without notice.
                    </p>
                    <p>
                      <strong>Product Descriptions:</strong> We strive to provide accurate product 
                      descriptions and images. However, actual colors and details may vary slightly 
                      due to monitor settings and the handmade nature of our products.
                    </p>
                    <p>
                      <strong>Order Acceptance:</strong> All orders are subject to acceptance and 
                      availability. We reserve the right to refuse service to anyone for any reason 
                      at any time.
                    </p>
                  </div>
                </div>

                {/* Pricing and Payment */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <CreditCard className="w-6 h-6 mr-3 text-craft-terracotta" />
                    Pricing and Payment
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong>Pricing:</strong> All prices are listed in Indian Rupees (INR) and 
                      are subject to change without notice. Prices do not include shipping, taxes, 
                      or other applicable fees.
                    </p>
                    <p>
                      <strong>Payment Methods:</strong> We accept various payment methods including 
                      credit cards, debit cards, and digital wallets. All payments must be made 
                      in full at the time of order placement.
                    </p>
                    <p>
                      <strong>Currency:</strong> While prices are displayed in INR, international 
                      customers may see prices converted to their local currency. The final charge 
                      will be in INR at the current exchange rate.
                    </p>
                    <p>
                      <strong>Taxes:</strong> Applicable taxes will be calculated and added to 
                      your order total based on your shipping address and local tax regulations.
                    </p>
                  </div>
                </div>

                {/* Shipping and Delivery */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <Truck className="w-6 h-6 mr-3 text-craft-terracotta" />
                    Shipping and Delivery
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong>Processing Time:</strong> Due to the handmade nature of our products, 
                      processing times may vary. Most orders are processed within 3-5 business days, 
                      but some items may require additional time for completion.
                    </p>
                    <p>
                      <strong>Shipping Methods:</strong> We offer various shipping options including 
                      standard and express delivery. Shipping costs and delivery times are calculated 
                      at checkout based on your location and selected shipping method.
                    </p>
                    <p>
                      <strong>Delivery:</strong> We are not responsible for delays in delivery 
                      caused by circumstances beyond our control, including but not limited to 
                      weather conditions, customs delays, or carrier issues.
                    </p>
                    <p>
                      <strong>International Shipping:</strong> International orders may be subject 
                      to customs duties, taxes, and import fees. These additional costs are the 
                      responsibility of the customer and are not included in our shipping charges.
                    </p>
                  </div>
                </div>

                {/* Returns and Refunds */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-craft-terracotta" />
                    Returns and Refunds
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong>Return Policy:</strong> We accept returns within 14 days of delivery 
                      for items that are defective or damaged during shipping. Due to the handmade 
                      nature of our products, we cannot accept returns for reasons of personal preference.
                    </p>
                    <p>
                      <strong>Return Conditions:</strong> Items must be returned in their original 
                      condition, unused, and with all original packaging and tags intact.
                    </p>
                    <p>
                      <strong>Refund Process:</strong> Once we receive and inspect your return, 
                      we will notify you of the approval or rejection of your refund. If approved, 
                      your refund will be processed within 5-7 business days.
                    </p>
                    <p>
                      <strong>Shipping Costs:</strong> Return shipping costs are the responsibility 
                      of the customer unless the item was received defective or damaged.
                    </p>
                  </div>
                </div>

                {/* Intellectual Property */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    Intellectual Property Rights
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      The content on this website, including but not limited to text, graphics, 
                      images, logos, and software, is the property of The Urban Pinnal or its 
                      content suppliers and is protected by copyright and other intellectual 
                      property laws.
                    </p>
                    <p>
                      You may not reproduce, distribute, modify, or create derivative works from 
                      any content on this website without our express written permission.
                    </p>
                    <p>
                      Product designs and craftsmanship techniques are the intellectual property 
                      of our artisan partners and are protected under applicable laws.
                    </p>
                  </div>
                </div>

                {/* Privacy and Data */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    Privacy and Data Protection
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Your privacy is important to us. Please review our Privacy Policy, which 
                      also governs your use of the website, to understand our practices regarding 
                      the collection and use of your personal information.
                    </p>
                    <p>
                      We collect and process personal data in accordance with applicable data 
                      protection laws and regulations, including the General Data Protection 
                      Regulation (GDPR) where applicable.
                    </p>
                  </div>
                </div>

                {/* Limitation of Liability */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    Limitation of Liability
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      In no event shall The Urban Pinnal, its directors, employees, partners, 
                      agents, suppliers, or affiliates be liable for any indirect, incidental, 
                      special, consequential, or punitive damages, including without limitation, 
                      loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                    <p>
                      Our total liability to you for any claims arising from your use of our 
                      website or services shall not exceed the amount you paid to us in the 
                      twelve months preceding the claim.
                    </p>
                  </div>
                </div>

                {/* Dispute Resolution */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    Dispute Resolution
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Any disputes arising from these Terms or your use of our services will 
                      be resolved through good faith negotiations. If such negotiations fail, 
                      disputes will be resolved through binding arbitration in accordance with 
                      Indian law.
                    </p>
                    <p>
                      These Terms are governed by and construed in accordance with the laws 
                      of India, without regard to its conflict of law provisions.
                    </p>
                  </div>
                </div>

                {/* Changes to Terms */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    Changes to Terms
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      We reserve the right to modify or replace these Terms at any time. 
                      If a revision is material, we will provide at least 30 days notice 
                      prior to any new terms taking effect.
                    </p>
                    <p>
                      Your continued use of our website after any changes constitutes acceptance 
                      of the new Terms. If you do not agree to the new terms, you should stop 
                      using our service.
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      If you have any questions about these Terms of Service, please contact us at:
                    </p>
                    <div className="bg-muted/20 p-6 rounded-lg">
                      <p className="font-medium text-foreground mb-2">The Urban Pinnal</p>
                      <p>Email: support@theurbanpinnal.com</p>
                      <p>Website: www.theurbanpinnal.com</p>
                      <p>Location: Chennai, Tamil Nadu, India</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Note */}
              <div className="mt-16 p-6 bg-craft-terracotta/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  By using our website, you acknowledge that you have read, understood, and agree 
                  to be bound by these Terms of Service. Thank you for supporting authentic 
                  Indian craftsmanship.
                </p>
              </div>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Terms;


