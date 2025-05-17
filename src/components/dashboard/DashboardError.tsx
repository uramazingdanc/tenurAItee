
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardErrorProps {
  error: unknown;
}

const DashboardError = ({ error }: DashboardErrorProps) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Error Loading Dashboard</CardTitle>
          <CardDescription>We encountered a problem loading your dashboard data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-4">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-blue-dark"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardError;
