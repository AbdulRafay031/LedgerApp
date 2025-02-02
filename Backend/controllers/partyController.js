import { Party } from "../models/Party.js";

// Add a new party
const addParty = async (req, res) => {
  try {
    const party = new Party(req.body);
    await party.save();
    res.status(201).json({ message: "Party added successfully", party });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding party", error: error.message });
  }
};


const getAllParty = async (req, res) => {
  try {
    const parties = await Party.find();
    return res.status(200).json({
      success: true,
      message: "Get all parties successfully",
      data: parties,
    });
  } catch (error) {
    console.error("Error fetching parties:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch parties",
      error: error.message,
    });
  }
};

const deleteParty = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure ID is valid
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Party ID is required" });
    }

    // Delete the party
    const deletedParty = await Party.findByIdAndDelete(id);

    // Handle case when the party does not exist
    if (!deletedParty) {
      return res
        .status(404)
        .json({ success: false, message: "Party not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Party deleted successfully" });
  } catch (error) {
    console.error("Error deleting party:", error.message); // Log the error for debugging
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting party",
        error: error.message,
      });
  }
};


// Send WhatsApp message after credit update
// const sendWhatsAppMessage = async (party, amount) => {
//   try {
   
//     const message = `${party.name} from ${party.shopName} has paid ${amount} to ${party.shopName}`;
//     await client.messages.create({
//       from: `whatsapp:${twilioNumber}`,
//       to: `whatsapp:${party.number}`,
//       body: message,
//     });
//     console.log("WhatsApp message sent successfully.");
//   } catch (error) {
//     console.error("Error sending WhatsApp message:", error.message);
//   }
// };


const updateCredit = async (req, res) => {
  const { id } = req.params; // ID of the party to update
  const { totalCredit, transaction } = req.body; // New data to update

  try {
    const party = await Party.findById(id);

    if (!party) {
      return res
        .status(404)
        .json({ success: false, message: "Party not found" });
    }

    // Append the new totalCredit value to the creditHistory
    const updatedParty = await Party.findByIdAndUpdate(
      id,
      {
        $set: { totalCredit }, // Update the latest totalCredit
        $push: {
          creditHistory: totalCredit, // Append new credit to the creditHistory array
          transactions: transaction, // Append the new transaction
        },
      },
      { new: true } // Return the updated document
    );

    // const message = `Asghar Ali from shamashopping has paid ${transaction.amount} to ${party.name} ${party.shopName}`;
    // await sendWhatsAppMessage(updatedParty, transaction.amount);

    res.status(200).json({ success: true, party: updatedParty });
  } catch (error) {
    console.error("Error updating party:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { updateCredit, deleteParty, getAllParty, addParty };
