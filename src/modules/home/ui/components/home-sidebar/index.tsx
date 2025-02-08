import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";
import { Separator } from "@radix-ui/react-menubar";
import { PersonalSection } from "./personal-section";

export const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator className="" />
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
};
