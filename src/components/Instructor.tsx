import React, { useEffect, useState } from "react";
import { Plus, Users2, Edit, Trash2, Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import api from "@/constants/axiosInstance";
import { baseUrl } from "@/lib/base";
import toast from "react-hot-toast";

type Instructor = {
  _id?: string | number;  
  name: string;
  email: string;
  phone: number;
};

const Instructor = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [err, setErr] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<any | null>(null);

  const [drawer, setDrawer] = useState<Boolean>(false)
  const [loadingInstructer, setLoadingInstructer] = useState(false);
  const [inspectorById, setInstructorById] = useState<Instructor>({
    email:"",
    name:"",
    phone:0,
    _id:""
  })


  const handleRowClick = (id: any) => {
    setDrawer(true);
    getById(id);
  };


  const getById = async (id: string) => {
    try {
      setLoadingInstructer(true);
      setInstructorById({
        email:"",
        name:"",
        phone:0,
        _id:""
      });
      const response = await api.get(`${baseUrl}/api/inspector/${id}`);
      setInstructorById(response.data.inspector);
    } catch (error) {
      console.error("Error fetching branch:", error);
    } finally {
      setLoadingInstructer(false);
    }
  };


  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const res = await api.get(`${baseUrl}/api/inspector/all`);
        const data = res.data?.inspectors;
        // console.log(data)
        setInstructors(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: ""
    })
    setErr({

    })
  }

  function validation() {
    let error: { [key: string]: string } = {};
    if (!form.name) error.name = "Branch name is required";
    if (!form.email) error.email = "email is required";
    if (!form.phone) error.phone = "Phone number code is required";

    setErr(error);
    return Object.keys(error).length === 0;
  }

  const handleAddOrUpdate = async () => {
    if (!validation()) return;

    if (editingId) {

      const prevInstructors = [...instructors];


      setInstructors(
        instructors.map((inst) =>
          inst._id === editingId
            ? { ...inst, ...form, phone: Number(form.phone) }
            : inst
        )
      );
      setOpen(false)

      try {
        const res = await api.put(`${baseUrl}/api/inspector/${editingId}`, form);
        if (res.status === 200) {
          toast.success("Instructor updated successfully");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to update instructor");

        setInstructors(prevInstructors);
      }
    } else {
      const prevInstructors = [...instructors];
      const tempId = Date.now();

      const newInstructor = { _id: tempId, ...form, phone: Number(form.phone) };
      setInstructors([...instructors, newInstructor]);
      setOpen(false)

      try {
        const res = await api.post(`${baseUrl}/api/inspector/create`, form);
        if (res.status === 200) {
          toast.success("Instructor added successfully");

          // Replace tempId with real backend _id
          const created = res.data?.inspector;
          if (created?._id) {
            setInstructors((curr) =>
              curr.map((inst) =>
                inst._id === tempId ? { ...created } : inst
              )
            );
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to add instructor");
        setInstructors(prevInstructors);
      }
    }

    setOpen(false);
    resetForm();
    setEditingId(null);
  };



  const handleDelete = async (id: string) => {
    const prevInstructors = [...instructors];

    setInstructors(instructors.filter((inst) => inst._id !== id));

    try {
      const res = await api.delete(`${baseUrl}/api/inspector/${id}`);
      if (res.status === 200) {
        toast.success("Instructor deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete instructor");
      setInstructors(prevInstructors);
    }
  };




  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users2 className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Instructor Management</h2>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:opacity-90 transition" onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add Instructor
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Add New Instructor
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {["name", "email", "phone"].map((key) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="capitalize">
                    {key} *
                  </Label>
                  <Input
                    id={key}
                    name={key}
                    type={key === "phone" ? "number" : "text"}
                    placeholder={`Enter ${key}`}
                    value={(form as any)[key]}
                    onChange={handleChange}
                  />{
                    err[key] && <p className="text-red-500">{err[key]}</p>
                  }
                </div>
              ))}
              <Button
                onClick={handleAddOrUpdate}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                {editingId ? "Update Instructor" : "Add Instructor"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Section */}
      {loading ? (
        // Spinner
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : instructors.length === 0 ? (
        // Empty state
        <div className="text-center text-sky-500 py-6">
          No Instructors Found
        </div>
      ) : (
        // Table
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-center w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructors.map((inst) => (
                <TableRow key={inst._id} className="hover:bg-gray-50" onClick={() => {
                  handleRowClick(inst._id)
                }}>
                  <TableCell className="font-medium">{inst.name}</TableCell>
                  <TableCell>{inst.email}</TableCell>
                  <TableCell>{inst.phone}</TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setForm({
                          email: inst.email,
                          name: inst.name,
                          phone: inst.phone
                        })
                        setOpen(true)
                        setEditingId(inst._id)
                      }}

                    >
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Dialog >
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="flex items-center" onClick={(e) => e.stopPropagation()} >
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
                          <span className="font-medium">{inst.name}</span>?
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(inst?._id)

                            }}
                          >
                            Yes, Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={drawer} onOpenChange={setDrawer}>
        <DialogContent className="sm:max-w-[750px] rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {loadingInstructer ? "Loading inspector..." : inspectorById?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {loadingInstructer
                ? "Fetching inspector details..."
                : "Here are the complete details of the selected inspector."}
            </DialogDescription>
          </DialogHeader>

          {loadingInstructer ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : inspectorById ? (
            <div className="space-y-6">
              {/* Inspector Info */}
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border">
                <div>
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Name
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {inspectorById?.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Email
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {inspectorById?.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Phone
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {inspectorById?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Total Batches
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {inspectorById?.totalBatches}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Created At
                  </p>
                  <p className="text-sm font-medium text-green-700">
                    {new Date(inspectorById?.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Updated At
                  </p>
                  <p className="text-sm font-medium text-blue-700">
                    {new Date(inspectorById?.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Courses */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Assigned Courses
                </h3>
                {inspectorById.courseIds?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4">Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-1/6 text-center">Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inspectorById.courseIds.map((course, idx) => (
                        <TableRow
                          key={course._id}
                          className={idx % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <TableCell className="font-medium text-gray-800">
                            {course.name}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {course.description || "-"}
                          </TableCell>
                          <TableCell className="text-center text-gray-700">
                            {course.duration ? `${course.duration} Days` : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No courses assigned to this inspector.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-500 text-center py-6">
              Failed to load inspector details.
            </p>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="rounded-lg">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default Instructor;
