/**
 * Admin sidebar — navigation for all admin sections.
 * Renders inside the `_admin` layout via <SidebarProvider>.
 */

import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CreditCard,
  Coins,
  Cog,
  Database,
  FileText,
  HardDrive,
  Flag,
  Globe,
  Gauge,
  Landmark,
  LayoutDashboard,
  Link as LinkIcon,
  Mail,
  Megaphone,
  Palette,
  Search,
  Shield,
  Sparkles,
  Sun,
  Users,
  Wrench,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = { title: string; to: string; icon: typeof LayoutDashboard };
type NavGroup = { label: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", to: "/admin", icon: LayoutDashboard },
      { title: "Analytics", to: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Tools", to: "/admin/tools", icon: Wrench },
      { title: "Articles", to: "/admin/articles", icon: FileText },
      { title: "Festivals", to: "/admin/festivals", icon: Calendar },
      { title: "Temples", to: "/admin/temples", icon: Landmark },
      { title: "Panchang", to: "/admin/panchang", icon: Sun },
    ],
  },
  {
    label: "Growth",
    items: [
      { title: "SEO", to: "/admin/seo", icon: Search },
      { title: "Ads", to: "/admin/ads", icon: Megaphone },
      { title: "Affiliates", to: "/admin/affiliates", icon: LinkIcon },
      { title: "Newsletter", to: "/admin/newsletter", icon: Mail },
      { title: "Emails", to: "/admin/emails", icon: Mail },
    ],
  },
  {
    label: "AI & i18n",
    items: [
      { title: "AI Providers", to: "/admin/ai-providers", icon: Sparkles },
      { title: "AI Studio", to: "/admin/ai-studio", icon: Sparkles },
      { title: "AI Prompts", to: "/admin/ai", icon: Sparkles },
      { title: "Translations", to: "/admin/translations", icon: Globe },
    ],
  },
  {
    label: "Users",
    items: [
      { title: "Users", to: "/admin/users", icon: Users },
      { title: "Payment Gateways", to: "/admin/payment-gateways", icon: CreditCard },
      { title: "Notifications", to: "/admin/notifications", icon: Bell },
    ],
  },

  {
    label: "Legal & Compliance",
    items: [
      { title: "Legal Pages", to: "/admin/legal", icon: FileText },
      { title: "Contact Inbox", to: "/admin/legal-inbox", icon: Mail },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", to: "/admin/settings", icon: Cog },
      { title: "Performance", to: "/admin/performance", icon: Gauge },
      { title: "PWA & Cache", to: "/admin/pwa", icon: HardDrive },
      { title: "Security", to: "/admin/security", icon: Shield },
      { title: "Backup", to: "/admin/backup", icon: Database },
    ],
  },
];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Palette className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">SanatanTools</div>
            <div className="truncate text-xs text-muted-foreground">Admin</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active =
                    pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link to={item.to as never} className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={"/" as never} className="flex items-center gap-2 text-muted-foreground">
                    <Flag className="h-4 w-4" />
                    <span>Back to site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to={"/dashboard" as never}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>My dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
