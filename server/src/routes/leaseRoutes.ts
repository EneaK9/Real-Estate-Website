import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getLeasePayments, getLeases } from "../controllers/leaseControllers";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Lease:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the lease
 *         propertyId:
 *           type: string
 *           description: ID of the property being leased
 *         tenantId:
 *           type: string
 *           description: ID of the tenant leasing the property
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of the lease
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of the lease
 *         monthlyRent:
 *           type: number
 *           description: Monthly rent amount
 *         securityDeposit:
 *           type: number
 *           description: Security deposit amount
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the lease was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the lease was last updated
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the payment
 *         leaseId:
 *           type: string
 *           description: ID of the associated lease
 *         amount:
 *           type: number
 *           description: Payment amount
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           description: Date the payment was made
 *         status:
 *           type: string
 *           enum: [pending, completed, failed]
 *           description: Status of the payment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the payment record was created
 */

/**
 * @swagger
 * /leases:
 *   get:
 *     summary: Get all leases
 *     tags: [Leases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: string
 *         description: Filter by tenant ID
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *         description: Filter by property ID
 *     responses:
 *       200:
 *         description: List of leases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lease'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware(["manager", "tenant"]), getLeases);

/**
 * @swagger
 * /leases/{id}/payments:
 *   get:
 *     summary: Get payments for a specific lease
 *     tags: [Leases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The lease ID
 *     responses:
 *       200:
 *         description: List of payments for the lease
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lease not found
 */
router.get(
	"/:id/payments",
	authMiddleware(["manager", "tenant"]),
	getLeasePayments
);

export default router;
