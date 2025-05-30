import express from "express";
import {
	getProperties,
	getProperty,
	createProperty,
} from "../controllers/propertyControllers";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the property
 *         name:
 *           type: string
 *           description: The name of the property
 *         address:
 *           type: string
 *           description: The address of the property
 *         price:
 *           type: number
 *           description: The rental price of the property
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs of property photos
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the property was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the property was last updated
 */

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Returns a list of all properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: The list of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 */
router.get("/", getProperties);

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get a property by id
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The property id
 *     responses:
 *       200:
 *         description: The property details by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       404:
 *         description: The property was not found
 */
router.get("/:id", getProperty);

/**
 * @swagger
 * /properties/{id}/leases:
 *   get:
 *     summary: Get leases for a specific property
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The property ID
 *     responses:
 *       200:
 *         description: List of leases for the property
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lease'
 *       404:
 *         description: Property not found
 */
router.get(
	"/:id/leases",
	authMiddleware(["manager", "tenant"]),
	async (req: Request, res: Response): Promise<void> => {
		try {
			const propertyId = parseInt(req.params.id);

			// Check if property exists
			const property = await prisma.property.findUnique({
				where: { id: propertyId },
			});

			if (!property) {
				res.status(404).json({ message: "Property not found" });
				return;
			}

			// Get leases for this property
			const leases = await prisma.lease.findMany({
				where: { propertyId },
				include: {
					tenant: true,
					property: true,
					payments: true,
				},
			});

			res.json(leases);
		} catch (error: any) {
			console.error("Error fetching property leases:", error);
			res.status(500).json({
				message: `Failed to fetch property leases: ${error.message}`,
				stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
			});
		}
	}
);

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               price:
 *                 type: number
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: The property was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.post(
	"/",
	authMiddleware(["manager"]),
	upload.array("photos"),
	createProperty
);

export default router;
