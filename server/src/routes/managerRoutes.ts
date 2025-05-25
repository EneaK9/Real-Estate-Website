import express from "express";
import {
  getManager,
  createManager,
  updateManager,
  getManagerProperties,
} from "../controllers/managerControllers";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Manager:
 *       type: object
 *       required:
 *         - cognitoId
 *         - firstName
 *         - lastName
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the manager
 *         cognitoId:
 *           type: string
 *           description: The Cognito ID of the manager
 *         firstName:
 *           type: string
 *           description: The manager's first name
 *         lastName:
 *           type: string
 *           description: The manager's last name
 *         email:
 *           type: string
 *           description: The manager's email address
 *         phone:
 *           type: string
 *           description: The manager's phone number
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the manager was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the manager was last updated
 */

/**
 * @swagger
 * /managers/{cognitoId}:
 *   get:
 *     summary: Get a manager by Cognito ID
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cognitoId
 *         schema:
 *           type: string
 *         required: true
 *         description: The manager's Cognito ID
 *     responses:
 *       200:
 *         description: The manager details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Manager'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Manager not found
 */
router.get("/:cognitoId", getManager);

/**
 * @swagger
 * /managers/{cognitoId}:
 *   put:
 *     summary: Update manager information
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cognitoId
 *         schema:
 *           type: string
 *         required: true
 *         description: The manager's Cognito ID
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
 *         description: The manager was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Manager'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Manager not found
 */
router.put("/:cognitoId", updateManager);

/**
 * @swagger
 * /managers/{cognitoId}/properties:
 *   get:
 *     summary: Get properties managed by a manager
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cognitoId
 *         schema:
 *           type: string
 *         required: true
 *         description: The manager's Cognito ID
 *     responses:
 *       200:
 *         description: List of properties managed by the manager
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Manager not found
 */
router.get("/:cognitoId/properties", getManagerProperties);

/**
 * @swagger
 * /managers:
 *   post:
 *     summary: Create a new manager
 *     tags: [Managers]
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
 *         description: The manager was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Manager'
 *       400:
 *         description: Invalid input data
 */
router.post("/", createManager);

export default router;
