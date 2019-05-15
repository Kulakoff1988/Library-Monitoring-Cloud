const statusGradient = data => {
    const parent = document.createElement(`div`);
    return data.reduce((acc, item) => {
        const child = document.createElement(`div`);
        if (item.Status) {
            child.classList.add(item.Status);
            parent.appendChild(child);
        }
        else {
            child.classList.add(`inactive`);
            parent.appendChild(child);
        }
        return acc;
    }, parent);
};

const Monitoring = new Lure.Content ({
    Name: `Monitoring`,
    Target: `.equipDashboard`,
    Type: `info`,
    // Visible: true,
    Control: {
        Target: `#monitoring`
    },
    Content:    `<div class="monitoring">
                    {{View}}
                </div>`,

    State: {
        InfoMessage: `Выберите модуль для отображения информации`,
        View: `<div class="colorGradient"></div>
               <div class="timeStep"></div>
               <div class="chartInfo">
                    <div class="chart"></div>
                    <div class="activityInfo">Здесь будет отображаться информация об активности</div>
               </div>`,
        Children: []
    },

    Methods() {
        this.GetChildrenForShortcut = function (children) {
            this.State.View = children.reduce((acc, childName) => {
                return acc + `<div class="forName">${childName}</div>
                             <div class="colorGradient"></div>
                             <div class="timeStep"></div>`
            }, ``).split('').join('');
            // this.Gradient = this.SelectAll(`.colorGradient`);
            // children = statusGradient(data);
            // this.Gradient.innerHTML = children.innerHTML;
            // this.Select(`.timeStep`).innerHTML = timeScale.reduce((acc, item) => {
            //     return acc + `<div class="step">${item}</div>`
            // }, ``);
        };


        this.RenderReaderInfo = function() {
            const render = `<div class="colorGradient"></div>
                           <div class="timeStep"></div>
                           <div class="chartInfo">
                                <div class="chart"></div>
                                <div class="activityInfo">Здесь будет отображаться информация об активности</div>
                           </div>`;
            return render;
        };

        /**
         * @param {array} data
         * @param equipID
         */
        this.SetData = function(data, equipID) {
            if (equipID === `Reader`) {
                const deviceGroup = data.GroupBy(data, item => item.DeviceID);
                const gradient = Object.keys(deviceGroup).map(el => statusGradient(deviceGroup[el]));
                this.Gradient = this.Select(`.colorGradient`);
                const children = statusGradient(data);
                this.Gradient.innerHTML = children.innerHTML;
                this.Select(`.timeStep`).innerHTML = timeScale.reduce((acc, item) => {
                    return acc + `<div class="step">${item}</div>`
                }, ``);
            }

            // const pieData = hourData => {
            //     const labels = Array.from(hourData.reduce((acc, item) => {
            //         acc.add(item.label);
            //         return acc;
            //     }, new Set));
            //     return labels.reduce((acc, item) => {
            //         return ({...acc, [item]: data.filter(el => el.label === item).length});
            //     },{});
            // };
            // const pieColor = Array.from(data.reduce((acc, item) => {
            //     acc.add(item.color);
            //     return acc;
            // }, new Set()));
            //
            // this._ActivityStats.Series[0].Labels.Data = Object.keys(pieData(data));
            // this._ActivityStats.Series[0].Data = Object.values(pieData(data));
            // this._ActivityStats.Series[0].Colors = pieColor;
            // this._ActivityStats.Redraw();

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
        // this._ActivityStats = new Lure.Chart({
        //         Target: this.Select(`.chart`),
        //         Type: 'pie',
        //         Legend: {
        //             Visible: false
        //         },
        //         Series: [
        //             // {
        //             //     // Labels: {
        //             //     //     Data: Lure.Culture.MonthNames.Select(m => m + ' ' + this.Parent.CurrentYear),
        //             //     //     //Data: ["Январь 2018", "Февраль 2018", "Март 2018", "Апрель 2018", "Май 2018", "Июнь 2018", "Июль 2018", "Август 2018", "Сентябрь 2018", "Октябрь 2018", "Ноябрь 2018", "Декабрь 2018"],
        //             //     // },
        //             //     Data: [5, 2, 3, 1, 4, 5, 7, 1, 2, 3, 3, 4],
        //             //     Colors: ["#6FAD81", "#7AD096", "#82E29F", "#AD776E", "#D0887D", "#E29284", "#ADA66E", "#D0C98A", "#E2D984", "#7DB0D0", "#85C2E2", "#8ACBF4"],
        //             //     // Type: 'ring',
        //             //     Width: 32,
        //             //     AngleStart: -90,
        //             // },
        //             {
        //                 Labels: {
        //                     Data: ["I Квартал 2018", "II Квартал 2018", "III Квартал 2018", "IV Квартал 2018"],
        //                 },
        //                 Data: [10, 10, 10, 10],
        //                 Colors: ["#61A878", "#A56C60", "#9E9960", "#608AAB"],
        //                 // Type: 'ring',
        //                 // Width: 200,
        //                 AngleStart: 0,
        //             }
        //         ],
        // });
    }
});

window.Monitoring = Monitoring;
module.exports = Monitoring;
