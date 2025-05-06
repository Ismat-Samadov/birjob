import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion, Search, Bell, ArrowLeft } from "lucide-react"; 
import ClientWrapper from "@/components/ClientWrapper";
import NotFoundContent from "@/components/NotFoundContent";

export default function NotFound() {
  return (
    <ClientWrapper>
      <NotFoundContent />
    </ClientWrapper>
  );
}