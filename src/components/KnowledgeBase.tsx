
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const knowledgeCategories = [
  {
    id: "basics",
    name: "Customer Service Basics",
    articles: [
      {
        id: 1,
        title: "Active Listening Techniques",
        excerpt: "Learn how to effectively listen to customers to understand their needs and concerns.",
        tags: ["Communication", "Beginner"]
      },
      {
        id: 2,
        title: "De-escalation Strategies",
        excerpt: "Techniques to calm upset customers and resolve conflicts professionally.",
        tags: ["Conflict Resolution", "Intermediate"]
      },
      {
        id: 3,
        title: "Building Customer Rapport",
        excerpt: "How to establish trust and positive relationships with customers.",
        tags: ["Communication", "Beginner"]
      }
    ]
  },
  {
    id: "travel",
    name: "Travel Industry Knowledge",
    articles: [
      {
        id: 4,
        title: "Flight Cancellation Policies",
        excerpt: "Understanding airline policies for cancellations and refunds.",
        tags: ["Policies", "Intermediate"]
      },
      {
        id: 5,
        title: "Booking Modification Procedures",
        excerpt: "Step-by-step guide for handling customer booking changes.",
        tags: ["Procedures", "Intermediate"]
      },
      {
        id: 6,
        title: "Travel Insurance Coverage",
        excerpt: "Overview of travel insurance options and what they cover.",
        tags: ["Insurance", "Advanced"]
      }
    ]
  },
  {
    id: "advanced",
    name: "Advanced Techniques",
    articles: [
      {
        id: 7,
        title: "Handling Multiple Customer Concerns",
        excerpt: "How to address multiple issues during a single customer interaction.",
        tags: ["Problem Solving", "Advanced"]
      },
      {
        id: 8,
        title: "Personalization Strategies",
        excerpt: "Techniques for tailoring customer interactions for better experiences.",
        tags: ["Customer Experience", "Advanced"]
      },
      {
        id: 9,
        title: "Cultural Sensitivity in Customer Service",
        excerpt: "Understanding and respecting cultural differences in customer interactions.",
        tags: ["Communication", "Intermediate"]
      }
    ]
  }
];

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="py-16 bg-gray-50" id="knowledge">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">
            Knowledge Base
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access our RAG-powered knowledge base to learn best practices for customer service in the travel industry.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-10">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for articles, tips, or procedures..."
              className="pl-10 py-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <Tabs defaultValue="basics" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            {knowledgeCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {knowledgeCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              {category.articles.map((article) => (
                <Card key={article.id} className="card-hover overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle>{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{article.excerpt}</CardDescription>
                  </CardContent>
                  <Separator />
                  <CardFooter className="pt-3 flex justify-between">
                    <div className="flex space-x-2">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="text-brand-blue hover:text-brand-blue-dark hover:bg-brand-blue/10">
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default KnowledgeBase;
