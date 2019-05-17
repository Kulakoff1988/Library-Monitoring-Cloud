const   Buttons = require('../../../Aggregations/EquipStats');

LegendName = n => {
    const text_forms = ['считываение', 'считывания', 'считываний'];
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return text_forms[2];
    if (n1 > 1 && n1 < 5) return text_forms[1];
    if (n1 === 1) return text_forms[0];
    return text_forms[2];
};

const Chart = new Lure.Content({
    Name: `Chart`,
    Target:`.equipDashboard`,
    Type: `info`,
    // Visible: true,
    Control: {
        Target: `#stats`
    },
    Content:    `<div class="stats">
                    <div class="forButtons">
                         <div class="featuresButtons">
                            <div class="equipName">{{Name}}</div>
                            <div class="f-buttons">
                            {{#each CurrentButtons}}
                                <div class="f-button l-button">{{$this}}</div>
                            {{#endeach}}
                            </div>
                         </div>
                    </div>
                    <div class="chart"></div>
                </div>`,

    State: {
        Name: `Выберите модуль`,
        CurrentButtons: [],
    },

    AfterBuild () {
        this.chart = new Lure.Chart({
            Target: this.Select(`.chart`),
            Type: 'Bar',
            Legend: {Visible: true},
            Grid: {Visible: true},
            AxisX: {
                Visible: true,
                Data: []
            },
            // AxisY: {
            //   Step: 1
            // },
            Series: [{
                Name: 'Количество считываний меток',
                Color: '#798D00',
                Data: [],
            }],
            Tooltip: {
                Format: Tip => {
                    return `<div class="tip">
                        <div class="tip-bg"></div>
                        <div class="tip-value">
                            <div class="l-row">
                                <div class="tip-icon" style="background-color: ${Tip.Episode.Color}"></div>
                                <div class="l-row">${Tip.ValueX}: ${Tip.ValueY} ${LegendName(Tip.ValueY)} меток</div>
                            </div>
                        </div>
                    </div>`
                }
            }
        });
    },

    Methods () {
        this.SetData = function (data = [], axisXData = []) {
            this.chart.Options.Series[0].Data = data;
            this.chart.Options.Series[0].AxisX.Data = axisXData;
            this.chart.Options.AxisX.Data = axisXData;
            this.chart.Redraw();
        };

        this.ViewStatus = function (equipInfo) {
            this.State.Name = `${equipInfo.Name}:`;
            this.State.CurrentButtons = Buttons.find(el => el.id === equipInfo.ID) ? Buttons.find(el => el.id === equipInfo.ID).value : this.State.CurrentButtons;
            this.Proto.Refresh();
            this.Buttons = this.SelectAll(`.f-button`);
            for (let button of this.Buttons) {
                button.dataset[`id`] = equipInfo.ID;
            }
        }
    }
});

window.Chart = Chart;
module.exports = Chart;