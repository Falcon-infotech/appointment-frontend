import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'
import { Edit, Group, PlusCircle, Trash } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import api from '@/constants/axiosInstance'
import { baseUrl } from '@/lib/base'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import toast from 'react-hot-toast'
import { Item } from '@radix-ui/react-select'



interface Batch {

}
const Batch = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [batch, setBatch] = useState([])
    const [] = useState()
    const [dialogOpen, setDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        batch: "",
        batchName: "",
        course: "",
        instructorName: "",
        startDate: "",
        endDate: "",
        branchName: "",
    });
    interface ValidationErrors {
        batch?: string;
        batchName?: string;
        course?: string;
        instructorName?: string;
        startDate?: string;
        endDate?: string;
        branchName?: string;
    }

    interface Error {
        branchId?: string;
        courseId?: string;
        fromDate?: string;
        toDate?: string;
    }
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchBatches = async (flag: boolean) => {
        if (flag) setLoading(true)
        try {

            const response = await api.get(`${baseUrl}/api/batch/all`)
            const data = response.data.batches
            console.log(data)
            setBatch(data || [])
        } catch (error) {
            console.error(error)

        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        fetchBatches(true)
    }, [])

    const [branches, setBranches] = useState([])
    const [courses, setCourses] = useState([]);
    const [instructer, setInstructer] = useState([])
    const [err, setErr] = useState<Error>({
        branchId: "",
        courseId: "",
        fromDate: "",
        toDate: "",
    })
    const [errors, setErrors] = useState<ValidationErrors>({});

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
            // console.log(data.courses)
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
            const response = await api.post(`${baseUrl}/api/batch/available_inspectors`, payload)
            const data = response.data
            setInstructer(data.availableInspectors)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchAllBranches()
        fetchCourses()
    }, [])


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

        setErrors(err)

        return Object.values(err).length === 0;
    };

    const handleDelete = async (id: string) => {
        const prevBranches = [...branches];

        setBranches((prev) => prev.filter((item) => item.id !== id));

        try {
            await api.delete(`${baseUrl}/api/batch/${id}`);
        } catch (error) {
            console.error("Delete failed, rolling back:", error);

            setBranches(prevBranches);
        }
    };



    const handleEdit = async () => {
        console.log(editingId)
        if (!validateForm()) return;

        const prevBatches = [...batch];

        const payload = {
            branchId: formData.branchName,
            courseId: formData.course,
            fromDate: formData.startDate,
            toDate: formData.endDate,
            code: formData.batch,
            inspectorId: formData.instructorName,
            name: formData.batchName,
        };

        setBatch(prev =>
            prev.map(b =>
                b._id === editingId
                    ? {
                        ...b,
                        _id: editingId,
                        code: formData.batch,
                        name: formData.batchName,
                        fromDate: formData.startDate,
                        toDate: formData.endDate,
                        branchId: branches.find(x => x._id === formData.branchName) || b.branchId,
                        courseId: courses.find(x => x._id === formData.course) || b.courseId,
                        inspectorId: instructer.find(x => x._id === formData.instructorName) || b.inspectorId,
                    }
                    : b
            )
        );
        setDialogOpen(false);

        try {
            const result = await api.put(`${baseUrl}/api/batch/${editingId}`, payload);

            if (result.status === 201) {
                toast.success("Batch Scheduled Successfully");

                setFormData({
                    batch: "",
                    batchName: "",
                    branchName: "",
                    course: "",
                    endDate: "",
                    instructorName: "",
                    startDate: "",
                });

            }
            // fetchBatches(false)
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while editing batch");

            // rollback
            setBatch(prevBatches);
        }
    };


    return (
        <div>
            <div className="flex items-center gap-2 p-6">
                <Group className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Batch Management</h2>
            </div>
            {loading ? (
                // Spinner
                <div className="flex justify-center items-center h-40">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : batch.length === 0 ? (
                // Empty state
                <div className="text-center text-sky-500 py-6">No Batches Found</div>
            ) : (
                // Table
                <div className="overflow-x-auto rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="w-[180px]">Batch Name</TableHead>
                                <TableHead className="w-[120px]">Code</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Inspector</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead className="text-center w-[150px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {batch.map((b) => (
                                <TableRow key={b._id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">{b.name}</TableCell>
                                    <TableCell>{b.code}</TableCell>
                                    <TableCell>{b.branchId?.branchName}</TableCell>
                                    <TableCell>{b.inspectorId?.name}</TableCell>
                                    <TableCell>{b.inspectorId?.email}</TableCell>
                                    <TableCell>{b.courseId?.name}</TableCell>
                                    <TableCell>{b.inspectorId?.phone}</TableCell>
                                    <TableCell>
                                        {new Date(b.fromDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(b.toDate).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "2-digit",
                                        })}
                                    </TableCell>
                                    <TableCell className="flex justify-center gap-2">

                                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-1"
                                                    onClick={() => {
                                                        setFormData({
                                                            batch: b.code || "",
                                                            batchName: b.name || "",
                                                            branchName: b.branchId?._id || "",
                                                            course: b.courseId?._id || "",
                                                            startDate: b.fromDate?.split("T")[0] || "",
                                                            endDate: b.toDate?.split("T")[0] || "",
                                                            instructorName: b.inspectorId?._id || "",
                                                        });
                                                        setEditingId(b._id);
                                                    }}

                                                >
                                                    <Edit className="h-4 w-4" /> Edit
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent className="sm:max-w-[550px] p-6">
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
                                                        <Select onValueChange={(v) => handleChange("branchName", v)} value={formData.branchName}  >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Branch Name" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {branches?.map((b) => (
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
                                                        <Select onValueChange={(v) => handleChange("course", v)} value={formData.course}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Course" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {courses?.map((c) => (
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
                                                                    instructer?.map((b) => (
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



                                                </div>

                                                {/* Footer */}
                                                <DialogFooter className="mt-6 flex justify-end gap-3">
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                        onClick={handleEdit}
                                                        type='submit'
                                                    >
                                                        Save
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Delete Confirmation Dialog */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="destructive" className="flex items-center">
                                                    <Trash className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-semibold text-red-600">
                                                        Delete Batch
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4 text-sm text-muted-foreground">
                                                    Are you sure you want to delete{" "}
                                                    <span className="font-medium">{b.name}</span>? This action
                                                    cannot be undone.
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => {
                                                            handleDelete(b._id)
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
        </div>

    )
}

export default Batch