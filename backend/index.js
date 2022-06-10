let mysql2 = require("mysql2");
const express = require("express");
const cors = require("cors");
const app = express();
let connectionRequest = require("./mySQLConnection");
const url = "http://localhost:3001/slots";
app.use(express.json());
app.use(cors());

var listSlots = {};
var showSlots = {};

app.listen(3001, () => {
  console.log(`Example app listening at 3001`);
});

const getAllSlotStatusUseEffect = (req, res, next) => {
  connection = connectionRequest();

  connection.query("SELECT * FROM Parking", (err, values) => {
    if (err) {
      connection.destroy();
    } else {
      listSlots = values;

      connection.destroy();
      return listSlots;
    }
  });
};

app.get("/slots", (req, res) => {
  getAllSlotStatusUseEffect();
  res.json({
    slots: listSlots,
  });
});

const updateSlotStatusForInputedRegNo = (req, res, next) => {
  //Establish the connection on this request

  connection = connectionRequest();

  connection.query(
    "UPDATE Parking SET VehicleType = ? where id",
    req["vehicleTypeToBeAssigned"],
    (err, values) => {
      if (err) {
        connection.destroy();
        return err;
      } else {
        connection.destroy();
        return values;
      }
    }
  );

  connection.query(
    "UPDATE Parking SET VehicleSize = (if(VehicleType = 'S',3,if(VehicleType = 'C',2,1)))",
    req["vehicleTypeToBeAssigned"],
    (err, values) => {
      if (err) {
        connection.destroy();
        return err;
      } else {
        connection.destroy();
        return values;
      }
    }
  );

  connection.query(
    "update Parking set RegNo = ? ,Status='O' where VehicleType = ?",
    [req["regNoToBeAssignedWithSlot"], req["vehicleTypeToBeAssigned"]],
    (err, values) => {
      if (err) {
        console.log(
          `not successful! Reg,Status,VehicleType,VehicleSize ${err}`
        );
        connection.destroy();
        return err;
      } else {
        console.log(`Query was successful`);

        console.log(values, "values in mysql func");

        connection.destroy();
        return values;
      }
    }
  );
};

const showSlotStatusForSlotIDOrRegNo = (req, res, next) => {
  connection = connectionRequest();
  console.log(
    req["slotNoForSearchingVehicleBackend"],
    req["regNoToBeAssignedWithSlotBackend"],
    "req show slots"
  );
  connection.query(
    "SELECT id,RegNo,SlotNo,Status,VehicleType from Parking WHERE SlotNo =(IF(SlotNo IS NULL OR SlotNo = '', 'empty', ?)) or RegNo = (IF(RegNo IS NULL OR RegNo = '', 'empty', ?))",
    [
      req["slotNoForSearchingVehicleBackend"],
      req["regNoToBeAssignedWithSlotBackend"],
    ],
    (err, values) => {
      if (err) {
        connection.destroy();
      } else {
        showSlots = values;
        connection.destroy();
        return showSlots;
      }
    }
  );
};

app.get("/slotForGivenSlotIDOrRegNo", (req, res) => {
  res.json({
    slotForSlotIDOrRegNo: showSlots,
  });
});

app.post("/assignSlot", (req, res, next) => {
  res.json(req.body);
  updateSlotStatusForInputedRegNo(req.body);
});

app.post("/searchSlot", (req, res, next) => {
  res.json(req.body);
  showSlotStatusForSlotIDOrRegNo(req.body);
});

module.exports = app;
