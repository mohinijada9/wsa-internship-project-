import groq from "./aiClient.js";

const systemPrompt = `You are a travel planner for a holiday rental website in India.

Create a day-by-day trip plan from the details the user gives you.

Rules:
1. Give exactly one entry per day of the trip.
2. Each day needs a short title and 3 to 4 activities.
3. Write each activity as "Morning: ...", "Afternoon: ...", or "Evening: ...".
4. Keep the plan inside the budget the user gave, and say roughly what things cost in rupees.
5. Match the activities to the interests the user picked.
6. Only suggest places that really exist in that destination. Do not invent places.
7. Keep the language simple and friendly.
8. Do not use emojis.

Reply with ONLY this JSON shape:
{
  "summary": "two sentences about the trip",
  "days": [
    { "day": 1, "title": "short title", "activities": ["Morning: ...", "Afternoon: ...", "Evening: ..."] }
  ],
  "tips": ["short tip", "short tip", "short tip"]
}`;

const makeFallbackPlan = (trip) => {
  const days = Number(trip.days);
  const destination = trip.destination || "your destination";
  const interests = trip.interests?.length
    ? trip.interests.join(", ")
    : "local sightseeing";
  const perDay = Math.round(Number(trip.budget || 0) / Math.max(days, 1));

  return {
    summary: `A ${days}-day trip to ${destination} focused on ${interests}. The plan keeps daily spending around Rs ${perDay} while leaving room for meals and local travel.`,
    days: Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      title: index === 0 ? `Explore ${destination}` : `Discover more of ${destination}`,
      activities: [
        `Morning: Explore a well-known attraction in ${destination}.`,
        `Afternoon: Have lunch and visit another popular local spot in ${destination}.`,
        `Evening: Enjoy a relaxed local experience and dinner in ${destination}.`,
      ],
    })),
    tips: [
      "Keep a small amount of cash for local transport and entry fees.",
      "Check opening hours before visiting attractions.",
      "Keep some budget aside for unexpected local expenses.",
    ],
  };
};

const planTrip = async (trip) => {
  const tripInfo = `- Destination: ${trip.destination}
- Total Budget: Rs ${trip.budget}
- Number of Days: ${trip.days}
- Number of People: ${trip.people}
- Interests: ${(trip.interests || []).join(", ")}`;

  // Use Groq when available. If the key is invalid, expired, or the service
  // is temporarily unavailable, fall back to a local plan so the application
  // remains usable for development/demo purposes.
  if (groq) {
    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        max_tokens: 2000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: tripInfo },
        ],
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error("Groq trip planner unavailable:", error.message);
    }
  } else {
    console.warn("GROQ_API_KEY is missing; using local trip planner fallback.");
  }

  return makeFallbackPlan(trip);
};

export { planTrip };
