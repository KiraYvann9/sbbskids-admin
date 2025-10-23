
import { Navbar } from "@/components";
import { SidebarComponent } from "@/components/sidebar/SidebarComponent";

export default function DashboardLauyoutt({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <MaxWidthWrapper>
      <div className="flex min-h-screen h-screen bg-gray-100">

        <SidebarComponent />
        <div className="flex-1 min-h-screen">
          <Navbar />
          {children}
        </div>
      </div>
    // </MaxWidthWrapper>
  );
}