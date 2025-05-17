
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative pt-20 pb-10 md:pt-32 md:pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 heading-gradient">
              AI-Powered Training for Customer Service Excellence
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Train your customer service representatives with interactive AI scenarios, voice simulations, and adaptive learning. Perfect for travel account handling professionals.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button className="bg-brand-blue hover:bg-brand-blue-dark text-white font-medium py-2 px-6 rounded-lg" size="lg" asChild>
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10" asChild>
                <Link to="/demo">Watch Demo</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-brand-blue-light"></div>
                <div className="w-8 h-8 rounded-full bg-brand-blue"></div>
                <div className="w-8 h-8 rounded-full bg-brand-blue-dark"></div>
              </div>
              <span className="ml-3 text-sm text-gray-500">Trusted by 1,000+ customer service teams</span>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <div className="relative">
              <div className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-500">Call Simulation</div>
                </div>
                <div className="p-6">
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-brand-blue-light flex items-center justify-center text-white font-medium">AI</div>
                      <span className="ml-2 font-medium">Customer</span>
                    </div>
                    <p className="text-gray-700">
                      "I need to cancel my flight booking for next week. How do I get a refund?"
                    </p>
                  </div>
                  <div className="mb-4 p-4 bg-brand-blue/10 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white font-medium">You</div>
                      <span className="ml-2 font-medium">Agent</span>
                    </div>
                    <p className="text-gray-700">
                      "I understand you need to cancel your booking. I'd be happy to help with that. Could you please provide me with your booking reference number?"
                    </p>
                  </div>
                  <div className="flex items-center mt-4 relative">
                    <div className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-brand-blue text-gray-500">
                      Type your response...
                    </div>
                    <Button className="ml-2 bg-brand-blue w-10 h-10 p-2 rounded-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-4 right-4 bottom-4 bg-brand-blue/20 rounded-xl -z-10"></div>
              <div className="absolute top-8 left-8 right-8 bottom-8 bg-brand-green/10 rounded-xl -z-20"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent -z-10"></div>
    </div>
  );
};

export default Hero;
