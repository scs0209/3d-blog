'use client';

import * as React from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronDown,
  EllipsisVertical,
  GripVertical,
  Columns2,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import {
  type ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type RowData,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { Button } from '@/shadcn-ui/components/ui/button';
import { Checkbox } from '@/shadcn-ui/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn-ui/components/ui/dropdown-menu';
import { Label } from '@/shadcn-ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-ui/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn-ui/components/ui/table';
import { type GetPostListResponse, usePostList } from '@/features/post/model';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/features/post/api/post-api';
import { Tag, type ColorToken } from '@/shared/ui/Tag';
import { toast } from '@/shared/ui/toast/useToast';
import { adminTheme } from '@/widgets/admin/ui/admin-theme';

const TAG_COLORS: ColorToken[] = ['orange', 'cyan', 'amber', 'rose', 'violet', 'emerald', 'sky', 'fuchsiaToBlue'];

const hashTagColor = (name: string): ColorToken => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length] ?? 'orange';
};

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    refetch?: () => void;
  }
}

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant='ghost'
      size='icon'
      className='text-muted-foreground size-7 hover:bg-transparent'
    >
      <GripVertical className='text-muted-foreground size-3' />
      <span className='sr-only'>Drag to reorder</span>
    </Button>
  );
}

type PostItem = NonNullable<GetPostListResponse['data']>[number];
const columnHelper = createColumnHelper<PostItem>();

const columns = [
  columnHelper.accessor('id', {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original?.id ?? 0} />,
  }),
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.display({
    id: 'header',
    header: '제목',
    cell: ({ row }) => {
      return <div className={`max-w-[280px] truncate font-medium ${adminTheme.textPrimary}`}>{row.original?.title ?? ''}</div>;
    },
    enableHiding: false,
  }),
  columnHelper.display({
    id: 'category',
    header: '카테고리',
    cell: ({ row }) => {
      const categoryName = row.original?.category?.name;
      if (!categoryName) {
        return <span className={adminTheme.textMuted}>—</span>;
      }

      return (
        <Tag color='orange' size='sm' type='glass' spacing='tight'>
          {categoryName}
        </Tag>
      );
    },
  }),
  columnHelper.display({
    id: 'tags',
    header: '태그',
    cell: ({ row }) => {
      const tags = row.original?.tags ?? [];
      if (tags.length === 0) {
        return <span className={adminTheme.textMuted}>—</span>;
      }

      return (
        <div className='flex max-w-[220px] flex-wrap gap-1'>
          {tags.slice(0, 3).map((tag) => (
            <Tag key={tag.id} color={hashTagColor(tag.name ?? '')} size='sm' type='glass' spacing='tight'>
              {tag.name}
            </Tag>
          ))}
          {tags.length > 3 && (
            <Tag color='slate' size='sm' type='glass' spacing='tight'>
              +{tags.length - 3}
            </Tag>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('author.name', {
    header: '작성자',
    cell: ({ getValue }) => {
      return <div className={adminTheme.textMuted}>{getValue() ?? ''}</div>;
    },
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row, table }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='data-[state=open]:bg-muted text-muted-foreground flex size-8' size='icon'>
            <EllipsisVertical />
            <span className='sr-only'>메뉴 열기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-32'>
          <DropdownMenuItem>수정</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant='destructive'
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await deletePost(row.original?.id ?? 0);
              toast.success('게시물을 삭제했습니다');
              table.options.meta?.refetch?.();
            }}
          >
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
];

function DraggableRow({ row }: { row: Row<PostItem> }) {
  const router = useRouter();
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original?.id ?? 0,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 glass-row-hover'
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
      onClick={() => {
        router.push(`/admin/post/${row.original?.id}`);
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}

export function PostTable() {
  const { posts, isLoading, refetch } = usePostList({
    search: '',
    page: 1,
    limit: 10,
  });
  const [data, setData] = React.useState(posts);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => posts?.map((item) => item.id || 0).filter((id): id is number => id !== undefined) || [],
    [posts],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    meta: {
      refetch,
    },
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    getRowId: (row) => row.id?.toString() ?? '',
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (isLoading) return;
    setData(posts);
  }, [isLoading, posts]);

  return (
    <>
      <div className='flex items-center justify-between px-2'>
        <Label htmlFor='view-selector' className='sr-only'>
          View
        </Label>
        <Select defaultValue='outline'>
          <SelectTrigger className='flex w-fit @4xl/main:hidden' size='sm' id='view-selector'>
            <SelectValue placeholder='Select a view' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='outline'>Outline</SelectItem>
            <SelectItem value='past-performance'>Past Performance</SelectItem>
            <SelectItem value='key-personnel'>Key Personnel</SelectItem>
            <SelectItem value='focus-documents'>Focus Documents</SelectItem>
          </SelectContent>
        </Select>
        <div className='flex items-center gap-2 px-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='glass' size='sm'>
                <Columns2 />
                <span className='hidden lg:inline'>Customize Columns</span>
                <span className='lg:hidden'>Columns</span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={adminTheme.tableWrap}>
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className='bg-muted sticky top-0 z-10'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className='**:data-[slot=table-cell]:first:w-8'>
              {table.getRowModel().rows?.length ? (
                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
      <div className={`flex items-center justify-between mx-6`}>
        <div className={`hidden flex-1 text-sm lg:flex ${adminTheme.textMuted}`}>
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className='flex w-full items-center gap-8 lg:w-fit'>
          <div className='hidden items-center gap-2 lg:flex'>
            <Label htmlFor='rows-per-page' className='text-sm font-medium'>
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size='sm' className='w-20' id='rows-per-page'>
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side='top'>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex w-fit items-center justify-center text-sm font-medium'>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className='ml-auto flex items-center gap-2 lg:ml-0'>
            <Button
              variant='glass'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className='sr-only'>Go to first page</span>
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='glass'
              className='hidden size-8 h-8 w-8 p-0 lg:flex'
              size='icon'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className='sr-only'>Go to previous page</span>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='glass'
              className='size-8 h-8 w-8 p-0'
              size='icon'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className='sr-only'>Go to next page</span>
              <ChevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='glass'
              className='hidden h-8 w-8 p-0 lg:flex'
              size='icon'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className='sr-only'>Go to last page</span>
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
