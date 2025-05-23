// // app/addresses/page.tsx
// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// const addressSchema = z.object({
//   type: z.string().min(1, "Type is required"),
//   firstName: z.string().min(2, "First name must be at least 2 characters"),
//   lastName: z.string().min(2, "Last name must be at least 2 characters"),
//   company: z.string().optional(),
//   address1: z.string().min(1, "Address line 1 is required"),
//   address2: z.string().optional(),
//   city: z.string().min(1, "City is required"),
//   state: z.string().min(1, "State is required"),
//   postalCode: z.string().min(1, "Postal code is required"),
//   country: z.string().min(1, "Country is required"),
//   phone: z.string().min(1, "Phone is required"),
//   isDefault: z.boolean().optional(),
// });

// type AddressFormData = z.infer<typeof addressSchema>;

// export default function Addresses() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [addresses, setAddresses] = useState([]);
//   const [editingAddress, setEditingAddress] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<AddressFormData>({
//     resolver: zodResolver(addressSchema),
//   });

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/sign-in");
//     }
//   }, [status, router]);

//   useEffect(() => {
//     const fetchAddresses = async () => {
//       try {
//         const response = await fetch("/api/user/addresses");
//         const result = await response.json();

//         if (response.ok) {
//           setAddresses(result);
//         }
//       } catch (error) {
//         console.error("Fetch addresses error:", error);
//       }
//     };

//     if (session?.user?.id) {
//       fetchAddresses();
//     }
//   }, [session?.user?.id]);

//   const onSubmit = async (data: AddressFormData) => {
//     try {
//       setLoading(true);
//       setError("");

//       let response;

//       if (editingAddress) {
//         response = await fetch(`/api/user/addresses/${editingAddress.id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data),
//         });
//       } else {
//         response = await fetch("/api/user/addresses", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data),
//         });
//       }

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Operation failed");
//       }

//       setSuccess(true);
//       reset();
//       setEditingAddress(null);

//       // Refresh addresses
//       const addressesResponse = await fetch("/api/user/addresses");
//       const addressesResult = await addressesResponse.json();

//       if (addressesResponse.ok) {
//         setAddresses(addressesResult);
//       }
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (address: any) => {
//     setEditingAddress(address);
//     reset({
//       type: address.type,
//       firstName: address.firstName,
//       lastName: address.lastName,
//       company: address.company || "",
//       address1: address.address1,
//       address2: address.address2 || "",
//       city: address.city,
//       state: address.state,
//       postalCode: address.postalCode,
//       country: address.country,
//       phone: address.phone,
//       isDefault: address.isDefault,
//     });
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(`/api/user/addresses/${id}`, {
//         method: "DELETE",
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Deletion failed");
//       }

//       // Refresh addresses
//       const addressesResponse = await fetch("/api/user/addresses");
//       const addressesResult = await addressesResponse.json();

//       if (addressesResponse.ok) {
//         setAddresses(addressesResult);
//       }
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (success) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div className="text-center">
//             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
//               <svg
//                 className="h-6 w-6 text-green-600"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//               {editingAddress ? "Address Updated" : "Address Added"}
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Your address has been {editingAddress ? "updated" : "added"}{" "}
//               successfully.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">Addresses</h1>
//         <div className="bg-white shadow rounded-lg p-6">
//           <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
//                 {error}
//               </div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="type"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Type
//                 </label>
//                 <select
//                   {...register("type")}
//                   className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 >
//                   <option value="">Select type</option>
//                   <option value="home">Home</option>
//                   <option value="work">Work</option>
//                   <option value="other">Other</option>
//                 </select>
//                 {errors.type && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.type.message}
//                   </p>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label
//                     htmlFor="firstName"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     First Name
//                   </label>
//                   <input
//                     {...register("firstName")}
//                     type="text"
//                     className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="First name"
//                   />
//                   {errors.firstName && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.firstName.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="lastName"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Last Name
//                   </label>
//                   <input
//                     {...register("lastName")}
//                     type="text"
//                     className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="Last name"
//                   />
//                   {errors.lastName && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.lastName.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label
//                   htmlFor="company"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Company (Optional)
//                 </label>
//                 <input
//                   {...register("company")}
//                   type="text"
//                   className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Company"
//                 />
//                 {errors.company && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.company.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="address1"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Address Line 1
//                 </label>
//                 <input
//                   {...register("address1")}
//                   type="text"
//                   className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Address line 1"
//                 />
//                 {errors.address1 && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.address1.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="address2"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Address Line 2 (Optional)
//                 </label>
//                 <input
//                   {...register("address2")}
//                   type="text"
//                   className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Address line 2"
//                 />
//                 {errors.address2 && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.address2.message}
//                   </p>
//                 )}
//               </div>

//               <div className="grid grid-cols-3 gap-4">
//                 <div>
//                   <label
//                     htmlFor="city"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     City
//                   </label>
//                   <input
//                     {...register("city")}
//                     type="text"
//                     className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="City"
//                   />
//                   {errors.city && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.city.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="state"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     State
//                   </label>
//                   <input
//                     {...register("state")}
//                     type="text"
//                     className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="State"
//                   />
//                   {errors.state && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.state.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="postalCode"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Postal Code
//                   </label>
//                   <input
//                     {...register("postalCode")}
//                     type="text"
//                     className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="Postal code"
//                   />
//                   {errors.postalCode && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.postalCode.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label
//                     htmlFor="country"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Country
//                   </label>
//                   <input
//                     {...register("country")}
//                     type="text"
//                     className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="Country"
//                   />
//                   {errors.country && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.country.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="phone"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Phone
//                   </label>
//                   <input
//                     {...register("phone")}
//                     type="tel"
//                     className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="Phone"
//                   />
//                   {errors.phone && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.phone.message}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center">
//                 <input
//                   {...register("isDefault")}
//                   type="checkbox"
//                   id="isDefault"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label
//                   htmlFor="isDefault"
//                   className="ml-2 block text-sm text-gray-700"
//                 >
//                   Set as default address
//                 </label>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading
//                   ? editingAddress
//                     ? "Updating..."
//                     : "Adding..."
//                   : editingAddress
//                   ? "Update Address"
//                   : "Add Address"}
//               </button>
//             </div>
//           </form>

//           <div className="mt-8">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Your Addresses
//             </h2>
//             {addresses.length === 0 ? (
//               <p className="text-gray-600">You have no addresses yet.</p>
//             ) : (
//               <div className="space-y-4">
//                 {addresses.map((address: any) => (
//                   <div
//                     key={address.id}
//                     className="border border-gray-200 rounded-lg p-4"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-medium text-gray-900 capitalize">
//                           {address.type}
//                         </h3>
//                         <p className="text-gray-600">
//                           {address.firstName} {address.lastName}
//                         </p>
//                         <p className="text-gray-600">{address.address1}</p>
//                         {address.address2 && (
//                           <p className="text-gray-600">{address.address2}</p>
//                         )}
//                         <p className="text-gray-600">
//                           {address.city}, {address.state} {address.postalCode}
//                         </p>
//                         <p className="text-gray-600">{address.country}</p>
//                         <p className="text-gray-600">{address.phone}</p>
//                         {address.isDefault && (
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                             Default
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex space-x-2">
//                         <button
//                           type="button"
//                           onClick={() => handleEdit(address)}
//                           className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => handleDelete(address.id)}
//                           disabled={loading}
//                           className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
