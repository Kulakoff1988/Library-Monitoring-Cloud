const DataDash = new Lure.Content ({
    Name: `DataDash`,
    Target: `.body`,
    Content:    `<div class="dataDash">
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
                </div>`,
    State: {
        Name: `ВСЕ СИСТЕМЫ В НОРМЕ`,
        Status: "./img/icon-allChecked.png"
    },

    Methods() {
        this.ViewStatus = function (status) {
            this.State.Name = status.Name;
            this.State.Status = status.Status;
            this.Proto.Refresh();
        }
    },

    AfterBuild() {
        const displayWidth = window.matchMedia('(max-width: 768px)').matches;
        if (displayWidth) {
            const newParentForFeatures = this.Content.querySelector(`.forEqAndFeat`);
            newParentForFeatures.appendChild(this.Target.querySelector(`.features`));
            this.Target.querySelector(`.features`).classList.add(`forTabDisplay`);
            this.Target.removeChild(this.Target.querySelector(`.features`));
        }

        this._PeriodPicker = new Lure.PeriodPicker({
            Target: `.forPeriodPicker`,
            Max: new Date(),
            OnConfirm: () => {
                const dates = this._PeriodPicker.Date.map(date => Lure.Date(date).Format(`DD.MM.YYYY`));
                SideNavigator.Date = dates;
    }
        });
    }
});

require('./DataDash/EquipDashboard');
window.DataDash = DataDash;
module.exports = DataDash;