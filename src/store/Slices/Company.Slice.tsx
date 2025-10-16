// src/features/company/companySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "@/lib/base";
import api from "../../constants/axiosInstance";



// src/features/company/companyTypes.ts
export interface Course {
    _id: string;
    name: string;
    description?: string;
    duration?: number;
}

export interface Branch {
    _id: string;
    branchName: string;
    country: string;
    branchCode: string;
    address: string;
    courseIds: Course[]; // use Course[] if populated, string[] if only IDs
    createdAt: string;
    updatedAt: string;
}

export interface NewCompany {
    branchName: string;
    country: string;
    branchCode: string;
    address: string;
    courseIds: string[] | null;
}

interface CompanyState {
    branches: Branch[];
    branchById: Branch | null;
    courses: Course[];
    loadingBranches: boolean;
    loadingBranch: boolean;
    addLoading: boolean;
    error: string | null;
    Instrctor: Instructor[]
    loadingBatches: boolean,
    Batches: any;
    loadingCourses: boolean,
    addCourseLoading:boolean
}


type Instructor = {
    _id?: string | number;
    name: string;
    email: string;
    phone: number;
};



const initialState: CompanyState = {
    branches: [],
    branchById: null,
    courses: [],
    loadingBranches: false,
    loadingBranch: false,
    addLoading: false,
    addCourseLoading: false,
    error: null,
    loadingBatches: false,
    Batches: {},
    Instrctor: [],
    loadingCourses: false
};

// ✅ Async thunks
export const fetchAllBranches = createAsyncThunk("company/fetchAll", async () => {
    const res = await api.get(`${baseUrl}/api/branch/all`);
    return res.data.branches as Branch[];
});

export const fetchBranchById = createAsyncThunk("company/fetchById", async (id: string) => {
    const res = await api.get(`${baseUrl}/api/branch/${id}`);
    return res.data.branch as Branch;
});



export const addBranch = createAsyncThunk("company/add", async (payload: NewCompany) => {
    const res = await api.post(`${baseUrl}/api/branch/create`, payload);
    return res.data.branch as Branch;
});

export const updateBranch = createAsyncThunk(
    "company/update",
    async ({ id, data }: { id: string; data: NewCompany }) => {
        const res = await api.put(`${baseUrl}/api/branch/${id}`, data);
        return res.data.branch as Branch;
    }
);

export const deleteBranch = createAsyncThunk("company/delete", async (id: string) => {
    await api.delete(`${baseUrl}/api/branch/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessTokennew")}` },
    });
    return id;
});


export const fetchBatches = createAsyncThunk("company/fetchBaches", async () => {
    const res = await api.get(`${baseUrl}/api/batch/all`);
    return res.data as any;
})


export const fetchCourse = createAsyncThunk("company/fetchCourses", async () => {
    const res = await api.get(`${baseUrl}/api/course/all`);
    return res.data.courses as Course[];
});



export const AddCourse=createAsyncThunk("company/addCourses",async(addedCourse,thunkApi)=>{
     const response =await api.post(`${baseUrl}/api/course/create`,addedCourse)
     return response.data?.course as Course
})

// ✅ Slice
const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {
        resetBranchById: (state) => {
            state.branchById = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch all
            .addCase(fetchAllBranches.pending, (state) => {
                state.loadingBranches = true;
            })
            .addCase(fetchAllBranches.fulfilled, (state, action) => {
                state.loadingBranches = false;
                state.branches = action.payload;
            })
            .addCase(fetchAllBranches.rejected, (state, action) => {
                state.loadingBranches = false;
                state.error = action.error.message || "Failed to fetch branches";
            })

            // fetch by id
            .addCase(fetchBranchById.pending, (state) => {
                state.loadingBranch = true;
            })
            .addCase(fetchBranchById.fulfilled, (state, action) => {
                state.loadingBranch = false;
                state.branchById = action.payload;
            })
            .addCase(fetchBranchById.rejected, (state, action) => {
                state.loadingBranch = false;
                state.error = action.error.message || "Failed to fetch branch";
            })



            // add branch
            .addCase(addBranch.pending, (state) => {
                state.addLoading = true;
            })
            .addCase(addBranch.fulfilled, (state, action) => {
                state.addLoading = false;
                state.branches.push(action.payload);
            })
            .addCase(addBranch.rejected, (state, action) => {
                state.addLoading = false;
                state.error = action.error.message || "Failed to add branch";
            })

            .addCase(updateBranch.fulfilled, (state, action) => {
                const idx = state.branches.findIndex((b) => b._id === action.payload._id);
                if (idx !== -1) state.branches[idx] = action.payload;
            })

            .addCase(deleteBranch.fulfilled, (state, action) => {
                state.branches = state.branches.filter((b) => b._id !== action.payload);
            })


            .addCase(fetchBatches.pending, (state) => {
                state.loadingBatches = true;
            })
            .addCase(fetchBatches.fulfilled, (state, action) => {
                state.Batches = action.payload;
            })
            .addCase(fetchBatches.rejected, (state, action) => {
                state.loadingBatches = false;
                state.error = action.error.message || "Failed to fetch batches";
            })
            // fetch courses
            .addCase(fetchCourse.fulfilled, (state, action) => {
                state.courses = action.payload;
            })
            .addCase(fetchCourse.pending, (state, action) => {
                state.loadingCourses = true;
            })
            .addCase(fetchCourse.rejected, (state, action) => {
                state.error = action.error.message || "Failed to fetch Courses";;
            })

            .addCase(AddCourse.pending,(state)=>{
                state.addLoading=true
            })
            .addCase(AddCourse.fulfilled,(state,action)=>{
                state.courses.push(action.payload)
                state.addLoading=false
            })
            .addCase(AddCourse.rejected,(state,action)=>{
                state.error=action.error.message || "Failed to Add Courses"
            })











    },
});

export const { resetBranchById } = companySlice.actions;
export default companySlice.reducer;
