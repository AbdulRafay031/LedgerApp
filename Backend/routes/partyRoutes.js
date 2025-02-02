import express from"express"
import { updateCredit,deleteParty,addParty,getAllParty} from"../controllers/partyController.js"

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const parties = await Party.find();
      res.status(200).json(parties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching parties", error });
    }
  });
  

// Route for adding a new party
router.post("/add-party", addParty);
router.get("/get-all-party", getAllParty);
router.delete("/delete-party/:id", deleteParty);
router.post("/update-credit/:id", updateCredit);


export default router;
