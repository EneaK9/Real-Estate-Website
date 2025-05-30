import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";
import { S3Client } from "@aws-sdk/client-s3";
import { Location } from "@prisma/client";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";

const prisma = new PrismaClient();

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
});

// Function to generate a unique image URL based on property name
const generateUniqueImageUrl = (propertyName: string, index: number) => {
	const encodedName = encodeURIComponent(`${propertyName}-${index}`);
	return `https://via.placeholder.com/800x600?text=${encodedName}`;
};

export const getProperties = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const {
			favoriteIds,
			priceMin,
			priceMax,
			beds,
			baths,
			propertyType,
			squareFeetMin,
			squareFeetMax,
			amenities,
			availableFrom,
			latitude,
			longitude,
		} = req.query;

		let whereConditions: Prisma.Sql[] = [];

		if (favoriteIds) {
			const favoriteIdsArray = (favoriteIds as string).split(",").map(Number);
			whereConditions.push(
				Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArray)})`
			);
		}

		if (priceMin) {
			whereConditions.push(
				Prisma.sql`p."pricePerMonth" >= ${Number(priceMin)}`
			);
		}

		if (priceMax) {
			whereConditions.push(
				Prisma.sql`p."pricePerMonth" <= ${Number(priceMax)}`
			);
		}

		if (beds && beds !== "any") {
			whereConditions.push(Prisma.sql`p.beds >= ${Number(beds)}`);
		}

		if (baths && baths !== "any") {
			whereConditions.push(Prisma.sql`p.baths >= ${Number(baths)}`);
		}

		if (squareFeetMin) {
			whereConditions.push(
				Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
			);
		}

		if (squareFeetMax) {
			whereConditions.push(
				Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
			);
		}

		if (propertyType && propertyType !== "any") {
			whereConditions.push(
				Prisma.sql`p."propertyType" = ${propertyType}::"PropertyType"`
			);
		}

		if (amenities && amenities !== "any") {
			const amenitiesArray = (amenities as string).split(",");
			whereConditions.push(Prisma.sql`p.amenities @> ${amenitiesArray}`);
		}

		if (availableFrom && availableFrom !== "any") {
			const availableFromDate =
				typeof availableFrom === "string" ? availableFrom : null;
			if (availableFromDate) {
				const date = new Date(availableFromDate);
				if (!isNaN(date.getTime())) {
					whereConditions.push(
						Prisma.sql`EXISTS (
              SELECT 1 FROM "Lease" l 
              WHERE l."propertyId" = p.id 
              AND l."startDate" <= ${date.toISOString()}
            )`
					);
				}
			}
		}

		if (latitude && longitude) {
			const lat = parseFloat(latitude as string);
			const lng = parseFloat(longitude as string);
			const radiusInKilometers = 1000;
			const degrees = radiusInKilometers / 111; // Converts kilometers to degrees

			whereConditions.push(
				Prisma.sql`ST_DWithin(
          l.coordinates::geometry,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
          ${degrees}
        )`
			);
		}

		const completeQuery = Prisma.sql`
      SELECT 
        p.*,
        json_build_object(
          'id', l.id,
          'address', l.address,
          'city', l.city,
          'state', l.state,
          'country', l.country,
          'postalCode', l."postalCode",
          'coordinates', json_build_object(
            'longitude', ST_X(l."coordinates"::geometry),
            'latitude', ST_Y(l."coordinates"::geometry)
          )
        ) as location
      FROM "Property" p
      JOIN "Location" l ON p."locationId" = l.id
      ${
				whereConditions.length > 0
					? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
					: Prisma.empty
			}
    `;

		const properties = await prisma.$queryRaw(completeQuery);

		res.json(properties);
	} catch (error: any) {
		res
			.status(500)
			.json({ message: `Error retrieving properties: ${error.message}` });
	}
};

export const getProperty = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id } = req.params;
		const property = await prisma.property.findUnique({
			where: { id: Number(id) },
			include: {
				location: true,
			},
		});

		if (property) {
			const coordinates: { coordinates: string }[] =
				await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

			const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
			const longitude = geoJSON.coordinates[0];
			const latitude = geoJSON.coordinates[1];

			const propertyWithCoordinates = {
				...property,
				location: {
					...property.location,
					coordinates: {
						longitude,
						latitude,
					},
				},
			};
			res.json(propertyWithCoordinates);
		}
	} catch (err: any) {
		res
			.status(500)
			.json({ message: `Error retrieving property: ${err.message}` });
	}
};

export const createProperty = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		console.log(
			"Creating property with body:",
			JSON.stringify(req.body, null, 2)
		);
		const files = (req.files as Express.Multer.File[]) || [];
		const {
			address,
			city,
			state,
			country,
			postalCode,
			managerCognitoId,
			propertyType,
			...propertyData
		} = req.body;

		// Log file information
		console.log(`Received ${files.length} files`);

		// Default location coordinates if geocoding fails
		let longitude = 0;
		let latitude = 0;

		// Try to geocode the address if possible
		try {
			const fullAddress = `${address}, ${city}, ${state}, ${country}, ${postalCode}`;
			console.log(`Attempting to geocode: ${fullAddress}`);

			// Example geocoding using a service like Nominatim (OpenStreetMap)
			// In production, you'd want to use a more reliable service like Google Maps
			const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
				fullAddress
			)}`;

			const response = await axios.get(nominatimUrl, {
				headers: {
					"User-Agent": "RealEstateApp/1.0",
				},
			});

			if (response.data && response.data.length > 0) {
				longitude = parseFloat(response.data[0].lon);
				latitude = parseFloat(response.data[0].lat);
				console.log(`Geocoded coordinates: ${latitude}, ${longitude}`);
			} else {
				console.log("Geocoding failed. Using default coordinates.");
			}
		} catch (geocodingError) {
			console.error("Error geocoding address:", geocodingError);
			console.log("Using default coordinates (0,0)");
		}

		// Process photo uploads if files exist
		let photoUrls: string[] = [];
		if (files && files.length > 0) {
			try {
				const uploadResults = await Promise.all(
					files.map(async (file, index) => {
						try {
							// If S3 is not configured or upload fails, use placeholder image
							if (
								!process.env.S3_BUCKET_NAME ||
								process.env.S3_BUCKET_NAME === "your-s3-bucket-name"
							) {
								// Generate a unique placeholder image URL using the property name
								return generateUniqueImageUrl(propertyData.name, index);
							}

							const uploadParams = {
								Bucket: process.env.S3_BUCKET_NAME!,
								Key: `properties/${Date.now()}-${file.originalname}`,
								Body: file.buffer,
								ContentType: file.mimetype,
							};

							const uploadResult = await new Upload({
								client: s3Client,
								params: uploadParams,
							}).done();

							return uploadResult.Location || null;
						} catch (err) {
							console.error(`Error uploading file ${file.originalname}:`, err);
							// Return a placeholder if S3 upload fails
							return generateUniqueImageUrl(propertyData.name, index);
						}
					})
				);

				// Filter out null values and ensure we only have strings
				photoUrls = uploadResults.filter(
					(url): url is string => typeof url === "string" && url !== null
				);

				console.log("Uploaded photos:", photoUrls);
			} catch (uploadError) {
				console.error("Error uploading photos:", uploadError);
				// Use placeholder images with property name if upload fails
				photoUrls = [generateUniqueImageUrl(propertyData.name, 0)];
			}
		} else {
			// Use placeholder images with property name if no files
			photoUrls = [generateUniqueImageUrl(propertyData.name, 0)];
		}

		// Create location with coordinates
		try {
			// create location
			const [location] = await prisma.$queryRaw<Location[]>`
        INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
        VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
        RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates;
      `;

			console.log("Created location:", location);

			// Format and type-cast property data
			const formattedPropertyData = {
				...propertyData,
				photoUrls,
				locationId: location.id,
				managerCognitoId,
				propertyType: propertyType || "Apartment",
				amenities:
					typeof propertyData.amenities === "string"
						? propertyData.amenities.split(",")
						: [],
				highlights:
					typeof propertyData.highlights === "string"
						? propertyData.highlights.split(",")
						: [],
				isPetsAllowed: propertyData.isPetsAllowed === "true",
				isParkingIncluded: propertyData.isParkingIncluded === "true",
				pricePerMonth: parseFloat(propertyData.pricePerMonth),
				securityDeposit: parseFloat(propertyData.securityDeposit),
				applicationFee: parseFloat(propertyData.applicationFee),
				beds: parseInt(propertyData.beds),
				baths: parseFloat(propertyData.baths),
				squareFeet: parseInt(propertyData.squareFeet),
			};

			console.log("Creating property with data:", formattedPropertyData);

			// create property
			const newProperty = await prisma.property.create({
				data: formattedPropertyData,
				include: {
					location: true,
					manager: true,
				},
			});

			console.log("Property created successfully:", newProperty.id);
			res.status(201).json(newProperty);
		} catch (dbError: any) {
			console.error("Database error:", dbError);
			res.status(500).json({
				message: `Error creating property in database: ${dbError.message}`,
				details: dbError,
			});
		}
	} catch (err: any) {
		console.error("Unexpected error in createProperty:", err);
		res.status(500).json({
			message: `Error creating property: ${err.message}`,
			stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
		});
	}
};
