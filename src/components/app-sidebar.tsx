"use client"

import {
  UserStar,
  Home,
  Search,
  Settings,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
  useClerk
} from "@clerk/nextjs"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Admin Panel", url: "/admin", icon: UserStar },
  { title: "Search", url: "/search", icon: Search },
  { title: "Settings", url: "/settings", icon: Settings },
]

function UserAccountMenu() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 w-full rounded-md hover:bg-accent p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
            <AvatarFallback>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{user.fullName}</span>
            <span className="text-xs text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => openUserProfile()}>
          Manage Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton>
            <button className="w-full flex items-center gap-2 text-left">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {/* Navigation Links */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Auth Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SignedOut>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SignInButton mode="modal">
                      <div className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </div>
                    </SignInButton>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SignUpButton mode="modal">
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        <span>Sign Up</span>
                      </div>
                    </SignUpButton>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SignedOut>

              <SignedIn>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <UserAccountMenu />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SignedIn>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
