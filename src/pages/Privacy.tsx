import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Database, Globe, Users, Bell, Settings } from "lucide-react";

const Privacy = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>Privacy Policy - The Urban Pinnal</title>
      <meta name="description" content="Privacy Policy for The Urban Pinnal. Learn how we protect and handle your personal information." />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 text-center">
            <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-craft-terracotta" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
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
                  Privacy Policy for The Urban Pinnal
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At The Urban Pinnal, we are committed to protecting your privacy and ensuring the security 
                  of your personal information. This Privacy Policy explains how we collect, use, disclose, 
                  and safeguard your information when you visit our website or make a purchase.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We use Shopify as our e-commerce platform to process orders and store customer information. 
                  Shopify adheres to comprehensive data governance policies and security standards, which we 
                  fully support and comply with.
                </p>
              </div>

              {/* Key Sections */}
              <div className="space-y-12">
                
                {/* Information We Collect */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <Database className="w-6 h-6 mr-3 text-craft-terracotta" />
                    Information We Collect
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong>Personal Information:</strong> When you create an account, make a purchase, or 
                      contact us, we may collect:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Name, email address, and phone number</li>
                      <li>Billing and shipping addresses</li>
                      <li>Payment information (processed securely through Shopify)</li>
                      <li>Order history and preferences</li>
                      <li>Communication records with our customer service team</li>
                    </ul>
                    
                    <p>
                      <strong>Automatically Collected Information:</strong> When you visit our website, 
                      we automatically collect:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Pages visited and time spent on our website</li>
                      <li>Referring website information</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>

                {/* How We Use Your Information */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <Settings className="w-6 h-6 mr-3 text-craft-terracotta" />
                    How We Use Your Information
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We use your information for the following purposes:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Order Processing:</strong> To process and fulfill your orders, including payment processing and shipping</li>
                      <li><strong>Customer Service:</strong> To respond to your inquiries and provide support</li>
                      <li><strong>Account Management:</strong> To maintain your account and provide personalized experiences</li>
                      <li><strong>Marketing:</strong> To send you promotional materials (with your consent)</li>
                      <li><strong>Website Improvement:</strong> To analyze website usage and improve our services</li>
                      <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                      <li><strong>Artisan Support:</strong> To coordinate with our artisan partners for order fulfillment</li>
                    </ul>
                  </div>
                </div>

                {/* Shopify Data Handling */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <Lock className="w-6 h-6 mr-3 text-craft-terracotta" />
                    Shopify Data Handling and Governance
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong>Shopify Platform:</strong> We use Shopify as our e-commerce platform to process 
                      orders and store customer information. Shopify is a trusted global e-commerce platform 
                      that adheres to comprehensive data governance policies and security standards.
                    </p>
                    
                    <div className="bg-muted/20 p-6 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">Shopify's Data Governance Compliance:</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>GDPR Compliance:</strong> Shopify complies with the General Data Protection Regulation (GDPR)</li>
                        <li><strong>CCPA Compliance:</strong> Shopify adheres to the California Consumer Privacy Act (CCPA)</li>
                        <li><strong>PCI DSS:</strong> Shopify is certified as a Level 1 PCI DSS compliant service provider</li>
                        <li><strong>SOC 2 Type II:</strong> Shopify maintains SOC 2 Type II certification for security controls</li>
                        <li><strong>ISO 27001:</strong> Shopify is certified under ISO 27001 for information security management</li>
                        <li><strong>Data Residency:</strong> Shopify offers data residency options to meet regional requirements</li>
                      </ul>
                    </div>
                    
                    <p>
                      <strong>Data Processing:</strong> When you make a purchase, your information is processed 
                      through Shopify's secure infrastructure, which includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Encrypted data transmission (TLS 1.2+)</li>
                      <li>Secure payment processing</li>
                      <li>Regular security audits and penetration testing</li>
                      <li>24/7 security monitoring</li>
                      <li>Automatic backups and disaster recovery</li>
                    </ul>
                  </div>
                </div>

                {/* Information Sharing */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <Users className="w-6 h-6 mr-3 text-craft-terracotta" />
                    Information Sharing and Disclosure
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground">Service Providers:</h4>
                        <ul className="list-disc pl-6 space-y-1">
                          <li><strong>Shopify:</strong> For order processing, payment processing, and customer data storage</li>
                          <li><strong>Shipping Partners:</strong> To fulfill and deliver your orders</li>
                          <li><strong>Artisan Partners:</strong> Limited order information for product fulfillment</li>
                          <li><strong>Customer Service Tools:</strong> To provide support and communication</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">Legal Requirements:</h4>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>To comply with applicable laws and regulations</li>
                          <li>To respond to legal requests and court orders</li>
                          <li>To protect our rights, property, or safety</li>
                          <li>To investigate potential fraud or security threats</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">Business Transfers:</h4>
                        <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Security */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-craft-terracotta" />
                    Data Security and Protection
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      We implement appropriate technical and organizational measures to protect your personal information:
                    </p>
                    
                    <div className="bg-muted/20 p-6 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">Security Measures:</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                        <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
                        <li><strong>Regular Audits:</strong> Periodic security assessments and vulnerability scans</li>
                        <li><strong>Employee Training:</strong> Regular training on data protection and privacy</li>
                        <li><strong>Incident Response:</strong> Procedures for handling data breaches and security incidents</li>
                        <li><strong>Shopify Security:</strong> Leveraging Shopify's enterprise-grade security infrastructure</li>
                      </ul>
                    </div>
                    
                    <p>
                      <strong>Data Retention:</strong> We retain your personal information only as long as necessary 
                      to fulfill the purposes outlined in this policy or as required by law. Order information 
                      is typically retained for 7 years for accounting and tax purposes.
                    </p>
                  </div>
                </div>

                {/* Your Rights */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <Eye className="w-6 h-6 mr-3 text-craft-terracotta" />
                    Your Privacy Rights
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground">Access and Portability:</h4>
                        <p>You have the right to access your personal information and receive a copy in a portable format.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">Correction:</h4>
                        <p>You can request correction of inaccurate or incomplete personal information.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">Deletion:</h4>
                        <p>You may request deletion of your personal information, subject to legal requirements.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">Restriction:</h4>
                        <p>You can request restriction of processing in certain circumstances.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">Objection:</h4>
                        <p>You have the right to object to processing based on legitimate interests.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">Withdrawal of Consent:</h4>
                        <p>You can withdraw consent for marketing communications at any time.</p>
                      </div>
                    </div>
                    
                    <p>
                      To exercise these rights, please contact us using the information provided below. 
                      We will respond to your request within 30 days.
                    </p>
                  </div>
                </div>

                {/* Cookies and Tracking */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    Cookies and Tracking Technologies
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      We use cookies and similar tracking technologies to enhance your browsing experience:
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground">Essential Cookies:</h4>
                        <p>Required for website functionality, including shopping cart and checkout processes.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">Analytics Cookies:</h4>
                        <p>Help us understand how visitors use our website to improve our services.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">Marketing Cookies:</h4>
                        <p>Used to deliver relevant advertisements and track marketing campaign effectiveness.</p>
                      </div>
                    </div>
                    
                    <p>
                      You can control cookie settings through your browser preferences. However, 
                      disabling certain cookies may affect website functionality.
                    </p>
                  </div>
                </div>

                {/* International Transfers */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center">
                    <Globe className="w-6 h-6 mr-3 text-craft-terracotta" />
                    International Data Transfers
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      As a global business, your information may be transferred to and processed in 
                      countries other than your own. We ensure appropriate safeguards are in place:
                    </p>
                    
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Shopify's Global Infrastructure:</strong> Shopify operates data centers worldwide with appropriate safeguards</li>
                      <li><strong>Adequacy Decisions:</strong> We rely on adequacy decisions for data transfers to certain countries</li>
                      <li><strong>Standard Contractual Clauses:</strong> We use SCCs for transfers to countries without adequacy decisions</li>
                      <li><strong>Data Residency Options:</strong> Shopify offers data residency options to meet regional requirements</li>
                    </ul>
                  </div>
                </div>

                {/* Children's Privacy */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    Children's Privacy
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Our website is not intended for children under the age of 16. We do not knowingly 
                      collect personal information from children under 16. If you believe we have collected 
                      information from a child under 16, please contact us immediately.
                    </p>
                  </div>
                </div>

                {/* Changes to Privacy Policy */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    Changes to This Privacy Policy
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      We may update this Privacy Policy from time to time to reflect changes in our 
                      practices or applicable laws. We will notify you of any material changes by:
                    </p>
                    
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Posting the updated policy on our website</li>
                      <li>Sending email notifications to registered users</li>
                      <li>Displaying prominent notices on our website</li>
                    </ul>
                    
                    <p>
                      Your continued use of our website after any changes constitutes acceptance 
                      of the updated Privacy Policy.
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                    Contact Us
                  </h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      If you have any questions about this Privacy Policy or our data practices, 
                      please contact us:
                    </p>
                    
                    <div className="bg-muted/20 p-6 rounded-lg">
                      <p className="font-medium text-foreground mb-2">The Urban Pinnal</p>
                      <p>Email: support@theurbanpinnal.com</p>
                      <p>Website: www.theurbanpinnal.com</p>
                      <p>Address: Chennai, Tamil Nadu, India</p>
                      <p className="mt-4 text-sm">
                        <strong>Data Protection Officer:</strong> For GDPR-related inquiries, 
                        please contact our Data Protection Officer at support@theurbanpinnal.com
                      </p>
                    </div>
                    
                    <p>
                      <strong>Shopify Support:</strong> For technical issues related to Shopify's 
                      platform, you may also contact Shopify's support team directly.
                    </p>
                  </div>
                </div>

              </div>

              {/* Footer Note */}
              <div className="mt-16 p-6 bg-craft-terracotta/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  This Privacy Policy is effective as of the date listed above. We are committed to 
                  protecting your privacy and ensuring transparency in our data practices. Thank you 
                  for trusting The Urban Pinnal with your information.
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

export default Privacy;


