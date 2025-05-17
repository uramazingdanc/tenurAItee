
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ScenariosList from "@/components/dashboard/ScenariosList";
import AchievementsList from "@/components/dashboard/AchievementsList";
import LearningPath from "@/components/learning-path/LearningPath";

interface DashboardTabsProps {
  dashboardData: any;
}

const DashboardTabs = ({ dashboardData }: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="scenarios">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="scenarios" id="scenarios-tab">Scenarios</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="learning">Learning Path</TabsTrigger>
      </TabsList>
      
      <TabsContent value="scenarios">
        <Card>
          <CardHeader>
            <CardTitle>Available Scenarios</CardTitle>
            <CardDescription>Practice with these customer service scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <ScenariosList 
              completedScenarios={dashboardData.completedScenarios.map(s => ({
                id: s.scenarios.id,
                title: s.scenarios.title,
                description: s.scenarios.description,
                difficulty: s.scenarios.difficulty as "Beginner" | "Intermediate" | "Advanced",
                category: s.scenarios.category,
                status: "completed" as const,
                score: s.score || undefined,
                feedback: s.feedback
              }))}
              inProgressScenarios={[]} // No in-progress scenarios in the data yet
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="achievements">
        <Card>
          <CardHeader>
            <CardTitle>Your Achievements</CardTitle>
            <CardDescription>Badges and rewards you've earned</CardDescription>
          </CardHeader>
          <CardContent>
            <AchievementsList achievements={dashboardData.achievements.map(a => ({
              id: a.achievements.id,
              name: a.achievements.name,
              description: a.achievements.description,
              icon: a.achievements.icon,
              category: a.achievements.category,
              unlocked: true,
              earnedAt: new Date(a.earned_at).toLocaleDateString()
            }))} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="learning">
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Path</CardTitle>
            <CardDescription>Follow this path to mastery</CardDescription>
          </CardHeader>
          <CardContent>
            <LearningPath />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
