const   typeDict = {
            Lib: 0,
            Reader: 1,
            Gates: 2,
            SSS: 3,
            SRS: 4,
            SBX: 5,
            SmartShelf: 6
        },
        getObjectStats = string => {
            return string.split(', ');
        },

        addBranch = (tree, parentId = `accordion`) => {
            return tree.reduce((acc, item) => {
                return acc +    `<div class="card">
                                   <div class="card-header" id="${item.ID}">
                                        <button class="btn" type="button" data-toggle="collapse" data-haschildren="${!!item.Children}" data-objectdata="${item.Name}, ${item.ID}" data-target="#${item.Title}${item.ID}" aria-expanded="true" aria-controls="${item.Title}${item.ID}">
                                            <span>${item.Name}</span>
                                        </button>
                                   </div>
                                   ${item.Children ? `<div id="${item.Title}${item.ID}" class="collapse" aria-labelledby="${item.ID}" data-parent="#${parentId}">
                                                          <div class="card-body">
                                                             ${addBranch(item.Children, `${item.Title}${item.ID}`)}
                                                          </div>
                                                        </div>` : ``}
                                </div>`}, ``);
        };

const SideNavigator = new Lure.Content ({
    Name: `SideNavigator`,
    Target: `.body`,
    Content:    `<div id="sideNavigator">
                    <div class="accordion" id="accordion">{{Tree}}</div>
                </div>`,

    GetSet: {
        get Tree() {
            return this.State.Tree;
        },
        set Tree(tree) {
            this.State.Tree = tree;
            this.Proto.Refresh();
        },
        set Date(date) {
            this.State.Date = date;
        }
    },

    State: {
        Tree: [],
        Date: [Lure.Date(new Date).Format(`DD.MM.YYYY`)],
        DataExist: void 0
    },

    PropFormat: {
        Tree: tree => {
            return addBranch(tree);
        }
    },

    Methods() {
        this._ShowLevelIcon = parent => {
            return parent.querySelector(`.hideImg`).querySelector(`img`);
        };

        this.GetEquipStatus = function (status) {
            DataDash.ViewStatus(status);
            Chart.ViewStatus(status);
        };
    },

    LoadTarget: ``,

    AfterBuild() {
        this.Load.Show();
        api.Devisces_Get(-1, -1)
            .then(res => {
                this.Tree = res;
                this.Load.Hide();
        });

        this.AddEventListener(`click`, `.btn`, (e) => {
            const currentButton = e.currentTarget;
            if (this.currentButtonMemo === currentButton) return;
            const objectData = getObjectStats(currentButton.dataset[`objectdata`]);
            const equipDescription = {
                Name: objectData[0],
                ID: objectData[1]
            };
            this.GetEquipStatus(equipDescription);
            const hasChildren = currentButton.dataset[`haschildren`] === `true`;
            const deviceID = hasChildren ? -1 : equipDescription.ID;
            const typeID = hasChildren ? typeDict[equipDescription.ID] : -1;
            api.Devisces_Data_Get(deviceID, typeID, {
                Then: res => {
                    const Date = this.State.Date[0];
                    const filteredByDate = res.filter(el => Lure.Date(el.DateValue).Format(`DD.MM.YYYY`) === Date);
                    this.State.DataExist = filteredByDate.length > 0 ? `exist` : `no data`;
                    const result = [];
                    switch (this.State.DataExist) {
                        case `exist`:
                            filteredByDate.map(el => {
                                el.DateValue = Lure.Date(el.DateValue).Format(`DD.MM.YYYY`);
                                if (el.Err_Count === 0) {
                                    el.Status = `noErrors`;
                                    el.label = `Работает без ошибок`;
                                    el.color = `#00FF43`;
                                    return;
                                }
                                if (el.OK_Count === 0) {
                                    el.Status = `noSuccess`;
                                    el.label = `Не работает`;
                                    el.color = `#FF2300`;
                                    return;
                                }
                                if (el.OK_Count > el.Err_Count) {
                                    el.Status = `moreSuccess`;
                                    el.label = `Есть ошибки`;
                                    el.color = `#30BE56`;
                                    return;
                                }
                                if (el.OK_Count < el.Err_Count) {
                                    el.Status = `moreErrors`;
                                    el.label = `Требует отладки`;
                                    el.color = `#FF9500`;
                                }
                            });
                            for (let i = 0; i < 24; i++) {
                                if (filteredByDate.find(el => el.HourValue === i)) {
                                    const currentData = filteredByDate.find(el => el.HourValue === i);
                                    result.push(currentData);
                                }
                                else {
                                    result.push({Status: `inactive`, label: `Не активно`, color: `#4D4D4D`});
                                }
                            }
                            Monitoring.SetData(result);
                            Chart.SetData(result);
                            break;
                        case `no data`:
                            Monitoring.Proto.SetProperty(`InfoMessage`, `За выбранный период нет данных, либо устройство было неактивно`);
                            Chart.SetData([]);
                            break;
                    }
                }
            });
            this.currentButtonMemo = currentButton;
        });
    }
});

window.SideNavigator = SideNavigator;
module.exports = SideNavigator;