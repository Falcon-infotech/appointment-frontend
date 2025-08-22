import CountUp from "react-countup";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardMetrics = ({ totals }) => {
  const metrics = [
    {
      title: "Total Batches",
      value: totals.totalBatches,
      change: "+2%",
      trend: "up",
      color: "blue",
      icon: <TrendingUp className="h-6 w-6" />,
      description: "All scheduled batches",
    },
    {
      title: "Total Inspectors",
      value: totals.totalInspectors,
      change: "+5%",
      trend: "up",
      color: "green",
      icon: <TrendingUp className="h-6 w-6" />,
      description: "Registered inspectors",
    },
    {
      title: "Total Courses",
      value: totals.totalCourses,
      change: "-1%",
      trend: "down",
      color: "red",
      icon: <TrendingDown className="h-6 w-6" />,
      description: "Active course programs",
    },
    {
      title: "Total Branches",
      value: totals.totalBranches,
      change: "+3%",
      trend: "up",
      color: "purple",
      icon: <TrendingUp className="h-6 w-6" />,
      description: "Worldwide branches",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden border-0 shadow-lg rounded-2xl bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 hover:scale-[1.02] transition-transform`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-gray-700">
                {metric.title}
              </CardTitle>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </div>
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full bg-${metric.color}-200 text-${metric.color}-600`}
            >
              {metric.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-gray-800 mb-2">
              <CountUp end={metric.value} duration={1.5} />
            </div>
            <div className="flex items-center text-sm">
              {metric.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }
              >
                {metric.change}
              </span>
              <span className="ml-2 text-gray-400">vs last month</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
