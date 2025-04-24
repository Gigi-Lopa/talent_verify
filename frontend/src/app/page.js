"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles/main.module.css";
import Index from "./r/Index";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("company_id");
    if (!token) {
      router.push("/r/c/signin"); 
    }
  }, []);

  return (
    <div>
      <Index />
    </div>
  );
}
