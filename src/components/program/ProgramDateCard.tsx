
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProgramDateCardProps {
  startDate: string;
}

const ProgramDateCard: React.FC<ProgramDateCardProps> = ({ startDate }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Program Start Date</CardTitle>
        <CardDescription>
          {new Date(startDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={() => navigate('/calendar')} className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          View in Calendar
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgramDateCard;
