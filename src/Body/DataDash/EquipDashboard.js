const  equipIconPaths = {
            100: `<img src="./img/icon-library.png">`,
            101: `<img src="./img/icon-gatesBig.png">`,
            201: `<img src="./img/icon-bookStationBig.png">`
        };

const EquipDashboard = new Lure.Content ({
    Name: `EquipDashboard`,
    Target: `.dataDash`,
    Content:    `<div class="equipDashboardWrapper">
                    <div class="equipDashboard">
                        <div class="tables">
                            <div class="featureChoice l-button" id="stats">Статистика</div>
                            <div class="featureChoice l-button" id="monitoring">Мониторинг</div>
                        </div>
                    </div>
                </div>`
});

require('./EquipDashboard/Chart');
require('./EquipDashboard/Monitoring');
window.EquipDashboard = EquipDashboard;
module.exports = EquipDashboard;