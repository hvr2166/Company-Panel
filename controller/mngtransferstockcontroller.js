console.log("mngtransferstockcontroller.js loaded");
const mngtrnasfermodel=require("../model/mngtransferstockmodel");

class transfer{
    static async loadTransferPage(req, res) {
        try {
            const lots = await mngtrnasfermodel.getAllLots();
            res.render('transferstocks', { lots });
        } catch (error) {
            console.error("Error loading page:", error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async getAllTransferStocks(req, res) {
        try {
            const transferStock = await mngtrnasfermodel.getAllTransferStock();
    
            // Extract unique lots from from_lot and to_lot
            const lotsSet = new Set();
            transferStock.forEach(entry => {
                if (entry.from_lot) lotsSet.add(entry.from_lot);
                if (entry.to_lot) lotsSet.add(entry.to_lot);
            });
    
            const lots = Array.from(lotsSet);
            res.render('viewalltransfer', { transferStock, lots });
        } catch (error) {
            console.error("Error fetching transfer stock:", error);
            res.status(500).json({ error: "Error fetching transfer stock" });
        }
    }
    

    static async getLotDetails(req, res) {
        try {
            const { id } = req.params; // fix: renamed from nid to id
            console.log("id", id);
            const lotDetails = await mngtrnasfermodel.getLotDetailsById(id);
            res.json({
                pcs: lotDetails.pcs,
                price: lotDetails.price
            });
        } catch (error) {
            console.error("Error fetching lot details:", error);
            res.status(500).json({ error: "Error fetching details" });
        }
    }

    static async transferStock(req, res) {
        try {
          const { sourceLots, destinationLots, summary, remarks } = req.body;
      
          const mapSource = (s) => ({
            from_lot: s.lot,
            from_current_qty: s.current_qty,
            from_trans_qty: s.trans_qty,
            from_final_qty: s.final_qty,
            from_price: s.price,
            from_amount: s.amount
          });
      
          const mapDestination = (d) => ({
            to_lot: d.lot,
            to_current_qty: d.current_qty,
            to_trans_qty: d.trans_qty,
            to_final_qty: d.final_qty,
            to_price: d.price,
            to_amount: d.amount,
            avg_price: d.avg_price
          });

          const filteredSource = sourceLots.filter(lot => lot.lot && lot.trans_qty);
const filteredDestination = destinationLots.filter(lot => lot.lot && lot.trans_qty);
      
          
if (filteredSource.length === 1 && filteredDestination.length === 1) {
    const flatData = {
      ...mapSource(filteredSource[0]),
      ...mapDestination(filteredDestination[0]),
      ...summary,
      remarks
    };
    await mngtrnasfermodel.insertTransferData(flatData);
          } else if (sourceLots.length > 1 && destinationLots.length === 1) {
            // Many-to-One
            const destination = destinationLots[0];
            for (const source of sourceLots) {
              const flatData = {
                ...mapSource(source),
                ...mapDestination(destination),
                ...summary,
                remarks
              };
              await mngtrnasfermodel.insertTransferData(flatData);
            }
      
          } else if (sourceLots.length === 1 && destinationLots.length === 1) {
            // One-to-One
            const flatData = {
              ...mapSource(sourceLots[0]),
              ...mapDestination(destinationLots[0]),
              ...summary,
              remarks
            };
            await mngtrnasfermodel.insertTransferData(flatData);
      
          } else {
            // Many-to-Many (not allowed)
            return res.status(400).json({ message: 'Many-to-many transfer is not supported directly' });
          }
      
          // ✅ Only send response once
          res.status(200).json({ message: 'Transfer successful' });
      
        } catch (error) {
          console.error("Error during transfer:", error);
          res.status(500).json({ error: "Error during transfer" });
        }
      }
}

module.exports= transfer;