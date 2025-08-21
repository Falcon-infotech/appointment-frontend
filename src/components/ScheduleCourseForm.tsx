import { useState } from "react";
import { Calendar, MapPin, Users, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {useToast } from "@/hooks/useHook";
import  InstructorAvailability  from "./InstructorAvailablity";

interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  revenue: string;
  status: "active" | "inactive" | "pending";
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  maxParticipants: number;
  price: string;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  rating: number;
  experience: string;
  avatar?: string;
}

interface ScheduleCourseFormProps {
  course: Course;
  company: Company;
}

export function ScheduleCourseForm({ course, company }: ScheduleCourseFormProps) {
  const { toast } = useToast();
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    location: "",
    participantCount: "",
    instructorPreference: "",
    specialRequests: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.startDate || !formData.startTime || !formData.location || !formData.participantCount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedInstructor) {
      toast({
        title: "Instructor Required",
        description: "Please select an instructor for this course.",
        variant: "destructive"
      });
      return;
    }

    // Simulate course scheduling
    toast({
      title: "Course Scheduled Successfully!",
      description: `${course.title} with ${selectedInstructor.name} has been scheduled for ${company.name} on ${formData.startDate}.`,
    });

    // Reset form
    setSelectedInstructor(null);
    setFormData({
      startDate: "",
      endDate: "",
      startTime: "",
      location: "",
      participantCount: "",
      instructorPreference: "",
      specialRequests: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: ""
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-success text-white";
      case "intermediate": return "bg-warning text-white";
      case "advanced": return "bg-destructive text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Summary */}
      <Card className="bg-gradient-card border-0">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <Badge className={getLevelColor(course.level)}>
              {course.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{course.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Duration: {course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Max {course.maxParticipants} participants</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Price: {course.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{course.category}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time *</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="Enter training location or venue"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="participantCount">Number of Participants *</Label>
            <Input
              id="participantCount"
              type="number"
              min="1"
              max={course.maxParticipants}
              placeholder={`Max ${course.maxParticipants}`}
              value={formData.participantCount}
              onChange={(e) => handleInputChange("participantCount", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructorPreference">Instructor Preference</Label>
            <Select onValueChange={(value) => handleInputChange("instructorPreference", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select instructor preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Available Instructor</SelectItem>
                <SelectItem value="senior">Senior Instructor</SelectItem>
                <SelectItem value="specialist">Subject Matter Specialist</SelectItem>
                <SelectItem value="certified">Certified Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Instructor Selection */}
        {formData.startDate && (
          <InstructorAvailability
            selectedDate={formData.startDate}
            selectedTime={formData.startTime}
            courseCategory={course.category}
            onInstructorSelect={setSelectedInstructor}
            selectedInstructor={selectedInstructor}
          />
        )}

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                placeholder="Full name"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="email@example.com"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="Phone number"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialRequests">Special Requests or Notes</Label>
          <Textarea
            id="specialRequests"
            placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
            value={formData.specialRequests}
            onChange={(e) => handleInputChange("specialRequests", e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Course
          </Button>
          <Button type="button" variant="outline" className="flex-1">
            Save as Draft
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ScheduleCourseForm;