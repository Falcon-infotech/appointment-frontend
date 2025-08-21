import { useState, useEffect, useMemo } from "react";
import { User, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Instructor {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  rating: number;
  experience: string;
  avatar?: string;
}

interface Availability {
  date: string;
  timeSlots: {
    time: string;
    available: boolean;
    reason?: string;
  }[];
}

interface InstructorAvailabilityProps {
  selectedDate: string;
  selectedTime: string;
  courseCategory: string;
  onInstructorSelect: (instructor: Instructor) => void;
  selectedInstructor?: Instructor;
}

const instructors: Instructor[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@company.com",
    specialties: ["Leadership", "Strategy", "Management"],
    rating: 4.9,
    experience: "12 years",
    avatar: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Marcus Thompson",
    email: "marcus.thompson@company.com",
    specialties: ["Marketing", "Communication", "Sales"],
    rating: 4.7,
    experience: "8 years"
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    email: "elena.rodriguez@company.com",
    specialties: ["Analytics", "Management", "Strategy"],
    rating: 4.8,
    experience: "10 years"
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@company.com",
    specialties: ["Leadership", "Communication", "HR"],
    rating: 4.6,
    experience: "15 years"
  },
  {
    id: "5",
    name: "Dr. Priya Patel",
    email: "priya.patel@company.com",
    specialties: ["Analytics", "Marketing", "Strategy"],
    rating: 4.9,
    experience: "9 years"
  }
];

export function InstructorAvailability({ 
  selectedDate, 
  selectedTime, 
  courseCategory, 
  onInstructorSelect, 
  selectedInstructor 
}: InstructorAvailabilityProps) {
  const [availabilityData, setAvailabilityData] = useState<Record<string, Availability>>({});

  // Filter instructors by course category - memoized to prevent infinite re-renders
  const relevantInstructors = useMemo(() => 
    instructors.filter(instructor =>
      instructor.specialties.some(specialty => 
        specialty.toLowerCase().includes(courseCategory.toLowerCase()) ||
        courseCategory.toLowerCase().includes(specialty.toLowerCase())
      )
    ), [courseCategory]
  );

  // Generate mock availability data
  useEffect(() => {
    if (!selectedDate) return;

    const generateAvailability = (instructorId: string): Availability => {
      const timeSlots = [
        "09:00", "10:00", "11:00", "12:00", 
        "13:00", "14:00", "15:00", "16:00", "17:00"
      ];

      return {
        date: selectedDate,
        timeSlots: timeSlots.map(time => {
          // Simulate some busy slots
          const isUnavailable = Math.random() < 0.3; // 30% chance of being busy
          const reasons = [
            "Teaching another course",
            "Client meeting",
            "Conference call",
            "Preparation time",
            "Personal appointment"
          ];

          return {
            time,
            available: !isUnavailable,
            reason: isUnavailable ? reasons[Math.floor(Math.random() * reasons.length)] : undefined
          };
        })
      };
    };

    const newAvailability: Record<string, Availability> = {};
    relevantInstructors.forEach(instructor => {
      newAvailability[instructor.id] = generateAvailability(instructor.id);
    });

    setAvailabilityData(newAvailability);
  }, [selectedDate, relevantInstructors]);

  const getAvailabilityStatus = (instructor: Instructor) => {
    if (!selectedDate || !selectedTime) return "unknown";
    
    const availability = availabilityData[instructor.id];
    if (!availability) return "unknown";

    const timeSlot = availability.timeSlots.find(slot => slot.time === selectedTime);
    return timeSlot?.available ? "available" : "busy";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "busy":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-success text-white">Available</Badge>;
      case "busy":
        return <Badge className="bg-destructive text-white">Busy</Badge>;
      default:
        return <Badge variant="outline">Select Date & Time</Badge>;
    }
  };

  if (!selectedDate) {
    return (
      <Card className="bg-gradient-card border-0">
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Please select a date to check instructor availability</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Instructor</h3>
        <p className="text-sm text-muted-foreground">
          Showing instructors specialized in {courseCategory} for {selectedDate}
          {selectedTime && ` at ${selectedTime}`}
        </p>
      </div>

      <div className="grid gap-4">
        {relevantInstructors.map((instructor) => {
          const status = getAvailabilityStatus(instructor);
          const isSelected = selectedInstructor?.id === instructor.id;
          
          return (
            <Card 
              key={instructor.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : 'bg-gradient-card'
              }`}
              onClick={() => onInstructorSelect(instructor)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={instructor.avatar} alt={instructor.name} />
                    <AvatarFallback>
                      {instructor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{instructor.name}</h4>
                        <p className="text-sm text-muted-foreground">{instructor.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        {getStatusBadge(status)}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        ⭐ {instructor.rating} • {instructor.experience} exp
                      </span>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {instructor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Show time slots if instructor is selected and we have availability data */}
                    {isSelected && availabilityData[instructor.id] && (
                      <div className="mt-4 p-3 bg-background/50 rounded-lg">
                        <h5 className="text-sm font-medium mb-2">Available Time Slots</h5>
                        <div className="grid grid-cols-3 gap-2">
                          {availabilityData[instructor.id].timeSlots.map((slot) => (
                            <div
                              key={slot.time}
                              className={`text-xs p-2 rounded text-center ${
                                slot.available 
                                  ? 'bg-success/10 text-success border border-success/20' 
                                  : 'bg-destructive/10 text-destructive border border-destructive/20'
                              }`}
                              title={slot.reason || (slot.available ? 'Available' : 'Busy')}
                            >
                              {slot.time}
                            </div>
                          ))}
                        </div>
                        {!availabilityData[instructor.id].timeSlots.some(slot => slot.available) && (
                          <p className="text-sm text-destructive mt-2">
                            No available slots on this date. Please select a different date.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {relevantInstructors.length === 0 && (
        <Card className="bg-gradient-card border-0">
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No instructors found for {courseCategory} category
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export default InstructorAvailability