
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddEventFormProps {
  onEventAdded: () => void;
}

export const AddEventForm = ({ onEventAdded }: AddEventFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("20:00");
  
  const [formData, setFormData] = useState({
    name: "",
    club: "",
    ticket_link: "",
    music_style: "",
    lineup: "",
    price_range: "",
    description: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Event name is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Combine date and time
      const [hours, minutes] = time.split(':').map(Number);
      const eventDateTime = new Date(date);
      eventDateTime.setHours(hours, minutes);
      
      // Convert comma-separated strings to arrays
      const musicStyles = formData.music_style ? formData.music_style.split(',').map(s => s.trim()) : [];
      const lineupArray = formData.lineup ? formData.lineup.split(',').map(s => s.trim()) : [];
      
      // Prepare the event object
      const event = {
        name: formData.name,
        date: eventDateTime.toISOString(),
        club: formData.club,
        ticket_link: formData.ticket_link,
        music_style: musicStyles,
        lineup: lineupArray,
        price_range: formData.price_range,
        description: formData.description,
        source: "manual"
      };
      
      // Call the edge function to add the event
      const { data, error } = await supabase.functions.invoke('scrape-club-tickets', {
        body: { event }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Event added successfully",
      });
      
      // Reset form
      setFormData({
        name: "",
        club: "",
        ticket_link: "",
        music_style: "",
        lineup: "",
        price_range: "",
        description: ""
      });
      setDate(undefined);
      setTime("20:00");
      
      // Close dialog
      setOpen(false);
      
      // Refresh events
      onEventAdded();
      
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error adding event",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#D946EF] text-white hover:bg-[#C026D3]">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Event Name *</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="Children of the 80's" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="time">Time *</Label>
              <Input 
                id="time" 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="club">Venue/Club</Label>
            <Input 
              id="club" 
              name="club" 
              value={formData.club} 
              onChange={handleInputChange} 
              placeholder="Hard Rock Hotel Tenerife" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="price_range">Price Range</Label>
            <Input 
              id="price_range" 
              name="price_range" 
              value={formData.price_range} 
              onChange={handleInputChange} 
              placeholder="20€" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="music_style">Music Styles (comma separated)</Label>
            <Input 
              id="music_style" 
              name="music_style" 
              value={formData.music_style} 
              onChange={handleInputChange} 
              placeholder="80s, Retro, Pop" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="lineup">Lineup (comma separated)</Label>
            <Input 
              id="lineup" 
              name="lineup" 
              value={formData.lineup} 
              onChange={handleInputChange} 
              placeholder="DJ Retro, La Movida" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ticket_link">Ticket Link</Label>
            <Input 
              id="ticket_link" 
              name="ticket_link" 
              value={formData.ticket_link} 
              onChange={handleInputChange} 
              placeholder="https://www.clubtickets.com/es/ibiza-clubs-tickets/children-80s-tickets" 
              type="url"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              placeholder="A nostalgic journey back to the music of the 80s"
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Event..." : "Add Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
