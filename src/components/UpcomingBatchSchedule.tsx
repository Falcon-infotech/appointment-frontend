import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface Batch {
  id: number;
  title: string;
  instructor: string;
  date: string;
}

const batches: Batch[] = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    instructor: "John Smith",
    date: "Oct 15, 2023",
  },
  {
    id: 2,
    title: "Data Science Essentials",
    instructor: "Sarah Johnson",
    date: "Oct 18, 2023",
  },
  {
    id: 3,
    title: "Mobile App Development",
    instructor: "Michael Chen",
    date: "Oct 22, 2023",
  },
];

export default function UpcomingBatchSchedule() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Upcoming Batch Schedule
        </h2>
        <button className="text-sm text-blue-600 hover:underline">
          <Link to={"/batches"}>
                
                View All
                </Link>
        </button>
      </div>

      {/* Batch List */}
      <div className="space-y-3">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl p-4 cursor-pointer transition"
          >
            <div>
              <h3 className="text-sm font-medium text-gray-800">
                {batch.title}
              </h3>
              <p className="text-xs text-gray-500">
                Instructor: {batch.instructor}
              </p>
            </div>
            <div className="flex items-center text-sm text-blue-600 font-medium">
              {batch.date}
              <Calendar className="w-4 h-4 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
