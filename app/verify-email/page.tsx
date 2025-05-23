// // app/verify-email/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";

// export default function VerifyEmail() {
//   const [status, setStatus] = useState<"loading" | "success" | "error">(
//     "loading"
//   );
//   const [message, setMessage] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");

//   useEffect(() => {
//     if (token) {
//       verifyEmail(token);
//     }
//   }, [token]);

//   const verifyEmail = async (verificationToken: string) => {
//     try {
//       const response = await fetch("/api/auth/verify-email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ token: verificationToken }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setStatus("success");
//         setMessage("Email verified successfully!");
//         setTimeout(() => {
//           router.push("/sign-in");
//         }, 2000);
//       } else {
//         setStatus("error");
//         setMessage(result.message || "Verification failed");
//       }
//     } catch {
//       setStatus("error");
//       setMessage("An error occurred during verification");
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Verifying your email...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <div
//             className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
//               status === "success" ? "bg-green-100" : "bg-red-100"
//             }`}
//           >
//             {status === "success" ? (
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
//             ) : (
//               <svg
//                 className="h-6 w-6 text-red-600"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             )}
//           </div>
//           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//             Email Verification
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">{message}</p>
//           <div className="mt-6">
//             <Link
//               href="/sign-in"
//               className="font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               Go to Sign In
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
