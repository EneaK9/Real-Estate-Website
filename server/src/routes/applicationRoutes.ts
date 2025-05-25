import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
	createApplication,
	listApplications,
	updateApplicationStatus,
} from "../controllers/applicationControllers";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       required:
 *         - propertyId
 *         - tenantId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the application
 *         propertyId:
 *           type: string
 *           description: ID of the property being applied for
 *         tenantId:
 *           type: string
 *           description: ID of the tenant submitting the application
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 *           description: Status of the application
 *         moveInDate:
 *           type: string
 *           format: date
 *           description: Requested move-in date
 *         notes:
 *           type: string
 *           description: Additional notes for the application
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the application was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the application was last updated
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create a new rental application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *             properties:
 *               propertyId:
 *                 type: string
 *               moveInDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: The application was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware(["tenant"]), createApplication);

/**
 * @swagger
 * /applications/{id}/status:
 *   put:
 *     summary: Update the status of an application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: The application status was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
router.put("/:id/status", authMiddleware(["manager"]), updateApplicationStatus);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Get a list of applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: string
 *         description: Filter applications by tenant ID
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *         description: Filter applications by property ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter applications by status
 *     responses:
 *       200:
 *         description: A list of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware(["manager", "tenant"]), listApplications);

export default router;
