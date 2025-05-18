
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "@/components/ui/motion";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative pt-20 pb-10 md:pt-28 md:pb-20 overflow-hidden">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute -z-10 top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-300/30 to-purple-400/30 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 0.6, 
          scale: 1,
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute -z-10 bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-green-300/30 to-teal-400/30 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 0.5, 
          scale: 1,
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 md:pr-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-brand-blue text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Star className="h-4 w-4 fill-brand-blue text-white" />
              <span>AI-Powered Training Platform</span>
            </motion.span>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 heading-gradient"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Level Up Your Customer Service Team
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Train your reps with interactive AI scenarios, voice simulations, and adaptive learning. Perfect for travel account handling professionals.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button 
                className="bg-brand-blue hover:bg-brand-blue-dark text-white font-medium py-2 px-6 rounded-lg group"
                size="lg" 
                asChild
              >
                <Link to="/register" className="flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-brand-blue text-brand-blue hover:bg-brand-blue/10" 
                asChild
              >
                <Link to="/demo">Watch Demo</Link>
              </Button>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${i % 2 === 0 ? 'bg-brand-blue' : 'bg-brand-green'} flex items-center justify-center text-xs text-white font-bold`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <span className="font-medium block text-sm">Trusted by 1,000+ teams</span>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1 text-xs text-gray-500">4.9/5 rating</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 mt-10 md:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div 
                className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4 bg-gradient-to-r from-brand-blue/10 to-brand-green/5 border-b border-gray-100 flex items-center">
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
                  
                  <motion.div 
                    className="mb-4 p-4 bg-brand-blue/10 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white font-medium">You</div>
                      <span className="ml-2 font-medium">Agent</span>
                    </div>
                    <p className="text-gray-700">
                      "I understand you need to cancel your booking. I'd be happy to help with that. Could you please provide me with your booking reference number?"
                    </p>
                  </motion.div>
                  
                  <div className="flex items-center mt-4 relative">
                    <motion.div 
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-brand-blue text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      Type your response...
                    </motion.div>
                    <Button className="ml-2 bg-brand-blue w-10 h-10 p-2 rounded-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute top-4 left-4 right-4 bottom-4 bg-brand-blue/20 rounded-xl -z-10"
                animate={{
                  scale: [1, 1.03, 1],
                  opacity: [0.7, 0.4, 0.7]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="absolute top-8 left-8 right-8 bottom-8 bg-brand-green/10 rounded-xl -z-20"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.3, 0.5]
                }}
                transition={{
                  duration: 6,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Features highlight section */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17L15 12L9 7V17Z" fill="#3B82F6"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Interactive Training</h3>
            <p className="text-gray-600">Learn by doing with our AI-powered simulations that feel like real customer interactions.</p>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time Feedback</h3>
            <p className="text-gray-600">Get instant insights on your performance with detailed analytics and improvement tips.</p>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#8B5CF6"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Skill Mastery</h3>
            <p className="text-gray-600">Track your progress and master essential skills to become a top-performing agent.</p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent -z-10"></div>
    </div>
  );
};

export default Hero;
