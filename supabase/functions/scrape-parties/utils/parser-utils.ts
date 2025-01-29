import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

export interface Event {
  name: string;
  date: string;
  club?: string;
  ticket_link?: string;
  price_range?: string;
  music_style?: string[];
  description?: string;
  lineup?: string[];
}

export async function extractEventData(html: string): Promise<Event[]> {
  console.log('Starting event extraction...');
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const events: Event[] = [];

  if (!doc) {
    console.error('Failed to parse HTML');
    return events;
  }

  // Log the full HTML for debugging
  console.log('Raw HTML:', html);

  const eventElements = doc.querySelectorAll('.event-item');
  console.log(`Found ${eventElements.length} event elements`);

  if (eventElements.length === 0) {
    // Try alternative selectors if the main one fails
    const alternativeElements = doc.querySelectorAll('.event, .party-event, article');
    console.log(`Trying alternative selectors, found: ${alternativeElements.length} elements`);
  }
  
  for (const element of eventElements) {
    try {
      const name = element.querySelector('.event-title, .title, h2')?.textContent?.trim();
      const dateText = element.querySelector('.event-date, .date, time')?.textContent?.trim();
      const club = element.querySelector('.event-venue, .venue, .location')?.textContent?.trim();
      const ticketLink = element.querySelector('.ticket-link, .tickets a, .buy-tickets')?.getAttribute('href');
      const priceText = element.querySelector('.event-price, .price, .ticket-price')?.textContent?.trim();
      const description = element.querySelector('.event-description, .description, .details')?.textContent?.trim();
      
      const musicStyleElements = element.querySelectorAll('.music-tag, .genre, .style');
      const musicStyle = Array.from(musicStyleElements)
        .map(el => el.textContent?.trim())
        .filter(Boolean);
      
      const lineupElements = element.querySelectorAll('.artist-name, .lineup, .dj-name');
      const lineup = Array.from(lineupElements)
        .map(el => el.textContent?.trim())
        .filter(Boolean);
      
      if (name && dateText) {
        const date = new Date(dateText);
        const event = {
          name,
          date: date.toISOString(),
          club,
          ticket_link: ticketLink,
          price_range: priceText,
          music_style: musicStyle,
          description,
          lineup
        };
        events.push(event);
        console.log(`Successfully extracted event: ${JSON.stringify(event, null, 2)}`);
      }
    } catch (error) {
      console.error('Error extracting event data:', error);
    }
  }

  return events;
}