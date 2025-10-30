import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Resend} from "resend";

// Initialize Firebase Admin
admin.initializeApp();

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

    // Only send email if status changed to "confirmed"
    if (beforeData.status !== "confirmed" && afterData.status === "confirmed") {
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
 * HTTP endpoint to get all names (for admin interface)
 * GET /getNames
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
    const namesSnapshot = await admin.firestore()
      .collection("names")
      .orderBy("createdAt", "desc")
      .get();

    const names = namesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({success: true, names});
  } catch (error) {
    functions.logger.error("Error fetching names", error);
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
