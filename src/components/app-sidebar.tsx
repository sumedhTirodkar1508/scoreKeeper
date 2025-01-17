"use client";

import {
  ScrollText,
  PersonStanding,
  SquarePen,
  LogOut,
  TrendingUp,
  LayoutList,
  GalleryVerticalEnd,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";

// Menu items.
const items = [
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: TrendingUp,
  },
  {
    title: "Create Player",
    url: "/create-player",
    icon: PersonStanding,
  },
  {
    title: "Player List",
    url: "/playerlist",
    icon: ScrollText,
  },
  {
    title: "Create Tournament",
    url: "/create-tournament",
    icon: SquarePen,
  },
  {
    title: "Tournament List",
    url: "/tournamentlist",
    icon: LayoutList,
  },
];

const data = {
  user: {
    name: "CrossPointX",
    email: "pointxcross@gmail.com",
    avatar: "../../crosspointx.svg",
  },
};

export function AppSidebar() {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login"); // Redirect to the login page after logout
    } catch (error: any) {
      if (error && error.message) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred.");
      }
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />

                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem key="logout">
            <SidebarMenuButton onClick={logout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
