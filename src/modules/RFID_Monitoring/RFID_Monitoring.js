const RFID_Monitoring = new Lure.Content({
    Target: '.body',
});
window.RFID_Monitoring = RFID_Monitoring;

RFID_Monitoring.Nav = require('./Nav/Nav');
RFID_Monitoring.Report = require('./Report/Report');
