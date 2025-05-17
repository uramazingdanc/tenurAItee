
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold heading-gradient">
                tenurAItee
              </span>
            </Link>
            <p className="mt-4 text-gray-600">
              AI-powered training platform for customer service excellence in the travel industry.
            </p>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-gray-600 hover:text-brand-blue transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-brand-blue transition-colors">Pricing</Link></li>
                <li><Link to="/demo" className="text-gray-600 hover:text-brand-blue transition-colors">Demo</Link></li>
                <li><Link to="/testimonials" className="text-gray-600 hover:text-brand-blue transition-colors">Testimonials</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><Link to="/blog" className="text-gray-600 hover:text-brand-blue transition-colors">Blog</Link></li>
                <li><Link to="/guides" className="text-gray-600 hover:text-brand-blue transition-colors">Guides</Link></li>
                <li><Link to="/help" className="text-gray-600 hover:text-brand-blue transition-colors">Help Center</Link></li>
                <li><Link to="/api" className="text-gray-600 hover:text-brand-blue transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-600 hover:text-brand-blue transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-brand-blue transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-brand-blue transition-colors">Contact</Link></li>
                <li><Link to="/legal" className="text-gray-600 hover:text-brand-blue transition-colors">Legal</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="bg-brand-blue/10 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-xl mb-2">Ready to train your team?</h3>
              <p className="text-gray-600">Get started with a free trial today. No credit card required.</p>
            </div>
            <Button className="bg-brand-blue hover:bg-brand-blue-dark" asChild>
              <Link to="/register">Start Free Trial</Link>
            </Button>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} tenurAItee. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-500 hover:text-brand-blue text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-brand-blue text-sm">Terms of Service</Link>
            <Link to="/cookies" className="text-gray-500 hover:text-brand-blue text-sm">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
