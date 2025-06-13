import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { z } from "zod";
import "dotenv/config";
const Amadeus = require("amadeus");
const client = new MongoClient(process.env.MONGODB_ATLAS_URI as string);

const llm = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

const FlightItinerarySchema = z.object({
  type: z.literal("FLIGHT"),
  email: z.string().email(),
  paymentMethod: z.string(),
  tramangoId: z.string(),
  status: z.string(),
  payment_status: z.string(),
  amount: z.number(),
  booking_reference: z.object({
    data: z.object({
      type: z.string(),
      id: z.string(),
      queuingOfficeId: z.string(),
      associatedRecords: z.array(
        z.object({
          reference: z.string(),
          creationDate: z.string(),
          originSystemCode: z.string(),
          flightOfferId: z.string(),
        })
      ),
      flightOffers: z.array(
        z.object({
          type: z.string(),
          id: z.string(),
          source: z.string(),
          nonHomogeneous: z.boolean(),
          lastTicketingDate: z.string(),
          itineraries: z.array(
            z.object({
              segments: z.array(
                z.object({
                  departure: z.object({
                    iataCode: z.string(),
                    terminal: z.string().optional(),
                    at: z.string(),
                  }),
                  arrival: z.object({
                    iataCode: z.string(),
                    terminal: z.string().optional(),
                    at: z.string(),
                  }),
                  carrierCode: z.string(),
                  number: z.string(),
                  aircraft: z.object({
                    code: z.string(),
                  }),
                  duration: z.string(),
                  id: z.string(),
                  numberOfStops: z.number(),
                  co2Emissions: z.array(
                    z.object({
                      weight: z.number(),
                      weightUnit: z.string(),
                      cabin: z.string(),
                    })
                  ),
                })
              ),
            })
          ),
          price: z.object({
            currency: z.string(),
            total: z.string(),
            base: z.string(),
            fees: z.array(
              z.object({
                amount: z.string(),
                type: z.string(),
              })
            ),
            grandTotal: z.string(),
            billingCurrency: z.string(),
            TramangoTotalNaira: z.number(),
            TramangoBaseNaira: z.number(),
            TramangoGrandTotalNaira: z.number(),
          }),
          pricingOptions: z.object({
            fareType: z.array(z.string()),
            includedCheckedBagsOnly: z.boolean(),
          }),
          validatingAirlineCodes: z.array(z.string()),
          travelerPricings: z.array(
            z.object({
              travelerId: z.string(),
              fareOption: z.string(),
              travelerType: z.string(),
              price: z.object({
                currency: z.string(),
                total: z.string(),
                base: z.string(),
                taxes: z.array(
                  z.object({
                    amount: z.string(),
                    code: z.string(),
                  })
                ),
                refundableTaxes: z.string(),
              }),
              fareDetailsBySegment: z.array(
                z.object({
                  segmentId: z.string(),
                  cabin: z.string(),
                  fareBasis: z.string(),
                  class: z.string(),
                  includedCheckedBags: z.object({
                    quantity: z.number(),
                  }),
                })
              ),
            })
          ),
        })
      ),
      travelers: z.array(
        z.object({
          id: z.string(),
          dateOfBirth: z.string(),
          gender: z.string(),
          name: z.object({
            firstName: z.string(),
            lastName: z.string(),
          }),
          documents: z.array(
            z.object({
              number: z.string(),
              issuanceDate: z.string(),
              expiryDate: z.string(),
              issuanceCountry: z.string(),
              issuanceLocation: z.string(),
              nationality: z.string(),
              birthPlace: z.string(),
              documentType: z.string(),
              holder: z.boolean(),
            })
          ),
          contact: z.object({
            purpose: z.string(),
            phones: z.array(
              z.object({
                deviceType: z.string(),
                countryCallingCode: z.string(),
                number: z.string(),
              })
            ),
            emailAddress: z.string().email(),
          }),
        })
      ),
      ticketingAgreement: z.object({
        option: z.string(),
      }),
      automatedProcess: z.array(
        z.object({
          code: z.string(),
          queue: z.object({
            number: z.string(),
            category: z.string(),
          }),
          officeId: z.string(),
        })
      ),
    }),
    dictionaries: z.object({
      locations: z.record(
        z.object({
          cityCode: z.string(),
          countryCode: z.string(),
        })
      ),
    }),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type FlightItinerary = z.infer<typeof FlightItinerarySchema>;

const parser = StructuredOutputParser.fromZodSchema(
  z.array(FlightItinerarySchema)
);

// Amadeus API utility functions
async function searchFlights(
  origin: string,
  destination: string,
  date: string
) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults: "1",
    });
    return response.data;
  } catch (error) {
    console.error("Error searching flights:", error);
    throw error;
  }
}

async function createItinerarySummary(
  itinerary: FlightItinerary
): Promise<string> {
  return new Promise((resolve) => {
    const traveler = itinerary.booking_reference.data.travelers[0];
    const passengerInfo = `${traveler.name.firstName} ${traveler.name.lastName}`;
    const segments =
      itinerary.booking_reference.data.flightOffers[0].itineraries[0].segments;
    const flightDetails = segments
      .map(
        (segment) =>
          `Flight ${segment.carrierCode}${segment.number} from ${segment.departure.iataCode} to ${segment.arrival.iataCode}`
      )
      .join(", ");
    const bookingInfo = `Status: ${itinerary.status}, Amount: ${itinerary.amount}`;

    const summary = `Passenger: ${passengerInfo}. Itinerary: ${flightDetails}. ${bookingInfo}`;
    resolve(summary);
  });
}

async function generateSyntheticData(): Promise<FlightItinerary[]> {
  const prompt = `Generate 10 fictional flight itineraries. Each itinerary must include ALL of the following:
  - Passenger details in the travelers array with complete information including documents and contact details
  - Flight information with realistic airport codes, flight numbers, and times
  - Booking status and payment information
  - A ticketingAgreement object with an 'option' field
  - An automatedProcess array with at least one entry containing code and queue details
  
  Make sure every required field in the schema is populated. Dates should be in ISO format (YYYY-MM-DD).
  
  ${parser.getFormatInstructions()}`;

  console.log("Generating synthetic flight itineraries...");
  const response = await llm.invoke(prompt);

  // Parse the response and convert date strings to Date objects
  const parsedData = await parser.parse(response.content as string);

  // Convert date strings to Date objects
  return parsedData.map((itinerary) => ({
    ...itinerary,
    createdAt: new Date(itinerary.createdAt),
    updatedAt: new Date(itinerary.updatedAt),
  }));
}

async function seedDatabase(): Promise<void> {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const db = client.db("flight_database");
    const collection = db.collection("itineraries");

    await collection.deleteMany({});

    const syntheticData = await generateSyntheticData();

    const recordsWithSummaries = await Promise.all(
      syntheticData.map(async (record) => ({
        pageContent: await createItinerarySummary(record),
        metadata: { ...record },
      }))
    );

    for (const record of recordsWithSummaries) {
      await MongoDBAtlasVectorSearch.fromDocuments(
        [record],
        new OpenAIEmbeddings(),
        {
          collection,
          indexName: "vector_index",
          textKey: "embedding_text",
          embeddingKey: "embedding",
        }
      );

      console.log(
        "Successfully processed & saved record:",
        record.metadata.tramangoId
      );
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

// Example usage of Amadeus API search
async function searchItineraries(
  origin: string,
  destination: string,
  date: string
) {
  try {
    const flights = await searchFlights(origin, destination, date);
    return flights;
  } catch (error) {
    console.error("Error searching itineraries:", error);
    throw error;
  }
}

seedDatabase().catch(console.error);
