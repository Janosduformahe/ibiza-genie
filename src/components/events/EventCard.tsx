
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, MapPin, Music, Ticket } from "lucide-react";
import { format } from "date-fns";

export interface EventCardProps {
  id: string;
  name: string;
  date: string;
  club?: string;
  ticketLink?: string;
  musicStyle?: string[];
}

export const EventCard = ({ name, date, club, ticketLink, musicStyle }: EventCardProps) => {
  const eventDate = new Date(date);
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white">
        <CardTitle className="line-clamp-2">{name}</CardTitle>
        <CardDescription className="text-white/90 flex items-center gap-1">
          <CalendarClock className="h-4 w-4" />
          {format(eventDate, "EEEE, MMMM do 'at' h:mm a")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {club && (
          <div className="flex items-center gap-2 mb-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{club}</span>
          </div>
        )}
        {musicStyle && musicStyle.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Music className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {musicStyle.map((style, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {style}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {ticketLink ? (
          <Button asChild className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]">
            <a href={ticketLink} target="_blank" rel="noopener noreferrer">
              <Ticket className="mr-2 h-4 w-4" />
              Get Tickets
            </a>
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            <Ticket className="mr-2 h-4 w-4" />
            Tickets Not Available
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
