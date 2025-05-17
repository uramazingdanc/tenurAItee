
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchFeatures } from "@/services/tierService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Features = () => {
  const { user } = useAuth();
  
  const { data: features = [] } = useQuery({
    queryKey: ['features', !!user],
    queryFn: () => fetchFeatures(!!user),
  });

  const freeTierFeatures = features.filter(feature => !feature.is_premium);
  const premiumTierFeatures = features.filter(feature => feature.is_premium);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Features that make training effective
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides all the tools you need to train customer service
              representatives like tenured agents.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            {/* Free Tier */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-brand-blue">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">🟦 Free Tier</h2>
                <div className="bg-brand-blue/10 text-brand-blue font-medium py-1 px-4 rounded-full">
                  Free
                </div>
              </div>
              
              <ul className="space-y-6">
                {freeTierFeatures.map((feature) => (
                  <li key={feature.id} className="flex">
                    <div className="mr-4 text-2xl" dangerouslySetInnerHTML={{ __html: feature.icon }} />
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{feature.name}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Premium Tier */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-amber-400">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">🟨 Paid Tier</h2>
                <div className="bg-amber-400/10 text-amber-600 font-medium py-1 px-4 rounded-full">
                  Premium
                </div>
              </div>
              
              <ul className="space-y-6">
                {premiumTierFeatures.map((feature) => (
                  <li key={feature.id} className="flex">
                    <div className="mr-4 text-2xl" dangerouslySetInnerHTML={{ __html: feature.icon }} />
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{feature.name}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Features;
