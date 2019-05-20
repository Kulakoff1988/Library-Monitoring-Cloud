//temporarily variable
const   typeDict = {
            Lib: 0,
            Reader: 1,
            Gates: 2,
            SSS: 3,
            SRS: 4,
            SBX: 5,
            SmartShelf: 6
        },
        getAggregateCommonData = require('./AggregateData');

const Report = new Lure.Content ({
    Name: `Report`,
    Target: `.body`,
    Content:    `<div class="report">
                    <div class="forEqAndFeat">
                        <div class="equipStatus">
                            <div class="chosenName">
                                <div class="statusIcon"></div>
                                <span>{{Name}}</span>
                            </div>
                            <div class="filter">
                                <span>Фильтр даты</span>
                                <div class="forPeriodPicker"></div>
                            </div>
                        </div>
                    </div>
                    <div class="equipDashboardWrapper">
                        <div class="equipDashboard">
                            <div class="tables">
                                <div class="featureChoice l-button" id="stats">Статистика</div>
                                <div class="featureChoice l-button" id="monitoring">Мониторинг</div>
                            </div>
                        </div>
                    </div>
                </div>`,
    State: {
        Name: `ВСЕ СИСТЕМЫ В НОРМЕ`,
        Status: "./img/icon-allChecked.png",
        Date: [Lure.Date(), Lure.Date()]
    },

    GetSet: {
        set Date(dates) {
            this.State.Date = dates;
        }
    },

    Methods() {
        this.ShowCurrentDevice = function (equipDescription) {
            this.State.Name = equipDescription.Name;
            this.Proto.Refresh();
        };

        this.Run = function (equipDescription) {
            this.ShowCurrentDevice(equipDescription);
            Statistics.ShowEquipStatButtons(equipDescription);
            const hasChildren = equipDescription.HasChildren === `true`;
            const deviceID = hasChildren ? -1 : equipDescription.ID;
            const typeID = hasChildren ? typeDict[equipDescription.ID] : -1;
            const { Date } = this.State,
                startDate = Lure.Date(Date[0]).Int,
                endDate = Lure.Date(Date[1]).Int;
            api.Devices_Data_Get(deviceID, typeID, startDate, endDate, {
                Then: res => {
                    if (res.length > 0) {
                        const { aggregatedDataForStatistics, aggregatedDataForMonitor} = getAggregateCommonData(res, startDate, endDate);
                        const { aggregatedData, axisX_Labels} = aggregatedDataForStatistics;
                        const { programStatus, deviceStatus } = aggregatedDataForMonitor;
                        Statistics.SetData(aggregatedData, axisX_Labels);
                        Monitor.SetData(programStatus, deviceStatus);
                    }
                    else {
                        Monitor.Proto.SetProperty(`InfoMessage`, `За выбранный период нет данных, либо устройство было неактивно`);
                        Statistics.SetData([]);
                    }
                }
            });
        };
    },

    AfterBuild() {
        this._PeriodPicker = new Lure.PeriodPicker({
            Target: `.forPeriodPicker`,
            Max: new Date(),
            OnConfirm: () => {
                this.Date = this._PeriodPicker.Date.map(date => Lure.Date(date).DayStart);
            },
            DateRange: [Lure.Date(), Lure.Date()]
        });
    }
});


window.Report = Report;

Report.Monitor = require('./Monitor/Monitor');
Report.Statistics = require('./Statistics/Statistics');