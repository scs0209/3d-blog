import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/shadcn-ui/components/ui/sidebar';
import { Button } from '@/shadcn-ui/components/ui/button';
import { CategoryModal } from '@/widgets/category';
import { CreateTagModal } from '@/widgets/tag';

const AuthSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-2xl font-bold">Blog Dashboard</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Blog Actions</SidebarGroupLabel>
          <Button asChild className="w-full mb-2">
            <Link href="/admin/post">Create New Post</Link>
          </Button>
          <CategoryModal />
          <CreateTagModal />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
export default AuthSidebar;
