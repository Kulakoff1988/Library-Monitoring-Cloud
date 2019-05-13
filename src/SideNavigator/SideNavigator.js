const   Buttons = require('./../Data/Buttons'),
        { uniqueId } = require('lodash'),
        typeDict = {
            Lib: 0,
            Reader: 1,
            GTS: 2,
            SSS: 3,
            SRC: 4,
            SBX: 5,
            SmartShelf: 6
        },
        getObjectStats = string => {
            return string.split(', ');
        },

        addBranch = (tree, parentId) => {
            const id = uniqueId();
            return tree.reduce((acc, item) => {
                return acc +    `<div class="card">
                                   <div class="card-header" id="${item.ID}">
                                        <button class="btn" type="button" data-toggle="collapse" data-objectdata="${item.Name}, ${item.ID}, 1" data-target="#${item.Title}${id}" aria-expanded="true" aria-controls="${item.Title}${id}">
                                            <span>${item.Name}</span>
                                        </button>
                                   </div>
                                   ${item.Children ? `<div id="${item.Title}${id}" class="collapse" aria-labelledby="${item.ID}" data-parent="#${parentId}">
                                                          <div class="card-body">
                                                             ${addBranch(item.Children, `${item.Title}${id}`)}
                                                          </div>
                                                        </div>` : ``}
                                </div>`}, ``);
        };

const SideNavigator = new Lure.Content ({
    Name: `SideNavigator`,
    Target: `.body`,
    Content:    `<div id="sideNavigator">
                    <div class="accordion" id="accordion"></div>
                </div>`,

    GetSet: {
        get Tree() {
            return this.State.Tree;
        },
        set Tree(tree) {
            this.State.Tree = tree;
            this.Content.innerHTML = addBranch(tree);
            this._TreeHandler();
        }
    },

    State: {
        Tree: Buttons,
        Date: [Lure.Date(new Date).Format(`DD.MM.YYYY`)],
        DataExist: void 0
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
        this.TargetForMenu = this.Select(`.accordion`);
        // this.Load.Show();
        // api.Devisces_Get(-1, -1, {
        //     Then: res => {
        //         this.TargetForMenu.innerHTML = addBranch(res, `accordion`);;
        //     }
        // });
        this.TargetForMenu.innerHTML = addBranch(this.State.Tree, `accordion`);

        this.AddEventListener(`click`, `.btn`, (e) => {
            const currentButton = e.currentTarget;
            const status = {
                equipName: getObjectStats(currentButton.dataset[`objectdata`])[0],
                equipStatus: getObjectStats(currentButton.dataset[`objectdata`])[1],
                equipID: getObjectStats(currentButton.dataset[`objectdata`])[1]
            };
            this.GetEquipStatus(status);
            const hasChildren = !!currentButton.parentNode.dataset[`children`];
            const deviceID = hasChildren ? -1 : status.equipID;
            const typeID = hasChildren ? typeDict[status.equipID] : -1;
            // api.Devisces_Data_Get(deviceID, typeID, {
            //     Then: res => {
            //         const currentDate = this.State.Date[0];
            //         const filteredDate = res.filter(el => Lure.Date(el.DateValue).Format(`DD.MM.YYYY`) === currentDate);
            //         this.State.DataExist = filteredDate.length > 0 ? `exist` : `no data`;
            //         const result = [];
            //         switch (this.State.DataExist) {
            //             case `exist`:
            //                 filteredDate.map(el => {
            //                     el.DateValue = Lure.Date(el.DateValue).Format(`DD.MM.YYYY`);
            //                     if (el.Err_Count === 0) {
            //                         el.status = `noErrors`;
            //                         el.label = `Работает без ошибок`;
            //                         el.color = `#00FF43`;
            //                         return;
            //                     }
            //                     if (el.OK_Count === 0) {
            //                         el.status = `noSuccess`;
            //                         el.label = `Не работает`;
            //                         el.color = `#FF2300`;
            //                         return;
            //                     }
            //                     if (el.OK_Count > el.Err_Count) {
            //                         el.status = `moreSuccess`;
            //                         el.label = `Есть ошибки`;
            //                         el.color = `#30BE56`;
            //                         return;
            //                     }
            //                     if (el.OK_Count < el.Err_Count) {
            //                         el.status = `moreErrors`;
            //                         el.label = `Требует отладки`;
            //                         el.color = `#FF9500`;
            //                     }
            //                 });
            //                 for (let i = 0; i < 24; i++) {
            //                     if (filteredDate.find(el => el.HourValue === i)) {
            //                         const currentData = filteredDate.find(el => el.HourValue === i);
            //                         result.push(currentData);
            //                     }
            //                     else {
            //                         result.push({status: `inactive`, label: `Не активно`, color: `#4D4D4D`});
            //                     }
            //                 }
            //                 Monitoring.SetData(result, status.equipID);
            //                 Chart.SetData(result);
            //                 break;
            //             case `no data`:
            //                 Monitoring.Proto.SetProperty(`InfoMessage`, `За выбранный период нет данных, либо устройство было неактивно`);
            //                 break;
            //         }
            //     }
            // });
        });
    }
});

window.SideNavigator = SideNavigator;
module.exports = SideNavigator;