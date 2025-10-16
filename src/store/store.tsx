
import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./Slices/Company.Slice";

export const store=configureStore({
    reducer:{
        company:companyReducer,
    }
})


export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch




//               <MultiSelect
//                 options={courses}
//                 value={newCompany?.courseIds?.map((id) => ({ _id: id })) || []}
//                 onChange={(val) =>
//                   setNewCompany({
//                     ...newCompany,
//                     courseIds: val.map((v) => v._id),
//                   })
//                 }
//                 />
      
//  const courseoptions= response.data.courses.map((course: any) => ({
//         value: course._id,
//         label: course.name,
//       }))
//       setCourses(courseoptions);