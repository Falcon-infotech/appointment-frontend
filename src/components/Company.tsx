import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MoreVertical,
  ChevronsUpDown,
  Edit,
  Trash2,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { baseUrl } from "@/lib/base";
import toast from "react-hot-toast";
import axios from "../constants/axiosInstance";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "../constants/axiosInstance";

interface Branch {
  _id: string;
  branchName: string;
  country: string;
  branchCode: string;
  address: string;
  courseIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface NewCompany {
  branchName: string;
  country: string;
  branchCode: string;
  address: string;
  courseIds: string[] | null;
}

export default function Company() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [err, setErr] = useState<{ [key: string]: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [addloading, setAddLoading] = useState(false);
  // {{base_url}}/api/branch/:id
  // Add/Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [branchById, setBranchById] = useState<Branch>()
  const [drawer, setDrawer] = useState<Boolean>(false)
  const [loadingBranch, setLoadingBranch] = useState(false);

  const [newCompany, setNewCompany] = useState<NewCompany>({
    branchName: "",
    country: "",
    branchCode: "",
    address: "",
    courseIds: [],
  });


  function validation() {
    let error: { [key: string]: string } = {};
    if (!newCompany.branchName) error.branchName = "Branch name is required";
    if (!newCompany.country) error.country = "Country is required";
    if (!newCompany.branchCode) error.branchCode = "Branch code is required";
    if (!newCompany.address) error.address = "Address is required";
    setErr(error);
    return Object.keys(error).length === 0;
  }


  const resetForm = () => {
    setNewCompany({
      branchName: "",
      country: "",
      branchCode: "",
      address: "",
      courseIds: [],
    });
    setIsAddDialogOpen(false);
    setIsEditMode(false);
    setEditingBranchId(null);
    setErr(null);
  };


  const handleCourseChange = (courseId: string) => {
    setNewCompany((prev) => {
      if (prev.courseIds?.includes(courseId)) {
        return {
          ...prev,
          courseIds: prev.courseIds.filter((id) => id !== courseId),
        };
      } else {
        return {
          ...prev,
          courseIds: [...(prev.courseIds || []), courseId],
        };
      }
    });
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/course/all`);
      setCourses(response.data.courses);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllBranches(true);
    fetchCourses();
  }, []);

  // initial load

  const fetchAllBranches = async (flag: boolean) => {
    if (flag) setLoadingBranches(true);
    try {
      const response = await axios.get(`${baseUrl}/api/branch/all`);
      // console.log(response.data?.branches)
      setBranches(response.data?.branches || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoadingBranches(false);
    }
  };


  // add and edit
  const handleSubmitCompany = async () => {
    if (!validation()) return;
    setAddLoading(true);

    try {
      if (isEditMode && editingBranchId) {
        const response = await axios.put(
          `${baseUrl}/api/branch/${editingBranchId}`,
          newCompany
        );
        if (response.status === 200) toast.success("Branch updated successfully");
      } else {
        const response = await axios.post(
          `${baseUrl}/api/branch/create`,
          newCompany
        );
        if (response.status === 201) toast.success("Branch added successfully");
      }
      fetchAllBranches(false);
      resetForm();
    } catch (error) {
      toast.error(isEditMode ? "Failed to update branch" : "Failed to add branch");
    } finally {
      setAddLoading(false);
    }
  };

  // delete branch
  const handleDeleteBranch = async (id: string) => {

    const prevState = [...branches];

    setBranches((prev) => prev.filter((item) => item._id !== id));

    try {
      const response = await axios.delete(`${baseUrl}/api/branch/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessTokennew")}`,
        },
      });

      if (response.status === 200) {
        // toast.success("Branch deleted successfully");
      } else {
        setBranches(prevState);
        toast.error("Failed to delete branch");
      }
    } catch (error) {
      console.error(error);
      setBranches(prevState);
      toast.error("Something went wrong while deleting");
    }
  };


  // get single by id

  const getById = async (id: string) => {
    try {
      setLoadingBranch(true);
      setBranchById(null);
      const response = await api.get(`${baseUrl}/api/branch/${id}`);
      setBranchById(response.data.branch);
    } catch (error) {
      console.error("Error fetching branch:", error);
    } finally {
      setLoadingBranch(false);
    }
  };

  const handleRowClick = (id: string) => {
    setDrawer(true);
    getById(id);
  };



  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <div className="flex items-center gap-2 p-3">
          <Building className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Company Management</h2>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              onClick={() => {
                resetForm();
                setIsEditMode(false);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Company" : "Add New Company"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {(["Company Name", "country", "Company Code", "address"] as const).map(
                (key) => (
                  <div key={key}>
                    <Label className="py-2">
                      {key.replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Label>
                    <Input
                      type="text"
                      placeholder={key}
                      value={newCompany[key] as string}
                      onChange={(e) =>
                        setNewCompany({ ...newCompany, [key]: e.target.value })
                      }
                    />
                    {err?.[key] && (
                      <p className="text-red-500 text-xs mt-1">{err[key]}</p>
                    )}
                  </div>
                )
              )}

              {/* Courses */}
              <Popover open={open} onOpenChange={setOpen}>
                <Label>
                  Courses
                </Label>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {courses.length > 0
                      ? `${newCompany?.courseIds?.length} selected`
                      : "Select courses..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {courses.map((item: any) => (
                          <CommandItem
                            key={item?._id}
                            onSelect={() => handleCourseChange(item._id)}
                          >
                            <Checkbox
                              checked={newCompany?.courseIds?.includes(item._id)}
                              onCheckedChange={() =>
                                handleCourseChange(item._id)
                              }
                              className="mr-2"
                            />
                            {item?.name}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <Button
                onClick={handleSubmitCompany}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={addloading}
              >
                {addloading
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                    ? "Update Company"
                    : "Add Company"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loadingBranches ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : branches.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground mt-6">
            No branches found.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Comapany Code</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches
                .filter(
                  (branch) =>
                    branch?.branchName
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    branch?.country
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((branch) => (
                  <TableRow
                    key={branch._id}
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => handleRowClick(branch._id)}
                  >
                    <TableCell className="font-medium">
                      {branch.branchName}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200">
                        {branch.country}
                      </Badge>
                    </TableCell>
                    <TableCell>{branch.branchCode}</TableCell>
                    <TableCell>{branch.address}</TableCell>
                    <TableCell>{branch?.courseIds?.length}</TableCell>
                    <TableCell>
                      {new Date(branch.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewCompany({
                            address: branch.address,
                            branchCode: branch.branchCode,
                            branchName: branch.branchName,
                            country: branch.country,
                            courseIds: branch.courseIds,
                          });
                          setEditingBranchId(branch._id);
                          setIsEditMode(true);
                          setIsAddDialogOpen(true); 
                        }}
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBranch(branch._id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modal */}
      <Dialog open={drawer} onOpenChange={setDrawer}>
        <DialogContent className="sm:max-w-[750px] rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {loadingBranch ? "Loading branch..." : branchById?.branchName}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {loadingBranch
                ? "Fetching details..."
                : "Here are the complete details of the selected branch."}
            </DialogDescription>
          </DialogHeader>

          {loadingBranch ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : branchById ? (
            <div className="space-y-6">
              {/* Branch Info */}
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border">
                <div>
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Country
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {branchById.country}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Branch Code
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {branchById.branchCode}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Address
                  </p>
                  <p className="text-base font-semibold text-gray-800">
                    {branchById.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Created At
                  </p>
                  <p className="text-sm font-medium text-green-700">
                    {new Date(branchById.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 tracking-wide">
                    Updated At
                  </p>
                  <p className="text-sm font-medium text-blue-700">
                    {new Date(branchById.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Courses */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Assigned Courses
                </h3>
                {branchById.courseIds?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4">Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-1/6 text-center">Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {branchById.courseIds.map((course, idx) => (
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
                    No courses assigned to this branch.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-500 text-center py-6">
              Failed to load branch details.
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
}
