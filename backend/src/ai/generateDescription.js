import groq from "./aiClient.js";

const systemPrompt = `Your task is to generate an attractive, professional, natural-sounding property description based ONLY on the property information provided by the user.

Instructions:
1. Generate a property description of AT LEAST 200 characters.
2. Write the description using complete, grammatically correct sentences.
3. Make it sound warm, welcoming, professional, and suitable for a vacation rental website.
4. Naturally include important details such as property type, room type, number of guests, amenities, location, price when useful, and extra information.
5. Do not invent details.
6. Keep the language simple and do not use emojis.
7. Return ONLY the final description in 3 to 4 sentences.`;

const listAmenities = (amenities) => {
  if (!amenities || amenities.length === 0) return "Not provided";
  return amenities.map((item) => item.name || item).join(", ");
};

const readAddress = (address) => {
  if (!address) return "Not provided";
  return [address.area, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");
};

const generateDescription = async (property) => {
  const propertyInfo = `- Property Name: ${property.propertyName}
- Extra Information: ${property.extraInfo || "Not provided"}
- Property Type: ${property.propertyType}
- Room Type: ${property.roomType}
- Maximum Guests: ${property.maximumGuest}
- Amenities: ${listAmenities(property.amenities)}
- Price per Night: ${property.price}
- Address: ${readAddress(property.address)}`;

  if (groq) {
    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        max_tokens: 500,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: propertyInfo },
        ],
      });

      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error("Groq description generator unavailable:", error.message);
    }
  }

  return `${property.propertyName || "This property"} is a comfortable ${property.roomType || "rental"} in ${property.address?.city || "a convenient location"}. It accommodates up to ${property.maximumGuest || "several"} guests and offers ${listAmenities(property.amenities).toLowerCase()}. ${property.extraInfo || "It is suitable for travelers looking for a convenient stay."} Guests can enjoy a practical stay while exploring the surrounding area.`;
};

export { generateDescription };
