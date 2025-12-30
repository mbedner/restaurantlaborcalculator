import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// No database tables needed for this calculator app, but keeping the structure 
// for consistency with the project templates.

export const restaurantTypes = [
  "Quick Service",
  "Casual Dining",
  "Fine Dining"
] as const;

export const periods = ["Weekly", "Monthly", "Yearly"] as const;

export const calculatorSchema = z.object({
  period: z.enum(periods).default("Monthly"),
  restaurantType: z.enum(restaurantTypes).default("Casual Dining"),
  revenue: z.coerce.number().min(0, "Revenue must be positive"),
  totalLaborCost: z.coerce.number().min(0, "Labor cost must be positive"),
  
  // Advanced inputs (optional breakdown)
  useDetailedLabor: z.boolean().default(false),
  hourlyWages: z.coerce.number().optional(),
  salariedWages: z.coerce.number().optional(),
  overtime: z.coerce.number().optional(),
  payrollTaxes: z.coerce.number().optional(),
  benefits: z.coerce.number().optional(),
  bonuses: z.coerce.number().optional(),
  pto: z.coerce.number().optional(),
});

export type CalculatorInput = z.infer<typeof calculatorSchema>;

// Benchmarks for reference
export const BENCHMARKS = {
  "Quick Service": { min: 20, max: 25 },
  "Casual Dining": { min: 25, max: 30 },
  "Fine Dining": { min: 30, max: 35 },
};
