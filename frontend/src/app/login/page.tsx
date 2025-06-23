"use client";
// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import axios from "axios";
// import { useAppData, user_service } from "@/context/AppContext";
// import Cookies from "js-cookie";
// import toast from "react-hot-toast";
// import { useGoogleLogin } from "@react-oauth/google";
// import { redirect } from "next/navigation";
// import Loading from "@/components/loading";

// const LoginPage = () => {
//   const { isAuth, setIsAuth, loading, setLoading, setUser } = useAppData();

//   if (isAuth) return redirect("/blogs");

//   const responseGoogle = async (authResult: any) => {
//     setLoading(true);
//     try {
//       const result = await axios.post(`${user_service}/api/v1/login`, {
//         code: authResult["code"],
//       });

//       Cookies.set("token", result.data.token, {
//         expires: 5,
//         secure: true,
//         path: "/",
//       });
//       toast.success(result.data.message);
//       setIsAuth(true);
//       setLoading(false);
//       setUser(result.data.user);
//     } catch (error) {
//       console.log("error", error);
//       toast.error("Problem while login you");
//       setLoading(false);
//     }
//   };

//   const googleLogin = useGoogleLogin({
//     onSuccess: responseGoogle,
//     onError: responseGoogle,
//     flow: "auth-code",
//   });
//   return (
//     <>
//       {loading ? (
//         <Loading />
//       ) : (
//         <div className="w-[350px] m-auto mt-[200px]">
//           <Card className="w-[350px]">
//             <CardHeader>
//               <CardTitle>Login to Bloggers</CardTitle>
//               <CardDescription>Your one app</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button onClick={googleLogin}>
//                 Login with google{" "}
//                 <img
//                   src={"/google.png"}
//                   className="w-6 h-6"
//                   alt="google icon"
//                 />
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </>
//   );
// };

// export default LoginPage;

"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useAppData, user_service } from "@/context/AppContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";

const LoginPage = () => {
  const { isAuth, setIsAuth, loading, setLoading, setUser } = useAppData();

  if (isAuth) return redirect("/blogs");

  const handleGoogleLogin = () => {
    // @ts-ignore
    window.google.accounts.id.initialize({
      client_id: "178407096953-obhbj4k12tvutd6epmv0inb12f6cu1mb.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    // @ts-ignore
    window.google.accounts.id.prompt();
  };

  const handleCredentialResponse = async (response: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${user_service}/api/v1/google-login`, {
        credential: response.credential,
      });

      Cookies.set("token", result.data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });
      toast.success(result.data.message);
      setIsAuth(true);
      setLoading(false);
      setUser(result.data.user);
    } catch (error: any) {
      console.log("error", error);
      toast.error("Login failed");
      setLoading(false);
    }
  };

  return (
    <>
      <script src="https://accounts.google.com/gsi/client" async defer></script>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-[350px] m-auto mt-[200px]">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Login to Bloggers</CardTitle>
              <CardDescription>Your one app for blogs</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGoogleLogin}>
                Login with google{" "}
                <img
                  src={"/google.png"}
                  className="w-6 h-6"
                  alt="google icon"
                />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default LoginPage;