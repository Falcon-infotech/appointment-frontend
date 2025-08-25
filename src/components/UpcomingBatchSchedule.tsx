import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface Batch {
  id: number;
  title: string;
  instructor: string;
  date: string;
}

function formatDate(input: string) {
  if (!input) return "";

  const date = new Date(input);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function UpcomingBatchSchedule({ data }: any) {
  const isLoading = !data || data.length === 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Upcoming Batch Schedule
        </h2>
        <button className="text-sm text-blue-600 hover:underline">
          <Link to={"/batches"}>View All</Link>
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
         
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center justify-between bg-gray-100 rounded-xl p-4"
              >
                <div>
                  <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
                  <div className="h-2 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 w-20 bg-gray-300 rounded"></div>
              </div>
            ))}
          </>
        ) : (
          data.slice(0, 3).map((batch: any) => (
            <div
              key={batch._id}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl p-4 cursor-pointer transition"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  {batch.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Instructor: {batch.inspectorId.name}
                </p>
              </div>
              <div className="flex items-center text-sm text-blue-600 font-medium">
                {formatDate(batch.fromDate)}
                <Calendar className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
