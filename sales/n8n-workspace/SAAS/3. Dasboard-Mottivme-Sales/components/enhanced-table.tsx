"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Column {
  key: string
  label: string
  align?: "left" | "center" | "right"
  sticky?: boolean
  width?: string
  minWidth?: string
}

interface EnhancedTableProps {
  title: string
  columns: Column[]
  data: any[]
  maxHeight?: string
  className?: string
}

export function EnhancedTable({ title, columns, data, maxHeight = "400px", className }: EnhancedTableProps) {
  return (
    <Card className={cn("bg-slate-900 border-slate-800", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="relative overflow-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500"
          style={{ maxHeight }}
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-slate-900">
              <TableRow className="border-slate-700">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      "text-slate-400 font-medium py-4 px-4 border-r border-slate-700/50 last:border-r-0 whitespace-nowrap",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.sticky && "sticky left-0 bg-slate-900 z-20 shadow-[2px_0_4px_rgba(0,0,0,0.1)]",
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth || "120px",
                    }}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        "py-4 px-4 border-r border-slate-700/30 last:border-r-0",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        column.sticky && "sticky left-0 bg-slate-900 z-10 shadow-[2px_0_4px_rgba(0,0,0,0.05)]",
                      )}
                      style={{
                        width: column.width,
                        minWidth: column.minWidth || "120px",
                      }}
                    >
                      {typeof row[column.key] === "object" ? (
                        row[column.key]
                      ) : (
                        <span className="text-slate-300">{row[column.key]}</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
