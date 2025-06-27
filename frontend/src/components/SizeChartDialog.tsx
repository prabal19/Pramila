"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { X } from "lucide-react"

const sizeData = [
  { size: 'XXS', bust: '30', blouseWaist: '26', highWaist: '25', lowerWaist: '28', hip: '35', blouseLength: '15', bottomLength: '42' },
  { size: 'XS', bust: '32', blouseWaist: '28', highWaist: '27', lowerWaist: '30', hip: '36', blouseLength: '15', bottomLength: '42' },
  { size: 'S', bust: '34', blouseWaist: '30', highWaist: '29', lowerWaist: '32', hip: '37', blouseLength: '15', bottomLength: '42' },
  { size: 'M', bust: '36', blouseWaist: '32', highWaist: '30', lowerWaist: '34', hip: '38', blouseLength: '15', bottomLength: '42' },
  { size: 'L', bust: '38', blouseWaist: '34', highWaist: '32', lowerWaist: '36', hip: '39', blouseLength: '15', bottomLength: '42' },
  { size: 'XL', bust: '40', blouseWaist: '36', highWaist: '34', lowerWaist: '38', hip: '40', blouseLength: '15', bottomLength: '42' },
  { size: 'XXL', bust: '42', blouseWaist: '38', highWaist: '36', lowerWaist: '40', hip: '41', blouseLength: '15', bottomLength: '42' },
  { size: 'XXXL', bust: '44', blouseWaist: '40', highWaist: '38', lowerWaist: '42', hip: '42', blouseLength: '15', bottomLength: '42' },
];

const headers = ['SIZE (IN)', 'BUST', 'BLOUSE WAIST', 'HIGH WAIST', 'LOWER WAIST', 'HIP', 'BLOUSE LENGTH', 'BOTTOM LENGTH'];

interface SizeChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SizeChartDialog({ open, onOpenChange }: SizeChartDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 border-0">
        <DialogHeader className="p-4 bg-primary text-primary-foreground flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-normal tracking-widest text-primary-foreground">PRAMILA SIZE GUIDE</DialogTitle>
           <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
           </DialogClose>
        </DialogHeader>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-primary/10">
                {headers.map(header => (
                  <TableHead key={header} className="text-center font-bold text-primary border h-14">{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizeData.map((row) => (
                <TableRow key={row.size} className="border-b">
                  <TableCell className="font-medium text-center border">{row.size}</TableCell>
                  <TableCell className="text-center border">{row.bust}</TableCell>
                  <TableCell className="text-center border">{row.blouseWaist}</TableCell>
                  <TableCell className="text-center border">{row.highWaist}</TableCell>
                  <TableCell className="text-center border">{row.lowerWaist}</TableCell>
                  <TableCell className="text-center border">{row.hip}</TableCell>
                  <TableCell className="text-center border">{row.blouseLength}</TableCell>
                  <TableCell className="text-center border">{row.bottomLength}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
