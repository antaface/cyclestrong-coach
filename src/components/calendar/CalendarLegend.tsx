
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarLegendProps {
  nextPeriodDate: string | null;
  daysUntilNextPeriod: number | null;
}

export const CalendarLegend = ({ nextPeriodDate, daysUntilNextPeriod }: CalendarLegendProps) => {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-cs-neutral-800">Phase Legend</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Info className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center">
          <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#F6B5B5" }}></span>
          <span className="text-sm">Menstrual</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#FFE6A7" }}></span>
          <span className="text-sm">Follicular</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#A3E4B8" }}></span>
          <span className="text-sm">Ovulation</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#FDD59C" }}></span>
          <span className="text-sm">Luteal</span>
        </div>
      </div>
      
      {nextPeriodDate && daysUntilNextPeriod !== null && (
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Menstrual Phase</CardTitle>
            <CardDescription>Starting in {daysUntilNextPeriod} days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cs-neutral-600">
              Consider planning a deload week to align with your upcoming menstrual phase. This is a good time to focus on recovery and mobility work.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
