"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

import React, { useState } from "react";

type Report = {
    totalBatches: number;
    instructorId: string;
    instructorName: string;
    email: string;
    totalDays: number;
};

type ApiResponse = {
    success: boolean;
    reports: Report[];
};

const ReportsTable = ({ data, loading ,onRowClick}: { data: ApiResponse, loading: boolean,onRowclick:()=>void }) => {

    // console.log(data)
    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
                <span className="ml-2 text-sky-600">Loading reports...</span>
            </div>
        );
    }
    if (!data?.reports?.length) {
        return (
            <p className="text-center text-gray-500 text-sm">No reports available</p>
        );
    }

    // Take keys from the first object as table headers
    const columns = Object.keys(data.reports[0]);

    return (
        <div className="overflow-x-auto rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Instructor Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Total Batches</TableHead>
                        <TableHead>Total Days</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.reports?.map((row, i) => (
                        <TableRow
                            key={i}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => onRowClick(row)}  // <-- callback
                        >
                            <TableCell>{row.instructorName}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.totalBatches}</TableCell>
                            <TableCell>{row.totalDays}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    );
};

export default ReportsTable;
