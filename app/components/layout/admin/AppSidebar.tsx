import { Link } from "@remix-run/react"; // Use Remix's Link component
import { Boxes, Clipboard, LayoutDashboardIcon, Sprout } from "lucide-react";
import Logo from "~/components/common/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { NavMain } from "./NavMain";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Activities",
      url: "/activities",
      icon: Clipboard,
    },
    {
      title: "Resources",
      url: "/resources",
      icon: Boxes,
    },
    {
        title:"Crops",
        url:"/crops",
        icon:Sprout
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" className="bg-green-50 border-r border-green-100" {...props}>
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2 hover:bg-green-100 rounded-lg transition-colors duration-200"
            >
              <Link to="/">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-4 text-base text-green-800">
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}