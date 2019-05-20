const Monitor = new Lure.Content ({
    Name: `Monitor`,
    Target: `.equipDashboard`,
    Type: `info`,
    Visible: true,
    Control: {
        Target: `#monitoring`
    },
    Content:    `<div class="monitoring">
                    <div class="monitoringState">
                        <div class="programState">
                            <span>Состояние программы мониторинга</span>
                        </div>
                        <div class="deviceState">
                            <span>Состояние оборудования</span>
                        </div>
                    </div>
                    <div class="chart"></div>
                </div>`,

    State: {
        InfoMessage: `Выберите модуль для отображения информации`,
        Children: []
    },

    Methods() {
        /**
         * @param {array} programData
         * @param {array} deviceData
         *
         */

        this.SetData = function (programData, deviceData) {
            this._ProgramState.Series[0].Data = programData;
            this._DeviceState.Series[0].Data = deviceData;
            this._ProgramState.Redraw();
            this._DeviceState.Redraw();

            // this.LogTarget = this.Select(`.activityInfo`);
            // this.LogTarget.innerText = ``;
            // for (let hourData of data) {
            //     if (hourData.HourValue) {
            //         const logString = document.createElement(`div`);
            //         logString.classList.add(`logString`);
            //         logString.innerText = `${hourData.HourValue}:00: в сети: ${Math.floor(hourData.Online_Count / 60 * 100)}%, количество считываний: ${hourData.OK_Count} количество ошибок: ${hourData.Err_Count}`;
            //         this.LogTarget.appendChild(logString);
            //     }
            // }
        };
    },

    AfterBuild() {
        this._ProgramState = new Lure.Chart({
            Target: this.Select(`.chart`),
            Type: 'pie',
            Legend: {
                Visible: false
            },
            Series: [
                // {
                //     Labels: {
                //         Data: Lure.Culture.MonthNames.Select(m => m + ' ' + this.Parent.CurrentYear),
                //         Data: ["Январь 2018", "Февраль 2018", "Март 2018", "Апрель 2018", "Май 2018", "Июнь 2018", "Июль 2018", "Август 2018", "Сентябрь 2018", "Октябрь 2018", "Ноябрь 2018", "Декабрь 2018"],
                //     },
                //     Data: [5, 2, 3, 1, 4, 5, 7, 1, 2, 3, 3, 4],
                //     Colors: ["#6FAD81", "#7AD096", "#82E29F", "#AD776E", "#D0887D", "#E29284", "#ADA66E", "#D0C98A", "#E2D984", "#7DB0D0", "#85C2E2", "#8ACBF4"],
                //     Type: 'ring',
                //     Width: 32,
                //     AngleStart: -90,
                // },
                {
                    Labels: {
                        Data: [`Онлайн`, `Средне (???)`, `Плохо (???)`],
                    },
                    Data: [10, 10, 10, 10],
                    Colors: [`#00B74A`, `#FF9500`, `#FF2300`],
                    // Type: 'ring',
                    // Width: 200,
                    AngleStart: 0,
                }
            ],
        });
        this._DeviceState = new Lure.Chart({
            Target: this.Select(`.chart`),
            Type: 'pie',
            Legend: {
                Visible: false
            },
            Series: [
                // {
                //     Labels: {
                //         Data: Lure.Culture.MonthNames.Select(m => m + ' ' + this.Parent.CurrentYear),
                //         Data: ["Январь 2018", "Февраль 2018", "Март 2018", "Апрель 2018", "Май 2018", "Июнь 2018", "Июль 2018", "Август 2018", "Сентябрь 2018", "Октябрь 2018", "Ноябрь 2018", "Декабрь 2018"],
                //     },
                //     Data: [5, 2, 3, 1, 4, 5, 7, 1, 2, 3, 3, 4],
                //     Colors: ["#6FAD81", "#7AD096", "#82E29F", "#AD776E", "#D0887D", "#E29284", "#ADA66E", "#D0C98A", "#E2D984", "#7DB0D0", "#85C2E2", "#8ACBF4"],
                //     Type: 'ring',
                //     Width: 32,
                //     AngleStart: -90,
                // },
                {
                    Labels: {
                        Data: [`Нет данных`, `Успешные транзакции`, `Ошибки при чтении`, `Требуется диагностика`],
                    },
                    Data: [10, 10, 10, 10],
                    Colors: [`#707575`, `#00B74A`, `#FF9500`, `#FF2300`],
                    // Type: 'ring',
                    // Width: 200,
                    AngleStart: 0,
                }
            ],
        });
    }
});

window.Monitor = Monitor;
module.exports = Monitor;
