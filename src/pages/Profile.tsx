import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, Users, Percent, Mail, Pencil, Settings, StarIcon } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-1" /> Edit Profile
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" /> Settings
          </Button>
        </div>
      </div>

      {/* Profile & Stats */}
      <div className="">
        <div className=" w-full flex flex-col items-center justify-center ">
          {/* Profile Card */}
          <Card className="lg:w-1/3 md:1/2 w-full flex flex-col items-center justify-center  p-6 border shadow-2xl">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-lg font-semibold">John Doe</h2>
            <p className="text-sm text-gray-500">Product Designer</p>
            <Badge variant="secondary" className="mt-1">Pro Member</Badge>
            <Button className="mt-4 w-full">
              <Mail className="h-4 w-4 mr-2" /> Message
            </Button>

            <div className="mt-4 w-full text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Member since</span>
                <span>Jan 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last active</span>
                <span>2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Role</span>
                <span>Admin</span>
              </div>
            </div>
          </Card>

          {/* Stats Cards
        <Card className="flex flex-col justify-center items-center py-6">
          <Star className="h-5 w-5 text-gray-500 mb-1" />
          <h3 className="text-xl font-bold">128</h3>
          <p className="text-sm text-gray-500">Projects Completed</p>
        </Card>
        <Card className="flex flex-col justify-center items-center py-6">
          <Users className="h-5 w-5 text-gray-500 mb-1" />
          <h3 className="text-xl font-bold">8.5k</h3>
          <p className="text-sm text-gray-500">Team Members</p>
        </Card>
        <Card className="flex flex-col justify-center items-center py-6">
          <Percent className="h-5 w-5 text-gray-500 mb-1" />
          <h3 className="text-xl font-bold">99%</h3>
          <p className="text-sm text-gray-500">Satisfaction Rate</p>
        </Card> */}
        </div>
      </div>

      {/* Recent Activity */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {["Completed project \"Dashboard UI\"", "Completed project \"Dashboard UI\"", "Completed project \"Dashboard UI\""].map((activity, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 py-3">
                <StarIcon className="h-4 w-4 text-gray-500" />
                <div className="flex justify-between w-full">
                  <span className="text-sm">{activity}</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
              </div>
              {i < 2 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card> */}
    </div>
  );
}
