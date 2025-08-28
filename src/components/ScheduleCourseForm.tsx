import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

export default function CourseDetails({ course }: { course: any }) {
  return (
    <div className="space-y-6 w-full">
      {/* Course Overview */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{course.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-sm">{course.description}</p>
        </CardContent>
      </Card>

      {/* Branches */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Branches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Branch Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course.branchIds.map((branch: any) => (
                <TableRow key={branch._id}>
                  <TableCell className="font-medium">{branch.branchName}</TableCell>
                  <TableCell>{branch.country}</TableCell>
                  <TableCell>{branch.branchCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inspectors */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Instructors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course.instructorIds.map((inspector: any) => (
                <TableRow key={inspector._id}>
                  <TableCell className="font-medium">{inspector.name}</TableCell>
                  <TableCell>{inspector.email}</TableCell>
                  <TableCell>{inspector.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Inspectors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course.inspectorIds.map((inspector: any) => (
                <TableRow key={inspector._id}>
                  <TableCell className="font-medium">{inspector.name}</TableCell>
                  <TableCell>{inspector.email}</TableCell>
                  <TableCell>{inspector.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
    </div>
  )
}
