import React, { use, useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, RefreshCcw, PlusCircle, Eye, EyeOff, Trash, Edit } from "lucide-react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { baseUrl } from "@/lib/base"
import api from "@/constants/axiosInstance"

type User = {
    _id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    role?: string
    createdAt: string
    updatedAt: string
    timeZone: string
}


const Settings = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [delLoading, setDelLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [EditId, setEditId] = useState("")

    const [newPassword, setNewPassword] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "+91",
    })

    function resetForm() {
        setFormData({
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            phone: ""
        })
    }

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await api.get(`${baseUrl}/api/user/all`)
            setUsers(response.data.data.users)  // ✅ map correctly
        } catch (error) {
            console.error("Error fetching users", error)
            toast.error("Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }





    useEffect(() => {
        fetchUsers()
    }, [])

    // 🔹 Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // 🔹 Submit Add User form
    // handle form submit (create / edit)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const payload = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
            }

            let response

            if (EditId) {
                response = await api.put(`${baseUrl}/api/user/${EditId}`, payload)

                if (response.status === 200) {
                    toast.success("User updated successfully")
                }
            } else {
                response = await api.post(`${baseUrl}/api/auth/register`, payload)

                if (response.status === 200 || response.status === 201) {
                    toast.success("User created successfully")
                }
            }

            resetForm()
            setEditId("")
            setOpen(false)
            fetchUsers()
        } catch (error: any) {
            console.error("Error:", error)
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    const handleResetPassword = (id: string) => {
        alert(`Password reset triggered for user ID: ${id}`)
    }

    const handleDelete = async (id) => {
        try {
            await api.delete(`${baseUrl}/api/user/${id}`)
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user", error)
        } finally {
        }
    }

    const handleUpdatePassword = async (id: string) => {
        if (!newPassword) {
            toast.error("Please enter a new password");
            return;
        }

        try {
            await api.put(`${baseUrl}/api/user/${id}/password`,
                { "password": newPassword },
            );

            toast.success("Password updated successfully!");
            setNewPassword("");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password");
        }
    };


    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle>User Management</CardTitle>
                    {/* 🔹 Add User Dialog */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <PlusCircle className="h-5 w-5 text-primary mr-2" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Add User</DialogTitle>
                                    <DialogDescription className="mb-2">
                                        Add a new user to give access
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="john@gmail.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid gap-3 relative">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-[70%] translate-y-[-50%] text-gray-500"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <DialogFooter className="mt-5">
                                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.first_name} {user.last_name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>{user.role || "User"}</TableCell>
                                        <TableCell className="text-right space-x-2">

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <RefreshCcw className="h-4 w-4 mr-1" /> Reset Password
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Update Password</DialogTitle>
                                                        <DialogDescription>
                                                            Enter a new password for <b>{user.name}</b>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <Input
                                                        type="password"
                                                        placeholder="New Password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                    <Button className="mt-3 w-full" onClick={() => handleUpdatePassword(user._id)}>
                                                        Save
                                                    </Button>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="secondary">
                                                        <Trash /> Delete
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-xl font-semibold text-red-600">
                                                            Delete Course
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="py-4 text-sm text-gray-600">
                                                        Are you sure you want to delete{" "}
                                                        <span className="font-medium">{user.first_name} {user.last_name}</span>? This
                                                        action cannot be undone.
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => {
                                                                handleDelete(user._id)
                                                            }}
                                                        >
                                                            Yes, Delete
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog >
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="secondary" onClick={() => {
                                                        setEditId(user._id)
                                                        setFormData({
                                                            email: user.email,
                                                            firstName: user.first_name,
                                                            lastName: user.last_name,
                                                            phone: user.phone
                                                        })
                                                    }}>
                                                        <Edit /> Edit
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <form onSubmit={handleSubmit}>
                                                        <DialogHeader>
                                                            <DialogTitle>Add User</DialogTitle>
                                                            <DialogDescription className="mb-2">
                                                                Add a new user to give access
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <div className="grid gap-4">
                                                            <div className="grid gap-3">
                                                                <Label htmlFor="firstName">First Name</Label>
                                                                <Input
                                                                    id="firstName"
                                                                    name="firstName"
                                                                    value={formData.firstName}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                            <div className="grid gap-3">
                                                                <Label htmlFor="lastName">Last Name</Label>
                                                                <Input
                                                                    id="lastName"
                                                                    name="lastName"
                                                                    value={formData.lastName}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                            <div className="grid gap-3">
                                                                <Label htmlFor="email">Email</Label>
                                                                <Input
                                                                    id="email"
                                                                    type="email"
                                                                    name="email"
                                                                    placeholder="john@gmail.com"
                                                                    value={formData.email}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>


                                                            <div className="grid gap-3">
                                                                <Label htmlFor="phone">Phone</Label>
                                                                <Input
                                                                    id="phone"
                                                                    type="tel"
                                                                    name="phone"
                                                                    value={formData.phone}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                        </div>

                                                        <DialogFooter className="mt-5">
                                                            <DialogClose asChild>
                                                                <Button variant="outline">Cancel</Button>
                                                            </DialogClose>
                                                            <Button type="submit">Save changes</Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Settings
