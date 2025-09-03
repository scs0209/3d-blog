import { Button } from '@/shadcn-ui/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/shadcn-ui/components/ui/sidebar';
import { CategoryModal } from '@/widgets/category';
import { CreateTagModal } from '@/widgets/tag';
import Link from 'next/link';

const AuthSidebar = () => {
  return (
    <Sidebar
      collapsible='offcanvas'
      variant='inset'
      className='fixed left-0 top-0 h-screen w-64
    bg-black/40
    backdrop-blur-2xl
    border-r border-white/20
    shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    rounded-r-2xl'
    >
      <SidebarHeader>
        <h2 className='text-2xl font-bold'>Blog Dashboard</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Blog Actions</SidebarGroupLabel>
          <Button asChild className='w-full mb-2'>
            <Link href='/admin/post'>Create New Post</Link>
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
