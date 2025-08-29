import {
  HomeIcon,
  Building,
  Book,
  BarChartHorizontalBig,
  Users,
  LayoutDashboard,
  PlusCircle,
  ReceiptPoundSterlingIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { baseUrl } from "@/lib/base";
import api from "@/constants/axiosInstance";

const items = [
  { title: "Home", url: "/home", icon: HomeIcon },
  { title: "Company", url: "/company", icon: Building },
  { title: "Courses", url: "/courses", icon: Book },
  { title: "Instructor", url: "/instructor", icon: Users },
  { title: "Batches", url: "/batches", icon: BarChartHorizontalBig },
  { title: "Reports", url: "/reports", icon: ReceiptPoundSterlingIcon },
];

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();
  const location = useLocation();
  const [opens, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    batch: "",
    batchName: "",
    course: "",
    instructorName: "",
    startDate: "",
    endDate: "",
    branchName: "",
    scheduledBy: ""
  });
  interface ValidationErrors {
    batch?: string;
    batchName?: string;
    course?: string;
    instructorName?: string;
    startDate?: string;
    endDate?: string;
    branchName?: string;
    scheduledBy?: string
  }

  interface Error {
    branchId?: string;
    courseId?: string;
    fromDate?: string;
    toDate?: string;
  }
  const navigate = useNavigate();


  const [branches, setBranches] = useState<any>([])
  const [courses, setCourses] = useState([]);
  const [instructer, setInstructer] = useState([])
  const [err, setErr] = useState<Error>({
    branchId: "",
    courseId: "",
    fromDate: "",
    toDate: "",
  })
  const [errors, setErrors] = useState<ValidationErrors>({});


  const getById = async (id: string) => {
    try {
      const response = await api.get(`${baseUrl}/api/branch/${id}`);
      setCourses(response.data.branch?.courseIds)
    } catch (error) {
      console.error("Error fetching branch:", error);
    } finally {
      // setLoadingBranch(false);
    }
  };

  useEffect(() => {


    if (formData.branchName) {
      getById(formData.branchName); 
    }
  }, [formData.branchName])




  const fetchAllBranches = async () => {

    try {
      const response = await api.get(`${baseUrl}/api/branch/all`);
      // console.log(response.data?.branches)
      setBranches(response.data?.branches || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get(`${baseUrl}/api/course/all`)
      const data = response.data

      setCourses(data.courses)
    } catch (error) {
      console.error(error);
    }
  }


  function checkavailablityval() {
    let err: { [key: string]: string } = {};
    if (!formData.branchName) {
      err.branchId = "Branch is required";
    }
    if (!formData.course) {
      err.courseId = "Course is required";
    }
    if (!formData.startDate) {
      err.fromDate = "Start date is required";
    }

    if (!formData.endDate) {
      err.toDate = "End date is required";
    }

    setErr(err)

    return Object.values(err).length === 0
  }
  const checkAvailable = async () => {

    try {
      if (!checkavailablityval()) {
        return;
      }
      let payload = {
        "branchId": formData.branchName,
        "courseId": formData.course,
        "fromDate": formData.startDate,
        "toDate": formData.endDate,
      }
      const response = await api.post(`${baseUrl}/api/batch/available_instructors`, payload)
      const data = response.data
      setInstructer(data.availableInstructors)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAllBranches()
    fetchCourses()
  }, [])

  // api/batch/bookBatch

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const validateForm = (): boolean => {
    let err: ValidationErrors = {};

    if (!formData.batch) err.batch = "Batch is required";
    if (!formData.batchName.trim()) err.batchName = "Batch name is required";
    if (!formData.course) err.course = "Course is required";
    if (!formData.instructorName) err.instructorName = "Instructor is required";
    if (!formData.startDate) err.startDate = "Start date is required";
    if (!formData.endDate) err.endDate = "End date is required";
    else if (formData.startDate && formData.endDate < formData.startDate) {
      err.endDate = "End date cannot be before start date";
    }
    if (!formData.branchName) err.branchName = "Branch is required";
    // if (!formData.scheduledBy) err.scheduledBy = "ScheduledBy is required";

    setErrors(err)

    return Object.values(err).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }
    setLoading(true)
    try {
      const payload = {
        "branchId": formData.branchName,
        "courseId": formData.course,
        "fromDate": formData.startDate,
        "toDate": formData.endDate,
        "code": formData.batch,
        "instructorId": formData.instructorName,
        "name": formData.batchName,
        // "scheduledBy":formData.scheduledBy
      }
      const result = await api.post(`${baseUrl}/api/batch/bookBatch`, payload)
      if (result.status === 201) {
        toast.success("Batch Scheduled Successfully");
        setFormData({
          batch: "",
          batchName: "",
          branchName: "",
          course: "",
          endDate: "",
          instructorName: "",
          startDate: ""
        })
      }

    } catch (error) {
      console.error(error)
      toast.error("something happen while creating batch")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  };

  return (
    <Sidebar className="bg-white border-r shadow-sm">
      <SidebarContent className="overflow-y-auto no-scrollbar">
        {/* Mobile Close Button */}
        {open && (
          <div className="flex justify-end p-4 sm:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex items-center gap-2 px-5 py-6">
          <LayoutDashboard className="h-6 w-6 text-sky-600" />
          <h2 className="text-xl font-bold text-gray-800 tracking-wide">
            Dashboard
          </h2>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200 mx-4 mb-4" />

        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase font-semibold px-5 py-2 tracking-wider">
            Main Menu
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {items?.map((item) => {
                const isActive = location?.pathname === item?.url;
                return (
                  <SidebarMenuItem key={item?.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item?.url}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 
                          ${isActive
                            ? "bg-sky-500 text-white font-semibold shadow-sm hover:bg-sky-500"
                            : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                          }`}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            toggleSidebar()
                          }
                        }}


                      >
                        <item.icon
                          className={`h-5 w-5 transition-transform duration-200 ${isActive
                            ? "text-white"
                            : "text-gray-500 group-hover:scale-110"
                            }`}
                        />
                        {<span>{item?.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <Dialog open={opens} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 gap-2 ">
                    <PlusCircle className="w-4 h-4" />
                    Add Batch Schedule
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[550px] p-6  overflow-y-auto max-sm:h-[100%]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                      Create Batch Schedule
                    </DialogTitle>
                  </DialogHeader>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {/* Batch */}
                    <div className="space-y-2">
                      <Label>Batch Code *</Label>
                      {/* <Select onValueChange={(v) => handleChange("batch", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Batch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="batch1">Batch 1</SelectItem>
                          <SelectItem value="batch2">Batch 2</SelectItem>
                        </SelectContent>
                      </Select> */}
                      <Input
                        type="text"
                        onChange={(v) => handleChange("batch", v.target.value)}
                        value={formData.batch}
                      />
                      {errors?.batch && (
                        <p className="text-sm text-red-500">{errors.batch}</p>
                      )}

                    </div>

                    {/* Batch Name */}
                    <div className="space-y-2">
                      <Label>Batch Name *</Label>
                      {/* <Select onValueChange={(v) => handleChange("batchName", v)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Batch Name" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alpha">Alpha</SelectItem>
                            <SelectItem value="beta">Beta</SelectItem>
                          </SelectContent>
                        </Select> */}
                      <Input
                        type="text"
                        onChange={(v) => handleChange("batchName", v.target.value)}
                        value={formData.batchName}
                      />
                      {errors?.batchName && (
                        <p className="text-sm text-red-500">{errors.batchName}</p>
                      )}
                    </div>

                    {/* Branch */}
                    <div className="space-y-2">
                      <Label>Branch Name *</Label>
                      <Select onValueChange={(v) => handleChange("branchName", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Branch Name" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches?.map((b: any) => (
                            <SelectItem key={b._id} value={b._id}>
                              {b.branchName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {err.branchId && <p className="text-sm text-red-500">{err.branchId}</p>}
                      {errors?.branchName && (
                        <p className="text-sm text-red-500">{errors.branchName}</p>
                      )}
                    </div>

                    {/* Course */}
                    <div className="space-y-2">
                      <Label>Course *</Label>
                      <Select onValueChange={(v) => handleChange("course", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses?.map((c: any) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {err.courseId && <p className="text-sm text-red-500">{err.courseId}</p>}
                      {errors?.course && (
                        <p className="text-sm text-red-500">{errors.course}</p>
                      )}
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleChange("startDate", e.target.value)}
                      />
                      {err.fromDate && <p className="text-sm text-red-500">{err.fromDate}</p>}
                      {errors?.startDate && (
                        <p className="text-sm text-red-500">{errors.startDate}</p>
                      )}
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleChange("endDate", e.target.value)}
                      />
                      {err.toDate && <p className="text-sm text-red-500">{err.toDate}</p>}
                      {errors?.endDate && (
                        <p className="text-sm text-red-500">{errors.endDate}</p>
                      )}
                    </div>


                    <div className="space-y-2">
                      <Label>
                        check available Instructers
                      </Label>
                      <Button onClick={checkAvailable}>View</Button>
                    </div>


                    {/* Instructor */}
                    <div className="space-y-2">
                      <Label>Instructor Name *</Label>
                      <Select onValueChange={(v) => handleChange("instructorName", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Instructor" />
                        </SelectTrigger>
                        <SelectContent>
                          {instructer?.length === 0 ? (
                            <p className="text-gray-500 px-2 py-1">No Instructor available</p>
                          ) : (
                            instructer?.map((b: any) => (
                              <SelectItem key={b._id} value={b._id}>
                                {b.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors?.instructorName && (
                        <p className="text-sm text-red-500">{errors.instructorName}</p>
                      )}
                    </div>



                    {/* Scheduled By */}
                    {/* <div className="space-y-2 sm:col-span-2">
                      <Label>Scheduled By *</Label>
                      <Select onValueChange={(v) => handleChange("scheduledBy", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Person" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors?.scheduledBy && (
                        <p className="text-sm text-red-500">{errors.scheduledBy}</p>
                      )}
                    </div> */}
                  </div>

                  {/* Footer */}
                  <DialogFooter className="mt-6 flex justify-end gap-3">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Logout & Avatar - Mobile Only */}
      <div className="absolute bottom-4 mx-4 w-[calc(100%-2rem)] md:hidden">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-3 flex items-center justify-between">
          {/* Avatar */}
          <div className="flex items-center gap-3">
            <Avatar className="border border-gray-300 hover:scale-105 transition-transform duration-200">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-gray-800">Ajay Yadav</p>
              <p className="text-xs text-gray-500">Logged in</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated")
              localStorage.removeItem("info")
              navigate("/login")
            }}
            className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 active:scale-95 transition-all duration-200 shadow-sm"

          >
            Logout
          </button>
        </div>
      </div>
    </Sidebar >
  );
}

export default AppSidebar;
