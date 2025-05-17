
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "RAG-Powered Knowledge Base",
    description: "Access a comprehensive knowledge base powered by Retrieval Augmented Generation to learn best practices for customer service.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 19.5V4.5C4 3.4 4.9 2.5 6 2.5H18C19.1 2.5 20 3.4 20 4.5V19.5C20 20.6 19.1 21.5 18 21.5H6C4.9 21.5 4 20.6 4 19.5Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 11.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 15.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Mock Call Scenarios",
    description: "Practice handling customer inquiries through interactive simulations with ElevenLabs voice synthesis technology.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 5.5V18.5C19.5 19.6 18.6 20.5 17.5 20.5H6.5C5.4 20.5 4.5 19.6 4.5 18.5V5.5C4.5 4.4 5.4 3.5 6.5 3.5H17.5C18.6 3.5 19.5 4.4 19.5 5.5Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 17.5C14.2091 17.5 16 15.7091 16 13.5C16 11.2909 14.2091 9.5 12 9.5C9.79086 9.5 8 11.2909 8 13.5C8 15.7091 9.79086 17.5 12 17.5Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 6.5H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Video Learning Hub",
    description: "Learn from watching recorded calls of tenured agents handling different customer service scenarios.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 17.5L16 12L9 6.5V17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="3" y="3.5" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Tenured AI Assistant",
    description: "Experience guided simulations with our AI assistant that provides real-time feedback and suggestions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 9.5V14.5C18 16.71 16.21 18.5 14 18.5H6C3.79 18.5 2 16.71 2 14.5V9.5C2 7.29 3.79 5.5 6 5.5H14C16.21 5.5 18 7.29 18 9.5Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M22 10.5L18 13.5V10.5L22 7.5V10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 10.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 13.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 10.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">
            Train Smarter with AI-Powered Tools
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform offers a variety of features designed to enhance the skills of your customer service representatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
