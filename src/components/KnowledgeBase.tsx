
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { fetchKnowledgeItems, KnowledgeItem } from "@/services/knowledgeService";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

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
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  // Fetch knowledge items using react-query
  const { data: knowledgeItems, isLoading, error } = useQuery({
    queryKey: ['knowledgeItems', isAuthenticated],
    queryFn: () => fetchKnowledgeItems(isAuthenticated)
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

  // Filter items based on search query
  const filterItems = (items: any[]) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <section className="py-16 bg-gray-50" id="knowledge">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">
            Knowledge Base
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access our RAG-powered knowledge base to learn best practices for customer service in the travel industry.
            {!isAuthenticated && (
              <span className="block mt-2 text-brand-blue">
                <Link to="/login" className="font-medium hover:underline">
                  Sign in
                </Link>{" "}
                to access premium content.
              </span>
            )}
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
        ) : categories.length > 0 ? (
          <Tabs defaultValue={categories[0].id} className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map((category) => {
              const categoryItems = categorizedContent[category.id] || [];
              const filteredItems = filterItems(categoryItems);
              
              return (
                <TabsContent key={category.id} value={category.id} className="space-y-6">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((article: any) => (
                      <Card key={article.id} className="card-hover overflow-hidden">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2">
                            {article.title}
                            {article.is_premium && !isAuthenticated && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Premium
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            {article.is_premium && !isAuthenticated 
                              ? "This is premium content. Please sign in to view."
                              : article.excerpt}
                          </CardDescription>
                        </CardContent>
                        <Separator />
                        <CardFooter className="pt-3 flex justify-between">
                          <div className="flex flex-wrap gap-2">
                            {article.tags?.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="bg-gray-100">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-brand-blue hover:text-brand-blue-dark hover:bg-brand-blue/10"
                            asChild={article.is_premium && !isAuthenticated}
                          >
                            {article.is_premium && !isAuthenticated ? (
                              <Link to="/login">Sign In to Read</Link>
                            ) : (
                              "Read More"
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p>No articles found matching your search criteria.</p>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <p>No knowledge base items found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default KnowledgeBase;
