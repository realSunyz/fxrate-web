import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tableColumns = [
  { key: "bank", headerWidth: "w-28", cellWidth: "w-36" },
  { key: "sellRemit", headerWidth: "w-24", cellWidth: "w-24" },
  { key: "buyRemit", headerWidth: "w-24", cellWidth: "w-24" },
  { key: "buyCash", headerWidth: "w-24", cellWidth: "w-24" },
  { key: "middle", headerWidth: "w-24", cellWidth: "w-24" },
  { key: "updated", headerWidth: "w-40", cellWidth: "w-40" },
];

export function CurrencyTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {tableColumns.map((column) => (
                <TableHead key={column.key} className="whitespace-nowrap">
                  <Skeleton className={`h-4 ${column.headerWidth}`} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {tableColumns.map((column) => (
                  <TableCell key={column.key} className="whitespace-nowrap">
                    <Skeleton className={`h-4 ${column.cellWidth}`} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
