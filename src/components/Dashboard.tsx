import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Users, DollarSign, Building, Award, BarChart3, PieChart, PlusCircle, EyeOff, Eye, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useOutletContext } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "../constants/axiosInstance";
import toast from "react-hot-toast";
import EnhancedTable from "./Table";
import { baseUrl } from "@/lib/base";
import api from "../constants/axiosInstance";
import DashboardMetrics from "./DashboardMetrics ";
interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  revenue: string;
  status: "active" | "inactive" | "pending";
}

interface DashboardAreaProps {
  selectedCompany: Company | null;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}




export function DashboardArea() {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const { selectedCompany } = useOutletContext<{ selectedCompany: Company | null }>();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "+91",
  });

  const [totals, setTotals] = useState({
    totalBatches: 0,
    totalInspectors: 0,
    totalCourses: 0,
    totalBranches: 0,
  });

  const fetchBatches = async (flag: boolean) => {
    if (flag) setLoading(true);
    try {
      const response = await api.get(`${baseUrl}/api/batch/all`);
      const data = response.data;
      setDashboardData(data.batches || []);
      setTotals({
        totalBatches: data.totalBatches,
        totalInspectors: data.totalInspectors,
        totalCourses: data.totalCourses,
        totalBranches: data.totalBranches,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches(true);
  }, []);



  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      };

      const response = await axios.post(`${baseUrl}/api/auth/register`, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("User created successfully", {
          duration: 3000,
        });

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "+91",
        });

        setOpen(false);
      } else {
        toast.error("Failed to add user");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }

    console.log("Form submitted with data:", formData);
  };


  useEffect(() => {

    const overviewMetrics: MetricCard[] = [
      {
        title: "Total Companies",
        value: "24",
        change: "+3 this month",
        trend: "up",
        icon: <Building className="h-5 w-5" />,
        color: "red-500",
      },
      {
        title: "Total Employees",
        value: "1,450",
        change: "+125 this quarter",
        trend: "up",
        icon: <Users className="h-5 w-5" />,
        color: "green-500",
      },
      {
        title: "Combined Revenue",
        value: "$12.8M",
        change: "+18.3%",
        trend: "up",
        icon: <DollarSign className="h-5 w-5" />,
        color: "blue-500",
      },
      {
        title: "Active Companies",
        value: "22",
        change: "91.7% active",
        trend: "up",
        icon: <Award className="h-5 w-5" />,
        color: "sky-500",
      },
    ];
    setMetrics(overviewMetrics);
  }
    , []);

  const departmentData = [
    { name: "Engineering", employees: 45, percentage: 35 },
    { name: "Sales", employees: 28, percentage: 22 },
    { name: "Marketing", employees: 22, percentage: 17 },
    { name: "Operations", employees: 18, percentage: 14 },
    { name: "HR", employees: 15, percentage: 12 },
  ];

  const revenueData = [
    { month: "Jan", value: 85 },
    { month: "Feb", value: 92 },
    { month: "Mar", value: 78 },
    { month: "Apr", value: 95 },
    { month: "May", value: 88 },
    { month: "Jun", value: 98 },
  ];

  return (
    <div className="flex-1 bg-dashboard p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between">
        <div>
          <div className="flex items-center gap-2 p-3 text-3xl">
            <LayoutDashboard className="h-6 w-6 text-blue-600" />
            <h2 className=" font-semibold">Dashboard</h2>
          </div>
        </div>
        <div >
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="h-5 w-5 text-primary" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>

                <DialogHeader>
                  <DialogTitle>Add profile</DialogTitle>
                  <DialogDescription className="mb-2">
                    Add new User here to give Access
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">FirstName</Label>
                    <Input id="name-1" name="firstName" value={formData.firstName} onChange={handlechange} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">LastName</Label>
                    <Input id="username-1" name="lastName" value={formData.lastName} onChange={handlechange} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">Email</Label>
                    <Input id="username-1" type="email" name="email" value={formData.email} onChange={handlechange} placeholder="john@gmail.com" />
                  </div>
                  <div className="grid gap-3 relative">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="password"
                      value={formData.password}
                      onChange={handlechange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[70%] translate-y-[-50%] text-gray-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">Phone</Label>
                    <Input id="username-1" type="tel" name="phone" value={formData.phone} onChange={handlechange} />
                  </div>
                </div>
                <DialogFooter className="mt-5">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" >Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-gradient-card border-0 shadow-lg hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-${metric.color}/10`}>
                <div className={`text-${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1 ">
                {metric.value}
              </div>
              <div className="flex items-center text-sm">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}
      <DashboardMetrics totals={totals} />

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Distribution */}
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
             Ucoming Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{dept.name}</span>
                    <span className="text-muted-foreground">{dept.employees} people</span>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                </div>
              ))}
            </div> */}

            <div>
              
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="bg-gradient-card border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Instructer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-8">{data.month}</span>
                  <div className="flex-1">
                    <Progress value={data.value} className="h-3" />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">{data.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <EnhancedTable />

      {/* Additional Info Cards */}

    </div>
  );
}

export default DashboardArea;