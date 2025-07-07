console.log("stockhistory controller loading ");
const lots= require("../model/mngstocknomodel")
const lothistory = require("../model/mngstockhistorymodel")

class stockhistory{

    
    static async getAll(req, res) {
        try {
            const selectedLot = req.query.lot || "";
    
            // Get all lot options for dropdown
            const Lots = await lots.getAll();
    
            // Filter lot data by selected lot if present
            let lotdatas;
            if (selectedLot) {
                lotdatas = await lothistory.getByLot(selectedLot);
            } else {
                lotdatas = await lothistory.getAll();
            }
    
            res.render("stockhistory", {
                Lots,
                lotdatas,
                selectedLot
              });
        } catch (error) {
            console.error("Error fetching lots:", error);
            res.status(500).send("Internal Server Error");
        }
    }

}

module.exports=stockhistory;