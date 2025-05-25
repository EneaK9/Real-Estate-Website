import express from "express";
import {
	getProperties,
	getProperty,
	createProperty,
} from "../controllers/propertyControllers";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";

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
