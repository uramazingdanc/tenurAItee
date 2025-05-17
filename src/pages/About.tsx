
import { useQuery } from "@tanstack/react-query";
import { fetchAboutInfo, fetchTeamMembers, fetchPartners } from "@/services/aboutService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const About = () => {
  const { data: aboutInfo } = useQuery({
    queryKey: ['about-info'],
    queryFn: fetchAboutInfo,
  });
  
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members'],
    queryFn: fetchTeamMembers,
  });
  
  const { data: trustedPartners = [] } = useQuery({
    queryKey: ['trusted-partners'],
    queryFn: () => fetchPartners('trusted_by'),
  });
  
  const { data: backedPartners = [] } = useQuery({
    queryKey: ['backed-partners'],
    queryFn: () => fetchPartners('backed_by'),
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About tenurAItee
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering the next generation of customer service agents with AI.
            </p>
          </div>
          
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                {aboutInfo?.mission || "Empowering next-gen agents with AI"}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                {aboutInfo?.vision || "No rep left behind—train from zero to tenured"}
              </p>
            </div>
          </div>
          
          {/* Our Story */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border max-w-4xl mx-auto">
              <p className="text-gray-700 leading-relaxed">
                {aboutInfo?.story || "tenurAItee was founded with a simple mission: to make world-class customer service training accessible to everyone. Our founders, having worked in customer service roles themselves, saw firsthand how difficult it could be for new agents to get up to speed quickly. They envisioned a platform that could leverage AI to simulate interactions with tenured agents, providing valuable learning experiences without the need for direct mentorship."}
              </p>
            </div>
          </div>
          
          {/* Team */}
          {teamMembers.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {teamMembers.map((member) => (
                  <div key={member.id} className="text-center">
                    <Avatar className="w-32 h-32 mx-auto mb-4">
                      <AvatarImage src={member.image_url || ''} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-gray-500">{member.role}</p>
                    <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Partners */}
          {(trustedPartners.length > 0 || backedPartners.length > 0) && (
            <div>
              {trustedPartners.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-center mb-8">Trusted By</h2>
                  <div className="flex flex-wrap justify-center gap-10 items-center">
                    {trustedPartners.map((partner) => (
                      <div key={partner.id} className="flex items-center justify-center">
                        {partner.logo_url ? (
                          <img 
                            src={partner.logo_url} 
                            alt={partner.name} 
                            className="h-12 object-contain"
                          />
                        ) : (
                          <span className="text-xl font-medium">{partner.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {backedPartners.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-center mb-8">Backed By</h2>
                  <div className="flex flex-wrap justify-center gap-10 items-center">
                    {backedPartners.map((partner) => (
                      <div key={partner.id} className="flex items-center justify-center">
                        {partner.logo_url ? (
                          <img 
                            src={partner.logo_url} 
                            alt={partner.name} 
                            className="h-12 object-contain"
                          />
                        ) : (
                          <span className="text-xl font-medium">{partner.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
