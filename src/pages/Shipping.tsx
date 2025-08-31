import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Truck, Clock, Shield, XCircle, CheckCircle, AlertCircle, Package, Globe } from "lucide-react";

const Shipping = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>Shipping & Returns - The Urban Pinnal</title>
      <meta name="description" content="Shipping and returns information for The Urban Pinnal. Learn about our delivery options and return policy." />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6 text-center">
            <div className="w-16 h-16 mx-auto bg-craft-terracotta/10 rounded-full flex items-center justify-center mb-6">
              <Truck className="w-8 h-8 text-craft-terracotta" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              Shipping & Returns
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Information about our shipping options, delivery times, and return policy for handmade products.
            </p>
          </div>
        </section>

        {/* Shipping & Returns Content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-16">
              
              {/* Order Processing */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8 flex items-center">
                  <Clock className="w-8 h-8 mr-4 text-craft-terracotta" />
                  Order Processing & Dispatch
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-muted/20 p-6 rounded-lg">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Ready Stock Items
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Products with readily available stock are dispatched within <strong>2 working days</strong> 
                      of order confirmation. This includes most of our standard handmade products that are 
                      already crafted and ready for shipping.
                    </p>
                  </div>
                  
                  <div className="bg-muted/20 p-6 rounded-lg">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                      Custom Orders
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Custom or made-to-order items require additional time for crafting. Processing times 
                      vary based on complexity and artisan availability. You'll receive specific timelines 
                      upon order confirmation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Options */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8 flex items-center">
                  <Truck className="w-8 h-8 mr-4 text-craft-terracotta" />
                  Shipping Options & Delivery Times
                </h2>
                
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Shipping times depend on your delivery destination. We offer multiple shipping options 
                    to meet your needs:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-muted p-6 rounded-lg">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Domestic Shipping (India)</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center">
                          <Package className="w-4 h-4 mr-2 text-craft-terracotta" />
                          <span><strong>Standard:</strong> 3-5 business days</span>
                        </li>
                        <li className="flex items-center">
                          <Package className="w-4 h-4 mr-2 text-craft-terracotta" />
                          <span><strong>Express:</strong> 1-2 business days</span>
                        </li>
                        <li className="flex items-center">
                          <Package className="w-4 h-4 mr-2 text-craft-terracotta" />
                          <span><strong>Same Day:</strong> Available in select cities</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border border-muted p-6 rounded-lg">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-3">International Shipping</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-craft-terracotta" />
                          <span><strong>Standard:</strong> 7-14 business days</span>
                        </li>
                        <li className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-craft-terracotta" />
                          <span><strong>Express:</strong> 3-7 business days</span>
                        </li>
                        <li className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-craft-terracotta" />
                          <span><strong>Premium:</strong> 1-3 business days</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-craft-terracotta/10 p-6 rounded-lg">
                    <h4 className="font-serif text-lg font-semibold text-foreground mb-3">Important Notes:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Delivery times start from the date of dispatch, not order placement</li>
                      <li>• International orders may be subject to customs delays</li>
                      <li>• Remote locations may require additional delivery time</li>
                      <li>• Weather conditions and holidays may affect delivery schedules</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Order Cancellation */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8 flex items-center">
                  <XCircle className="w-8 h-8 mr-4 text-craft-terracotta" />
                  Order Cancellation Policy
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                                             <h3 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center">
                         <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                         Cancellation Window
                       </h3>
                       <p className="text-muted-foreground leading-relaxed">
                         For standard orders, you have a <strong>24-48 hour window</strong> to cancel your order 
                         after placement, but <strong>before dispatch</strong>. Once your order has been dispatched, 
                         it cannot be cancelled. Cancellation requests must be submitted via email or phone during 
                         business hours.
                       </p>
                       <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                         <li>• Cancellation requests processed within 24 hours</li>
                         <li>• Orders cannot be cancelled after dispatch</li>
                         <li>• Full refund issued for cancelled orders</li>
                         <li>• No cancellation fees for standard orders</li>
                       </ul>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center">
                        <XCircle className="w-5 h-5 mr-2 text-red-600" />
                        Custom Orders
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        <strong>Custom orders cannot be cancelled</strong> once confirmed. These orders are 
                        crafted specifically for you and work begins immediately upon confirmation.
                      </p>
                      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <li>• No cancellation policy for custom orders</li>
                        <li>• Not eligible for refunds</li>
                        <li>• Crafted specifically to your specifications</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/20 p-6 rounded-lg">
                    <h4 className="font-serif text-lg font-semibold text-foreground mb-3">How to Cancel:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                      <div>
                        <p><strong>Email:</strong> hello@theurbanpinnal.com</p>
                        <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                        <p><strong>Subject:</strong> "Order Cancellation - [Order Number]"</p>
                      </div>
                      <div>
                        <p><strong>Include:</strong></p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Order number</li>
                          <li>Reason for cancellation</li>
                          <li>Preferred refund method</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Returns & Refunds */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8 flex items-center">
                  <Shield className="w-8 h-8 mr-4 text-craft-terracotta" />
                  Returns & Refunds Policy
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-muted/20 p-6 rounded-lg">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                      Manufacturing Defects Only
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Due to the handmade nature of our products, we only accept returns and provide 
                      refunds for <strong>manufacturing defects</strong>. Each piece is unique and may 
                      have natural variations that are inherent to handmade craftsmanship.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">What Qualifies as a Defect:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Structural damage affecting functionality</li>
                          <li>• Material defects (tears, holes, broken parts)</li>
                          <li>• Manufacturing errors in assembly</li>
                          <li>• Quality issues that affect product safety</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">What Doesn't Qualify:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Natural color variations</li>
                          <li>• Slight size differences</li>
                          <li>• Personal preference changes</li>
                          <li>• Minor texture variations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border border-muted p-6 rounded-lg">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Return Process</h3>
                      <ol className="space-y-3 text-muted-foreground">
                        <li className="flex items-start">
                          <span className="bg-craft-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                          <span>Contact us within 7 days of delivery</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-craft-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                          <span>Provide photos and description of the defect</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-craft-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                          <span>We'll review and provide return authorization</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-craft-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                          <span>Ship item back in original packaging</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-craft-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">5</span>
                          <span>Refund processed within 5-7 business days</span>
                        </li>
                      </ol>
                    </div>
                    
                    <div className="border border-muted p-6 rounded-lg">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Refund Information</h3>
                      <div className="space-y-4 text-muted-foreground">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Refund Timeline:</h4>
                          <p>5-7 business days after we receive and inspect the returned item</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">What's Refunded:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Full product price</li>
                            <li>• Original shipping costs</li>
                            <li>• Return shipping costs (for defects)</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Refund Method:</h4>
                          <p>Refunds are issued to the original payment method used for the purchase.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Costs */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                  Shipping Costs
                </h2>
                
                <div className="bg-muted/20 p-8 rounded-lg text-center">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                    Dynamic Shipping Calculation
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Shipping costs are calculated at checkout based on your delivery destination, 
                    package weight, and selected shipping method. This ensures you get the most 
                    accurate and competitive rates for your location.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <Package className="w-8 h-8 mx-auto mb-3 text-craft-terracotta" />
                      <h4 className="font-semibold text-foreground mb-2">Destination Based</h4>
                      <p className="text-sm text-muted-foreground">Rates vary by location and distance</p>
                    </div>
                    <div className="text-center">
                      <Truck className="w-8 h-8 mx-auto mb-3 text-craft-terracotta" />
                      <h4 className="font-semibold text-foreground mb-2">Multiple Options</h4>
                      <p className="text-sm text-muted-foreground">Standard, express, and premium delivery</p>
                    </div>
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 mx-auto mb-3 text-craft-terracotta" />
                      <h4 className="font-semibold text-foreground mb-2">Free Shipping</h4>
                      <p className="text-sm text-muted-foreground">Available on orders above certain thresholds</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-craft-terracotta/10 p-6 rounded-lg">
                  <h4 className="font-serif text-lg font-semibold text-foreground mb-3">What Affects Shipping Costs:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Delivery Location:</strong> Domestic vs international destinations</li>
                    <li>• <strong>Package Weight:</strong> Heavier items may incur additional charges</li>
                    <li>• <strong>Shipping Speed:</strong> Faster delivery options cost more</li>
                    <li>• <strong>Special Handling:</strong> Fragile or oversized items may require special packaging</li>
                    <li>• <strong>Customs & Duties:</strong> International orders may have additional fees</li>
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                  Need Help?
                </h2>
                
                <div className="bg-craft-terracotta/10 p-8 rounded-lg text-center">
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                    Contact Our Customer Service Team
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground mb-2">Email Support</p>
                      <p>support@theurbanpinnal.com</p>
                      <p className="text-sm">Response within 24 hours</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">Phone Support</p>
                      <p>+91 98842 15963</p>
                      <p className="text-sm">Mon-Sat, 9 AM - 6 PM IST</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2">WhatsApp Support</p>
                      <p>+91 98842 15963</p>
                      <p className="text-sm">Quick responses available</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Shipping;


