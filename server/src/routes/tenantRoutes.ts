import express from "express";
import {
	getTenant,
	createTenant,
	updateTenant,
	getCurrentResidences,
	addFavoriteProperty,
	removeFavoriteProperty,
} from "../controllers/tenantControllers";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Tenant:
 *       type: object
 *       required:
 *         - cognitoId
 *         - firstName
 *         - lastName
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the tenant
 *         cognitoId:
 *           type: string
 *           description: The Cognito ID of the tenant
 *         firstName:
 *           type: string
 *           description: The tenant's first name
 *         lastName:
 *           type: string
 *           description: The tenant's last name
 *         email:
 *           type: string
 *           description: The tenant's email address
 *         phone:
 *           type: string
 *           description: The tenant's phone number
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the tenant was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the tenant was last updated
 */

/**
 * @swagger
 * /tenants/{cognitoId}:
 *   get:
 *     summary: Get a tenant by Cognito ID
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cognitoId
 *         schema:
 *           type: string
 *         required: true
 *         description: The tenant's Cognito ID
 *     responses:
 *       200:
 *         description: The tenant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 */
router.get("/:cognitoId", getTenant);

/**
 * @swagger
 * /tenants/{cognitoId}:
 *   put:
 *     summary: Update tenant information
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cognitoId
 *         schema:
 *           type: string
 *         required: true
 *         description: The tenant's Cognito ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: The tenant was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 */
router.put("/:cognitoId", updateTenant);

/**
 * @swagger
 * /tenants:
 *   post:
 *     summary: Create a new tenant
 *     tags: [Tenants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cognitoId
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               cognitoId:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: The tenant was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tenant'
 *       400:
 *         description: Invalid input data
 */
router.post("/", createTenant);

/**
 * @swagger
 * /tenants/{cognitoId}/current-residences:
 *   get:
 *     summary: Get tenant's current residences
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cognitoId
 *         schema:
 *           type: string
 *         required: true
 *         description: The tenant's Cognito ID
 *     responses:
 *       200:
 *         description: The tenant's current residences
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 */
router.get("/:cognitoId/current-residences", getCurrentResidences);

/**
 * @swagger
 * /tenants/{cognitoId}/favorites/{propertyId}:
 *   post:
 *     summary: Add a property to tenant's favorites
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cognitoId
 *         schema:
 *           type: string
 *         required: true
 *         description: The tenant's Cognito ID
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *         description: The property ID to add to favorites
 *     responses:
 *       200:
 *         description: Property added to favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant or property not found
 */
router.post("/:cognitoId/favorites/:propertyId", addFavoriteProperty);

/**
 * @swagger
 * /tenants/{cognitoId}/favorites/{propertyId}:
 *   delete:
 *     summary: Remove a property from tenant's favorites
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cognitoId
 *         schema:
 *           type: string
 *         required: true
 *         description: The tenant's Cognito ID
 *       - in: path
 *         name: propertyId
 *         schema:
 *           type: string
 *         required: true
 *         description: The property ID to remove from favorites
 *     responses:
 *       200:
 *         description: Property removed from favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant or property not found
 */
router.delete("/:cognitoId/favorites/:propertyId", removeFavoriteProperty);

export default router;
