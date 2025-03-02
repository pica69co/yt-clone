import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";

import { PersonalSection } from "./personal-section";
import { SignedIn } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { SubscriptionsSection } from "./subscriptions-section";

export const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator className="" />
        <PersonalSection />
        <SignedIn>
          <>
            <Separator />
            <SubscriptionsSection />
          </>
        </SignedIn>
      </SidebarContent>
    </Sidebar>
  );
};
