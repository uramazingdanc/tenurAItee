
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { fetchKnowledgeItems, KnowledgeItem } from "@/services/knowledgeService";

// Helper to generate excerpt from content
const generateExcerpt = (content: string): string => {
  return content.length > 120 ? content.substring(0, 120) + '...' : content;
};

// Helper to generate tags based on category and premium status
const generateTags = (category: string, isPremium: boolean | null): string[] => {
  const tags = [category];
  
  // Add difficulty tag based on category
  if (category === 'Cancellations' || category === 'Modifications') {
    tags.push('Beginner');
  } else if (category === 'Refunds') {
    tags.push('Intermediate');
  } else if (category === 'Conflict Resolution') {
    tags.push('Advanced');
  }
  
  // Add premium tag if applicable
  if (isPremium) {
    tags.push('Premium');
  }
  
  return tags;
};

// Group knowledge items by category
const groupByCategory = (items: KnowledgeItem[]): Record<string, KnowledgeItem[]> => {
  const grouped: Record<string, KnowledgeItem[]> = {};
  
  items.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });
  
  return grouped;
};

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch knowledge items using react-query
  const { data: knowledgeItems, isLoading, error } = useQuery({
    queryKey: ['knowledgeItems'],
    queryFn: fetchKnowledgeItems
  });
  
  // Fallback knowledge categories
  const fallbackKnowledgeCategories = [
    {
      id: "cancellations",
      name: "Cancellations",
      articles: [
        {
          id: "1",
          title: "Flight Cancellation Policy",
          excerpt: "Learn how to handle flight cancellation requests and explain policies to customers.",
          tags: ["Cancellations", "Beginner"]
        },
        {
          id: "2",
          title: "Hotel Cancellation Guidelines",
          excerpt: "Understanding hotel booking cancellations and refund policies.",
          tags: ["Cancellations", "Beginner"]
        }
      ]
    },
    {
      id: "refunds",
      name: "Refunds",
      articles: [
        {
          id: "3",
          title: "Refund Processing Steps",
          excerpt: "Step-by-step guide to processing customer refunds correctly.",
          tags: ["Refunds", "Intermediate"]
        },
        {
          id: "4",
          title: "Partial Refund Scenarios",
          excerpt: "When and how to issue partial refunds to customers.",
          tags: ["Refunds", "Intermediate"]
        }
      ]
    },
    {
      id: "conflict-resolution",
      name: "Conflict Resolution",
      articles: [
        {
          id: "5",
          title: "De-escalation Techniques",
          excerpt: "Advanced techniques for calming upset customers and resolving conflicts.",
          tags: ["Conflict Resolution", "Advanced", "Premium"]
        },
        {
          id: "6",
          title: "Handling Complaints",
          excerpt: "Best practices for addressing and resolving customer complaints.",
          tags: ["Conflict Resolution", "Advanced"]
        }
      ]
    }
  ];

  let categorizedContent: Record<string, KnowledgeItem[]> = {};
  let categories: {id: string, name: string}[] = [];

  // Process data from Supabase if available
  if (knowledgeItems && knowledgeItems.length > 0) {
    // Process the items to add excerpts and tags
    const processedItems = knowledgeItems.map(item => ({
      ...item,
      excerpt: generateExcerpt(item.content),
      tags: generateTags(item.category, item.is_premium)
    }));
    
    // Group items by category
    categorizedContent = groupByCategory(processedItems);
    
    // Generate categories list
    categories = Object.keys(categorizedContent).map(category => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category
    }));
  } else {
    // Use fallback data
    categorizedContent = fallbackKnowledgeCategories.reduce((acc: Record<string, any[]>, category) => {
      acc[category.id] = category.articles.map(article => ({
        id: article.id,
        title: article.title,
        content: article.excerpt,
        excerpt: article.excerpt,
        category: category.name,
        is_premium: article.tags.includes('Premium'),
        tags: article.tags
      }));
      return acc;
    }, {});
    categories = fallbackKnowledgeCategories;
  }

  // If there's an error, log it but don't disrupt the UI
  if (error) {
    console.error("Failed to load knowledge items:", error);
  }

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

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          </div>
        ) : (
          <Tabs defaultValue={categories.length > 0 ? categories[0].id : "cancellations"} className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-6">
                {categorizedContent[category.id]?.map((article: any) => (
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
                        {article.tags?.map((tag: string, index: number) => (
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
        )}
      </div>
    </section>
  );
};

export default KnowledgeBase;
