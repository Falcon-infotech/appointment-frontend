import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

import React, { useEffect, useState } from "react";
import api from "@/constants/axiosInstance";
import { baseUrl } from "@/lib/base";
import ReportsTable from "@/components/ReportsTable";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { DialogClose, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import DialogTitle from "@mui/material/DialogTitle";
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

const Reports = () => {

    const today = new Date().toISOString().split("T")[0]
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<any[]>([])
    const [selectedInstructor, setSelectedInstructor] = useState<any | null>(null)

    const handleFilter = async () => {
        try {
            setLoading(true);
            const payload = {
                fromDate: fromDate,
                toDate: toDate
            }
            const response = await api.post(`${baseUrl}/api/report/instructor_report`, payload)
            const data = response.data;
            setData(data)
            setRows(data.reports)
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setLoading(false); // stop loading
        }
    };

    const handleExport = async () => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(rows)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Reports")
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
            const data = new Blob([excelBuffer], { type: "application/octet-stream" })
            saveAs(data, "reports.xlsx")


        } catch (error) {

        }
    };

    useEffect(() => {
        handleFilter()
    }, [])


    const totalRecords = rows.length
    const totalBatches = rows.reduce((sum, item) => sum + (item.totalBatches || 0), 0)
    const totalDays = rows.reduce((sum, item) => sum + (item.totalDays || 0), 0)




    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Date Range Filter */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <Calendar className="h-5 w-5 text-sky-600" />
                        Date Range Filter
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                        Select the date range to filter your records
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        {/* From Date */}
                        <div className="space-y-1">
                            <Label htmlFor="fromDate">From Date</Label>
                            <Input
                                id="fromDate"
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>

                        {/* To Date */}
                        <div className="space-y-1">
                            <Label htmlFor="toDate">To Date</Label>
                            <Input
                                id="toDate"
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:col-span-2 lg:col-span-1">
                            <Button
                                onClick={handleFilter}
                                className="bg-sky-600 hover:bg-sky-700 text-white w-full"
                            >
                                Submit
                            </Button>
                            <Button
                                onClick={handleExport}
                                variant="outline"
                                className="w-full"
                            >
                                Export
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Total Records */}
                <Card className="shadow-md hover:shadow-lg transition">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm text-gray-500">Total Records</p>
                            <p className="text-2xl font-bold text-sky-600">{totalRecords}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <Calendar className="h-6 w-6 text-sky-600" />
                        </div>
                    </CardContent>
                </Card>

                {/* Total Amount */}
                <Card className="shadow-md hover:shadow-lg transition">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm text-gray-500">Total Batches</p>
                            <p className="text-2xl font-bold text-sky-600">{totalBatches}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <Calendar className="h-6 w-6 text-sky-600" />
                        </div>
                    </CardContent>
                </Card>

                {/* Completed */}
                <Card className="shadow-md hover:shadow-lg transition">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm text-gray-500">Total Days</p>
                            <p className="text-2xl font-bold text-sky-600">{totalDays}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <Calendar className="h-6 w-6 text-sky-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <ReportsTable
                data={data}
                loading={loading}
                onRowClick={(row) => setSelectedInstructor(row)}
            />

            <Dialog open={!!selectedInstructor} onOpenChange={() => setSelectedInstructor(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Instructor Details</DialogTitle>
                    </DialogHeader>

                    {selectedInstructor && (
                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2">
                                <span className="font-medium">ID:</span>
                                <span>{selectedInstructor.instructorId}</span>
                            </div>
                            <div className="grid grid-cols-2">
                                <span className="font-medium">Name:</span>
                                <span>{selectedInstructor.instructorName}</span>
                            </div>
                            <div className="grid grid-cols-2">
                                <span className="font-medium">Email:</span>
                                <span>{selectedInstructor.email}</span>
                            </div>
                            <div className="grid grid-cols-2">
                                <span className="font-medium">Total Batches:</span>
                                <span>{selectedInstructor.totalBatches}</span>
                            </div>
                            <div className="grid grid-cols-2">
                                <span className="font-medium">Total Days:</span>
                                <span>{selectedInstructor.totalDays}</span>
                            </div>
                        </div>
                    )}

                    {/* Footer with Close button */}
                    <DialogFooter>
                        <Button onClick={() => setSelectedInstructor(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default Reports;
