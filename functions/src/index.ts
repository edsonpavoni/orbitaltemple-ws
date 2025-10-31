import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Resend} from "resend";

// Initialize Firebase Admin
admin.initializeApp();

// Helper functions
function isValidEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Type definitions
interface NameSubmission {
  name: string;
  email: string;
}

interface NameDocument {
  name: string;
  email: string;
  status: "pending" | "sent" | "confirmed" | "deleted";
  createdAt: admin.firestore.Timestamp;
  sentAt?: admin.firestore.Timestamp;
  confirmedAt?: admin.firestore.Timestamp;
  deletedAt?: admin.firestore.Timestamp;
  ipAddress?: string;
  country?: string;
  countryCode?: string;
}

/**
 * HTTP endpoint to submit a new name for ascension
 * POST /submitName
 * Body: { name: string, email: string }
 */
export const submitName = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {name, email} = req.body as NameSubmission;

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({error: "Name is required"});
      return;
    }

    if (!email || typeof email !== "string" || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      res.status(400).json({error: "Valid email is required"});
      return;
    }

    // Get IP address from request
    const ipAddress = req.headers["x-forwarded-for"] as string ||
                     req.headers["x-real-ip"] as string ||
                     req.connection.remoteAddress ||
                     "unknown";

    // Clean IP (take first if comma-separated)
    const cleanIp = ipAddress.split(",")[0].trim();

    // Try to get country from IP using free ip-api.com service
    let country = "Unknown";
    let countryCode = "XX";

    try {
      const ipResponse = await fetch(`http://ip-api.com/json/${cleanIp}?fields=country,countryCode`);
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        country = ipData.country || "Unknown";
        countryCode = ipData.countryCode || "XX";
      }
    } catch (ipError) {
      functions.logger.warn("Could not fetch IP location", {ip: cleanIp, error: ipError});
    }

    // Save to Firestore
    const nameDoc: NameDocument = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      status: "pending",
      createdAt: admin.firestore.Timestamp.now(),
      ipAddress: cleanIp,
      country: country,
      countryCode: countryCode,
    };

    const docRef = await admin.firestore().collection("names").add(nameDoc);

    functions.logger.info("Name submitted successfully", {
      id: docRef.id,
      name: nameDoc.name,
      country: country,
      ip: cleanIp,
    });

    // Send immediate confirmation email
    try {
      const resend = new Resend(functions.config().resend.api_key);

      const emailResult = await resend.emails.send({
        from: "Orbital Temple <noreply@orbitaltemple.art>",
        to: [email.trim().toLowerCase()],
        subject: `${name.trim()} is now queued for ascension`,
        text: `The name\n${name.trim()}\nis now queued\nfor ascension.\n\nWhen the\ntemple in space\naligns, with\nour antenna\non Earth\n\nwe will send\nthe name\nand you'll receive\na message.`,
      });

      functions.logger.info("Immediate confirmation email sent", {
        nameId: docRef.id,
        email: email.trim().toLowerCase(),
        resendResponse: emailResult,
      });
    } catch (emailError) {
      functions.logger.error("Error sending immediate confirmation email", {
        nameId: docRef.id,
        error: emailError,
        errorMessage: emailError instanceof Error ? emailError.message : "Unknown error",
        errorStack: emailError instanceof Error ? emailError.stack : undefined,
      });
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      id: docRef.id,
      message: "Name queued for ascension",
    });
  } catch (error) {
    functions.logger.error("Error submitting name", error);
    res.status(500).json({error: "Internal server error"});
  }
});

/**
 * Firestore trigger to send confirmation email when name status changes to "confirmed"
 */
export const sendConfirmationEmail = functions.firestore
  .document("names/{nameId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data() as NameDocument;
    const afterData = change.after.data() as NameDocument;

    // Only send email if status changed to "confirmed" and email is valid
    if (beforeData.status !== "confirmed" && afterData.status === "confirmed") {
      // Skip sending email if email is invalid
      if (!isValidEmail(afterData.email)) {
        functions.logger.warn("Skipping email send - invalid email address", {
          nameId: context.params.nameId,
          email: afterData.email,
        });
        return;
      }

      try {
        // Initialize Resend with API key from Firebase config
        const resend = new Resend(functions.config().resend.api_key);

        // Format the confirmation timestamp
        const confirmedAt = afterData.confirmedAt || admin.firestore.Timestamp.now();
        const date = confirmedAt.toDate();

        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        // Send email via Resend
        const emailResult = await resend.emails.send({
          from: "Orbital Temple <noreply@orbitaltemple.art>", // Change this to your verified domain
          to: [afterData.email],
          subject: `${afterData.name} ascension to the Orbital Temple in space`,
          text: `Today, ${formattedDate}, at ${formattedTime} the name ${afterData.name} ascend, and there it remains.`,
        });

        functions.logger.info("Confirmation email sent", {
          nameId: context.params.nameId,
          email: afterData.email,
          emailId: emailResult.data?.id,
        });
      } catch (error) {
        functions.logger.error("Error sending confirmation email", {
          nameId: context.params.nameId,
          error: error,
        });
      }
    }
  });

/**
 * HTTP endpoint to get names (for admin interface)
 * GET /getNames?limit=100
 * Query params:
 *   - limit (optional): Number of names to fetch. If not provided, fetches all.
 */
export const getNames = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  // Only accept GET requests
  if (req.method !== "GET") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    // Get limit from query parameter
    const limitParam = req.query.limit as string | undefined;
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    let query = admin.firestore()
      .collection("names")
      .orderBy("createdAt", "desc");

    // Apply limit if specified
    if (limit && limit > 0) {
      query = query.limit(limit) as any;
    }

    const namesSnapshot = await query.get();

    const names = namesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({success: true, names, count: names.length});
  } catch (error) {
    functions.logger.error("Error fetching names", error);
    res.status(500).json({error: "Internal server error"});
  }
});

/**
 * HTTP endpoint to get name count statistics
 * GET /getNameCount
 */
export const getNameCount = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  // Only accept GET requests
  if (req.method !== "GET") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const namesCollection = admin.firestore().collection("names");

    // Get total count
    const totalSnapshot = await namesCollection.count().get();
    const total = totalSnapshot.data().count;

    // Get counts by status
    const pendingSnapshot = await namesCollection.where("status", "==", "pending").count().get();
    const sentSnapshot = await namesCollection.where("status", "==", "sent").count().get();
    const confirmedSnapshot = await namesCollection.where("status", "==", "confirmed").count().get();

    const stats = {
      total: total,
      pending: pendingSnapshot.data().count,
      sent: sentSnapshot.data().count,
      confirmed: confirmedSnapshot.data().count,
    };

    res.status(200).json({success: true, stats});
  } catch (error) {
    functions.logger.error("Error fetching name count", error);
    res.status(500).json({error: "Internal server error"});
  }
});

/**
 * HTTP endpoint to update name status (for admin interface)
 * POST /updateNameStatus
 * Body: { nameId: string, status: string }
 */
export const updateNameStatus = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {nameId, status} = req.body;

    // Validate input
    if (!nameId || typeof nameId !== "string") {
      res.status(400).json({error: "Name ID is required"});
      return;
    }

    if (!status || !["pending", "sent", "confirmed", "deleted"].includes(status)) {
      res.status(400).json({error: "Valid status is required (pending, sent, confirmed, deleted)"});
      return;
    }

    // Update document
    const updateData: Partial<NameDocument> = {status};

    if (status === "sent") {
      updateData.sentAt = admin.firestore.Timestamp.now();
    } else if (status === "confirmed") {
      updateData.confirmedAt = admin.firestore.Timestamp.now();
    } else if (status === "deleted") {
      updateData.deletedAt = admin.firestore.Timestamp.now();
    }

    await admin.firestore().collection("names").doc(nameId).update(updateData);

    functions.logger.info("Name status updated", {nameId, status});

    res.status(200).json({success: true, message: "Status updated successfully"});
  } catch (error) {
    functions.logger.error("Error updating name status", error);
    res.status(500).json({error: "Internal server error"});
  }
});
