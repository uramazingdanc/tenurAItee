
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPricingPlans, fetchFAQs } from "@/services/pricingService";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const { user } = useAuth();
  
  const { data: plans = [] } = useQuery({
    queryKey: ['pricing-plans'],
    queryFn: fetchPricingPlans,
  });
  
  const { data: faqs = [] } = useQuery({
    queryKey: ['pricing-faqs'],
    queryFn: fetchFAQs,
  });
  
  const getActionButton = (plan: any) => {
    if (!user) {
      if (plan.price === 0) {
        return (
          <Button className="w-full" asChild>
            <Link to="/login?tab=signup">Get Started</Link>
          </Button>
        );
      } else {
        return (
          <Button className="w-full" variant="outline" asChild>
            <Link to="/login?tab=signup">Try Free</Link>
          </Button>
        );
      }
    } else {
      if (plan.price === 0) {
        return (
          <Button className="w-full" disabled>
            Current Plan
          </Button>
        );
      } else {
        return (
          <Button className="w-full">
            Upgrade Now
          </Button>
        );
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for you or your team.
            </p>
            
            <div className="flex justify-center mt-8 mb-12 bg-gray-100 p-1 rounded-full max-w-xs mx-auto">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`py-2 px-6 rounded-full text-sm font-medium ${
                  billingPeriod === "monthly"
                    ? "bg-white shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`py-2 px-6 rounded-full text-sm font-medium ${
                  billingPeriod === "annual"
                    ? "bg-white shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Annual <span className="text-brand-blue">Save 20%</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`bg-white rounded-lg ${
                  plan.most_popular 
                    ? "ring-2 ring-brand-blue shadow-lg relative" 
                    : "border shadow"
                } overflow-hidden`}
              >
                {plan.most_popular && (
                  <div className="bg-brand-blue text-white text-sm font-medium py-1 px-3 absolute top-4 right-4 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-gray-600 mt-2 mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    {plan.is_custom ? (
                      <div className="text-3xl font-bold">Custom Pricing</div>
                    ) : (
                      <div className="flex items-end">
                        <span className="text-4xl font-bold">
                          ${billingPeriod === "annual" ? (plan.price! * 0.8).toFixed(0) : plan.price}
                        </span>
                        <span className="text-gray-500 ml-1 mb-1">
                          {plan.price === 0 ? "" : `/${billingPeriod === "annual" ? "year" : "month"}`}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {getActionButton(plan)}
                  
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex">
                        <Check className="h-5 w-5 text-brand-blue shrink-0 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          {/* FAQs */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;
