import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, 
  RefreshCcw, 
  Share2, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  ChevronDown, 
  Info,
  DollarSign
} from "lucide-react";
import { 
  calculatorSchema, 
  type CalculatorInput, 
  restaurantTypes, 
  periods, 
  BENCHMARKS 
} from "@shared/schema";

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ResultBadge } from "@/components/ui/ResultBadge";
import { SchemaMarkup } from "@/components/SchemaMarkup";

export default function Home() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [showResults, setShowResults] = useState(false);

  // Initialize from URL params if present
  const getInitialValues = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      period: (params.get("period") as any) || "Monthly",
      restaurantType: (params.get("restaurantType") as any) || "Casual Dining",
      revenue: Number(params.get("revenue")) || 0,
      totalLaborCost: Number(params.get("totalLaborCost")) || 0,
      useDetailedLabor: params.get("useDetailedLabor") === "true",
      hourlyWages: Number(params.get("hourlyWages")) || 0,
      salariedWages: Number(params.get("salariedWages")) || 0,
      overtime: Number(params.get("overtime")) || 0,
      payrollTaxes: Number(params.get("payrollTaxes")) || 0,
      benefits: Number(params.get("benefits")) || 0,
      bonuses: Number(params.get("bonuses")) || 0,
      pto: Number(params.get("pto")) || 0,
    };
  };

  const form = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: getInitialValues(),
    mode: "onChange",
  });

  const values = useWatch({ control: form.control });
  
  // Real-time calculation of Detailed Labor
  useEffect(() => {
    if (values.useDetailedLabor) {
      const sum = 
        (Number(values.hourlyWages) || 0) +
        (Number(values.salariedWages) || 0) +
        (Number(values.overtime) || 0) +
        (Number(values.payrollTaxes) || 0) +
        (Number(values.benefits) || 0) +
        (Number(values.bonuses) || 0) +
        (Number(values.pto) || 0);
      
      form.setValue("totalLaborCost", sum, { shouldValidate: true });
    }
  }, [
    values.useDetailedLabor, 
    values.hourlyWages, 
    values.salariedWages, 
    values.overtime, 
    values.payrollTaxes, 
    values.benefits, 
    values.bonuses, 
    values.pto, 
    form
  ]);

  // Sync URL with state
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    
    // Replace history state without reload to keep URL fresh
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);

    // Show results if we have basic data
    if (values.revenue > 0 && values.totalLaborCost > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [values]);

  const laborPercentage = values.revenue > 0 
    ? (values.totalLaborCost / values.revenue) * 100 
    : 0;

  const currentBenchmark = BENCHMARKS[values.restaurantType as keyof typeof BENCHMARKS] || BENCHMARKS["Casual Dining"];
  
  const getStatus = () => {
    if (laborPercentage === 0) return "neutral";
    if (laborPercentage < currentBenchmark.min) return "warning";
    if (laborPercentage > currentBenchmark.max) return "destructive";
    return "success";
  };

  const status = getStatus();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Share this calculation with your team.",
    });
  };

  const handleReset = () => {
    form.reset({
      period: "Monthly",
      restaurantType: "Casual Dining",
      revenue: 0,
      totalLaborCost: 0,
      useDetailedLabor: false,
      hourlyWages: 0,
      salariedWages: 0,
      overtime: 0,
      payrollTaxes: 0,
      benefits: 0,
      bonuses: 0,
      pto: 0,
    });
    setShowResults(false);
    toast({
      title: "Reset complete",
      description: "Start a fresh calculation.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/20">
      <SchemaMarkup />
      
      {/* Hero Header */}
      <header className="bg-white dark:bg-slate-900 border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white leading-tight">
                Labor Cost Calculator
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                For Modern Restaurants
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-black/20 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary to-accent" />
              <CardHeader>
                <CardTitle>Financial Inputs</CardTitle>
                <CardDescription>Enter your restaurant's financial data for the period.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="period"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Period</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl">
                                  <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {periods.map((period) => (
                                  <SelectItem key={period} value={period}>{period}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="restaurantType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Restaurant Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {restaurantTypes.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="revenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Total Revenue
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Gross sales before tax and deductions</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="pl-10 h-12 text-lg font-medium rounded-xl"
                                {...field}
                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-base font-medium">Labor Cost</FormLabel>
                        <FormField
                          control={form.control}
                          name="useDetailedLabor"
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">Itemize Details</span>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                      </div>

                      {values.useDetailedLabor ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-dashed space-y-4"
                        >
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {['hourlyWages', 'salariedWages', 'overtime', 'payrollTaxes', 'benefits', 'bonuses', 'pto'].map((key) => (
                                <FormField
                                  key={key}
                                  control={form.control}
                                  name={key as any}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="capitalize text-xs text-muted-foreground">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">$</span>
                                          <Input 
                                            type="number" 
                                            className="pl-6 h-9 text-sm"
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                          />
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              ))}
                           </div>
                           <div className="pt-2 flex justify-between items-center border-t">
                             <span className="font-semibold text-sm">Calculated Total</span>
                             <span className="font-bold text-lg text-primary">
                               ${values.totalLaborCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                             </span>
                           </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormField
                            control={form.control}
                            name="totalLaborCost"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                      type="number" 
                                      placeholder="0.00"
                                      className="pl-10 h-12 text-lg font-medium rounded-xl"
                                      {...field}
                                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Include salaries, wages, taxes, and benefits.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold px-1">Common Questions</h3>
              <Accordion type="single" collapsible className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border px-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is a good labor cost percentage?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Generally, 20-35% is considered healthy. Fast food aims lower (25% or less), while fine dining often runs higher (30-35%) due to higher service standards.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What should be included in labor cost?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Everything related to employee compensation: hourly wages, salaries, overtime, payroll taxes, benefits, bonuses, vacation pay, and sick leave.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How can I lower my labor cost?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Optimize scheduling based on sales forecasts, cross-train employees, reduce overtime, and improve retention to lower training costs.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              <AnimatePresence>
                {showResults ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <Card className="border-none shadow-2xl shadow-primary/10 dark:shadow-none overflow-hidden bg-slate-900 text-white relative">
                      <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                      
                      <CardHeader className="relative z-10 pb-2">
                        <CardTitle className="text-slate-100 font-medium opacity-80">Labor Cost Percentage</CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-6xl font-bold font-display tracking-tight">
                            {laborPercentage.toFixed(1)}%
                          </span>
                          <span className="text-sm font-medium opacity-60">of revenue</span>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                           <ResultBadge 
                             status={status === "neutral" ? "success" : status as any} 
                             label={
                               status === "success" ? "Within Range" :
                               status === "warning" ? "Below Standard" :
                               status === "destructive" ? "Above Standard" : "Enter Data"
                             }
                             className="border-none bg-white/10 text-white backdrop-blur-sm"
                           />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Your {values.restaurantType} Target:</span>
                            <span className="font-semibold">{currentBenchmark.min}% - {currentBenchmark.max}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div 
                              className={cn("h-full rounded-full", 
                                status === "success" ? "bg-green-500" :
                                status === "warning" ? "bg-amber-500" : "bg-red-500"
                              )}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(laborPercentage, 100)}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground pt-1">
                            <span>0%</span>
                            <span>Target: {((currentBenchmark.min + currentBenchmark.max)/2).toFixed(0)}%</span>
                            <span>100%</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Insights</h4>
                          {status === "success" && (
                            <div className="flex gap-3 items-start p-3 bg-green-50 dark:bg-green-900/10 rounded-lg text-sm text-green-800 dark:text-green-300">
                              <ResultBadge status="success" label="Healthy" className="mt-0.5 px-2 py-0.5 h-auto text-[10px]" />
                              <p>You are managing labor efficiently for a {values.restaurantType} establishment. Maintain this balance.</p>
                            </div>
                          )}
                          {status === "warning" && (
                            <div className="flex gap-3 items-start p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-sm text-amber-800 dark:text-amber-300">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <p>Your labor cost is unusually low. Ensure you aren't understaffing, which can hurt service quality and burn out staff.</p>
                            </div>
                          )}
                          {status === "destructive" && (
                            <div className="flex gap-3 items-start p-3 bg-red-50 dark:bg-red-900/10 rounded-lg text-sm text-red-800 dark:text-red-300">
                              <TrendingDown className="w-4 h-4 shrink-0 mt-0.5" />
                              <p>Costs are high. Consider reviewing staff schedules during slow periods, auditing overtime, or cross-training employees.</p>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Labor $ per $1k Rev</p>
                            <p className="text-lg font-bold font-display">
                              ${((values.totalLaborCost / values.revenue) * 1000).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Annual Projection</p>
                            <p className="text-lg font-bold font-display text-primary">
                              ${(values.period === "Monthly" 
                                ? values.totalLaborCost * 12 
                                : values.period === "Weekly" 
                                ? values.totalLaborCost * 52 
                                : values.totalLaborCost).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 p-8 bg-white dark:bg-slate-900 rounded-2xl border border-dashed text-center"
                  >
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Calculator className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">No Data Yet</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-[200px]">
                      Enter your revenue and labor costs to see the analysis.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
