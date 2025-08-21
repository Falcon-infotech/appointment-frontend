import { useEffect, useState } from "react";
import { Calendar, Clock, Users, BookOpen, Plus, PlusCircle, ChevronsUpDown, DeleteIcon, Delete, PaintBucket, Trash, Book, BookCheck, BookCopy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScheduleCourseForm } from "./ScheduleCourseForm";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";

import { baseUrl } from "@/lib/base";
import axios from "../constants/axiosInstance";
import MultiSelect from "./MultiSelect";
import toast from "react-hot-toast";
import api from "../constants/axiosInstance";

interface Company {
  id: string;
  name: string;
  industry: string;
  employees: number;
  revenue: string;
  status: "active" | "inactive" | "pending";
}

interface Course {

  name: string;
  description: string;
  branchIds: string[],
  inspectorIds: string[]
  duration: string
}

interface CoursesSectionProps {
  company: Company;
}


export function CoursesSection({ company }: CoursesSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: "", description: "", inspectorIds: [], branchIds: [] })
  const [addopen, setAddOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [instructer, setInstructer] = useState([])
  const [branch, setBranch] = useState([])
  const [updateOpen, setUpdateOpen] = useState<boolean>(false)


  const options = [
    { id: "html", label: "HTML" },
    { id: "css", label: "CSS" },
    { id: "js", label: "JavaScript" },
    { id: "react", label: "React" },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-success text-white";
      case "intermediate": return "bg-warning text-white";
      case "advanced": return "bg-destructive text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [instructerResponse, branchResponse] = await Promise.all([
          api.get(`${baseUrl}/api/inspector/all`),
          api.get(`${baseUrl}/api/branch/all`),
        ]);

        // map inspectors
        const inspectorOptions = instructerResponse.data?.inspectors.map((ins: any) => ({
          value: ins._id,
          label: ins.name,
        }));

        // map branches 
        const branchOptions = branchResponse.data?.branches.map((b: any) => ({
          value: b._id,
          label: b.branchName,
        }));

        setInstructer(inspectorOptions);
        setBranch(branchOptions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);


  useEffect(() => {
    console.log(instructer)
    console.log(branch)
  })


  const fetchCourses = async (flag: boolean) => {
    try {
      if (flag) {
        setLoading(true)
      }
      const response = await axios.get(`${baseUrl}/api/course/all`)
      const data = response.data
      // console.log(data.courses)
      setCourses(data.courses)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(loading)
    }
  }

  const deleteCourses = async (id: string) => {

    const previousCourses = [...courses];

    setCourses(courses.filter(course => course?._id !== id));

    try {
      const res = await axios.delete(`${baseUrl}/api/course/${id}`);

      if (res.status !== 200) {
        setCourses(previousCourses);
      }
    } catch (error) {
      console.error(error);
      setCourses(previousCourses);
    }
  };



  const AddCourses = async () => {
    try {
      setAddLoading(true)
      const result = await axios.post(`${baseUrl}/api/course/create`, formData)
      if (result.status === 201) {
        setAddOpen(false)
        setFormData({
          name: "",
          description: "",
          inspectorIds: [],
          branchIds: []
        })
        setCourses((prev) => {
          return [...prev, result.data?.course]
        })
        toast.success("Course added succefully")
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddLoading(false)
    }
  }


  useEffect(() => {
    fetchCourses(true)

  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2 p-6">
            <BookCopy className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Course Management</h2>
          </div>
          <div>
            <Dialog open={addopen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white" ><Plus className="h-4 w-4 mr-1" /> Add Course</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {"Add New Course"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {["name", "description"].map((key) => (
                    <div key={key}>
                      <Label className="py-2">
                        {key.replace(/^\w/, (c) => c.toUpperCase())}
                      </Label>
                      <Input
                        type="text"
                        placeholder={key}
                        value={formData[key as keyof typeof formData]}
                        onChange={(e) => {

                          setFormData({ ...formData, [key]: e.target.value })

                        }}
                      />
                    </div>
                  ))}

                  <div className="">
                    <h2 className="text- mb-3">Select Instructer</h2>
                    <MultiSelect
                      options={instructer}
                      value={formData.inspectorIds}
                      onChange={(val) => setFormData({ ...formData, inspectorIds: val })}
                      placeholder=" Select InstructerId"
                    />



                  </div>
                  <div className="">
                    <h2 className="text- mb-3">Select Branch</h2>
                    <MultiSelect
                      options={branch}
                      value={formData.branchIds}
                      onChange={(val) => setFormData({ ...formData, branchIds: val })}
                      placeholder=" Select CourseId"
                    />


                  </div>
                  <Button
                    // onClick={handleSubmitCompany}
                    disabled={addLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={AddCourses}
                  >
                    {addLoading ? <>
                      <div className="w-4 h-4 rounded-full border border-t-transparent animate-spin" />
                      <span>Adding...</span>
                    </> : 'Add Course'}

                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>


      {loading ? (<div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>) :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.name} className="bg-gradient-card border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{course.name}</CardTitle>
                  <Badge className={getLevelColor(course.name)}>
                    {course.name}
                  </Badge>
                </div>
                <Badge variant="outline" className="w-fit">
                  {course.name}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description}
                </p>

            

                {/* Inside CardContent > .flex items-center gap-3 */}
                <div className="flex items-center gap-3">
                  {/* View Course */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="flex items-center"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                          Schedule: {course.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <ScheduleCourseForm course={course} company={company} />
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Course */}
                  <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        className="flex items-center"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Course</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Pre-filled form */}
                        <Label className="">
                          Name
                        </Label>
                        <Input
                          value={selectedCourse?.name || ""}
                          placeholder="Course Name"
                          onChange={(e) =>
                            setSelectedCourse({ ...selectedCourse!, name: e.target.value })
                          }
                        />

                        <Label className="">
                          Description
                        </Label>
                        <Input
                          value={selectedCourse?.description || ""}
                          placeholder="Description"
                          onChange={(e) =>
                            setSelectedCourse({
                              ...selectedCourse!,
                              description: e.target.value,
                            })
                          }
                        />
                        {/* MultiSelect for inspectorIds */}
                        <Label className="">
                          Select Inspector

                        </Label>
                        <MultiSelect
                          options={instructer}
                          value={selectedCourse?.inspectorIds || []}
                          onChange={(val) =>
                            setSelectedCourse({ ...selectedCourse!, inspectorIds: val })
                          }

                        />
                        {/* MultiSelect for branchIds */}
                        <Label className="">
                          Select Branch
                        </Label>
                        <MultiSelect
                          options={branch}
                          value={selectedCourse?.branchIds || []}
                          onChange={(val) =>
                            setSelectedCourse({ ...selectedCourse!, branchIds: val })
                          }
                        />

                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={async () => {
                            if (!selectedCourse) return;

                            // backup old courses list
                            const prevCourses = [...courses];

                            // optimistic update: update UI immediately
                            setCourses((prev) =>
                              prev.map((c) =>
                                c._id === selectedCourse._id ? { ...selectedCourse } : c
                              )
                            );

                            try {
                              setUpdateLoading(true)
                              const res = await axios.put(
                                `${baseUrl}/api/course/${selectedCourse._id}`,
                                selectedCourse
                              );

                              if (res.status === 200) {
                                // sync with backend response (maybe backend changes something)
                                setCourses((prev) =>
                                  prev.map((c) =>
                                    c._id === selectedCourse._id ? res.data.course : c
                                  )
                                );
                                toast.success("Course updated successfully!");
                                setUpdateOpen(false)
                              } else {
                                // rollback if unexpected response
                                setCourses(prevCourses);
                                toast.error("Update failed (server error)");
                                setUpdateOpen(false)

                              }
                            } catch (error) {
                              console.error(error);
                              // rollback if request fails
                              setCourses(prevCourses);
                              toast.error("Failed to update course");
                              setUpdateOpen(false)


                            }finally{
                              setUpdateLoading(false)
                            }
                          }}
                        >
                         {updateLoading ? <>
                         <div className="w-3 h-3 border rounded-full border-t-sky-500 animate-spin"></div>Updating...</>:" Update Changes"}
                        </Button>

                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Delete */}
                  <Dialog >
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="flex items-center">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-red-600">
                          Delete Course
                        </DialogTitle>
                      </DialogHeader>
                      <div className="py-4 text-sm text-muted-foreground">
                        Are you sure you want to delete{" "}
                        <span className="font-medium">{course.name}</span>?
                        This action cannot be undone.
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" >
                            Cancel
                          </Button>
                        </DialogClose>
                        {/* <Button variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button> */}
                        <Button
                          variant="destructive"
                          onClick={() => {
                            deleteCourses(course._id);
                            setOpen(false);
                          }}
                        >
                          Yes, Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>}
    </div>
  );
}


export default CoursesSection;