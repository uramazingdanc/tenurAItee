
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const videos = [
  {
    id: 1,
    title: "Handling Flight Cancellations",
    duration: "8:24",
    thumbnail: "https://via.placeholder.com/320x180/3B82F6/FFFFFF?text=Flight+Cancellations",
    description: "Watch how experienced agents handle flight cancellation requests with empathy and efficiency."
  },
  {
    id: 2,
    title: "Resolving Booking Disputes",
    duration: "10:12",
    thumbnail: "https://via.placeholder.com/320x180/22C55E/FFFFFF?text=Booking+Disputes",
    description: "Learn techniques for addressing customer disputes regarding bookings and charges."
  },
  {
    id: 3,
    title: "Upselling Travel Insurance",
    duration: "6:45",
    thumbnail: "https://via.placeholder.com/320x180/8B5CF6/FFFFFF?text=Travel+Insurance",
    description: "See how top agents naturally introduce and explain the benefits of travel insurance."
  },
  {
    id: 4,
    title: "Handling Difficult Customers",
    duration: "12:33",
    thumbnail: "https://via.placeholder.com/320x180/EF4444/FFFFFF?text=Difficult+Customers",
    description: "Expert strategies for turning negative customer experiences into positive outcomes."
  }
];

const VideoHub = () => {
  return (
    <section className="py-16 bg-white" id="videos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-gradient">
            Video Learning Hub
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch recorded calls of tenured agents handling different customer service scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="group">
              <Card className="overflow-hidden card-hover">
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button className="bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 3L19 12L5 21V3Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-medium text-lg mb-2">{video.title}</h3>
                  <p className="text-gray-500 text-sm">{video.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10">
            View All Videos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoHub;
