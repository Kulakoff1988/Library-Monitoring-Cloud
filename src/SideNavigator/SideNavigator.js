const   Buttons = require('./../Data/Buttons'),
        { uniqueId } = require('lodash'),
        statusPaths = {
            connected: "./img/icon-connected.png",
            attention: "./img/icon-attention.png",
            stop: "./img/icon-stop.png"
        },
        statusDictionary = {
            1: statusPaths.connected,
            2: statusPaths.attention,
            3: statusPaths.stop
        },
        imgPaths = {
            Hide: `./img/icon-dropDownBorder.png`,
            Show: `./img/icon-dropDownBorderWhite.png`
        },
        typeDict = {
            Lib: 0,
            Reader: 1,
            GTS: 2,
            SSS: 3,
            SRC: 4,
            SBX: 5,
            SmartShelf: 6
        },
        objectStats = string => {
            return string.split(', ');
        },

// addBranch = tree => {
//     if (!tree) return ``;
//     return tree.reduce((acc, item) => {
//         return acc + `<div class="containerForChecking" ${item.Children ? `data-children="true"` : ``}>
//                         <div class="forLabel l-button" data-objectdata="${item.Name}, ${item.ID}">
//                             <div class="status" data-status="1">
//                                <img src=${statusPaths.connected}>
//                             </div>
//                             <div class="flex-100 desktop">${item.Name}</div>
//                             <div class="flex-100 tab">${item.Title}</div>
//                             <div class="hideImg">
//                                ${item.Children ? `<img src=${imgPaths.Hide} data-type="1" class="hide">` : ``}
//                             </div>
//                         </div>
//                      <div class="nextCheckbox hidden" style="padding-left: 10px">${addBranch(item.Children)}</div>
//                      </div>`}, ``);
// };

        addBranch = (tree, parentId) => {
            const id = uniqueId();
            if (!tree) return ``;
            return tree.reduce((acc, item) => {
                return acc +    `<div class="card">
                                   <div class="card-header" id="${item.ID}">
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#${item.Title}${id}" aria-expanded="true" aria-controls="${item.Title}${id}">
                                      ${item.Name}
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

        this.show = function () {
            console.log(`pass`);
        }
    },

    LoadTarget: ``,


    AfterBuild() {
        // this.Load.Show();
        // api.Devisces_Get(-1, -1, {
        //     Then: res => {
        //         this.Content.innerHTML = addBranch(res);
        //     }
        // });
        this.TargetForMenu = this.Select(`.accordion`);
        this.TargetForMenu.innerHTML = addBranch(Buttons, `accordion`);

            this.AddEventListener(`click`, `.btn`, (e) => {
            const currentButton = e.currentTarget;
            // const handlerIcon = this._ShowLevelIcon(currentButton);
            // if (handlerIcon) {
            //     handlerIcon.classList.toggle(`show`);
            //     handlerIcon.classList.toggle(`hide`);
            // }
            // const toggleElements = currentButton.parentNode.querySelector(`.nextCheckbox`);
            // const siblingToHide = currentButton.parentNode.parentNode.children;
            // for (let sibling of siblingToHide) {
            //     const siblingIcon = this._ShowLevelIcon(sibling);
            //     if (sibling.querySelector(`.l-button`) !== currentButton && sibling.dataset[`children`] && siblingIcon.dataset[`type`] === `2`) {
            //         sibling.querySelector(`.nextCheckbox`).classList.remove(`visible`);
            //         siblingIcon.dataset[`type`] = `1`;
            //         siblingIcon.src = imgPaths.Hide;
            //         siblingIcon.classList.toggle(`show`);
            //         siblingIcon.classList.toggle(`hide`);
            //     }
            // }
            // if (handlerIcon) {
            //     if (handlerIcon.dataset[`type`] === `1`) {
            //         handlerIcon.dataset[`type`] = 2;
            //         handlerIcon.src = imgPaths.Show;
            //         currentButton.classList.add(`showColorParent`);
            //         toggleElements.classList.add(`visible`);
            //         for (let child of toggleElements.children) {
            //             child.querySelector(`.forLabel`).classList.add(`showColorChildren`);
            //         }
            //         for (let sibling of siblingToHide) {
            //             if (sibling.parentNode !== this.Content) {
            //                 sibling.querySelector(`.forLabel`).classList.add(`showColorParent`);
            //             }
            //         }
            //     }
            //     else {
            //         handlerIcon.dataset[`type`] = 1;
            //         handlerIcon.src = imgPaths.Hide;
            //         for (let sibling of siblingToHide) {
            //             sibling.querySelector(`.forLabel`).classList.remove(`showColorParent`);
            //         }
            //         for (let child of toggleElements.children) {
            //             child.classList.remove(`showColorChildren`);
            //         }
            //         toggleElements.classList.remove(`visible`);
            //     }
            // }
            //
            // currentButton.classList.add(`chosen`);
            // const otherButtons = this.SelectAll(`.l-button`);
            // for (let otherButton of otherButtons) {
            //     if (otherButton !== currentButton) {
            //         otherButton.classList.remove(`chosen`);
            //     }
            // }
            //
            // const status = {
            //     equipName: objectStats(currentButton.dataset[`objectdata`])[0],
            //     equipStatus: statusDictionary[currentButton.querySelector(`.status`).dataset[`status`]],
            //     equipID: objectStats(currentButton.dataset[`objectdata`])[1]
            // };

        //     this.GetEquipStatus(status);
        //     const hasChildren = !!currentButton.parentNode.dataset[`children`];
        //     const deviceID = hasChildren ? -1 : status.equipID;
        //     const typeID = hasChildren ? typeDict[status.equipID] : -1;
        //     api.Devisces_Data_Get(deviceID, typeID, {
        //         Then: res => {
        //             const currentDate = this.State.Date[0];
        //             const filteredDate = res.filter(el => Lure.Date(el.DateValue).Format(`DD.MM.YYYY`) === currentDate);
        //             this.State.DataExist = filteredDate.length > 0 ? `exist` : `no data`;
        //             const result = [];
        //             switch (this.State.DataExist) {
        //                 case `exist`:
        //                     filteredDate.map(el => {
        //                         el.DateValue = Lure.Date(el.DateValue).Format(`DD.MM.YYYY`);
        //                         if (el.Err_Count === 0) {
        //                             el.status = `noErrors`;
        //                             el.label = `Работает без ошибок`;
        //                             el.color = `#00FF43`;
        //                             return;
        //                         }
        //                         if (el.OK_Count === 0) {
        //                             el.status = `noSuccess`;
        //                             el.label = `Не работает`;
        //                             el.color = `#FF2300`;
        //                             return;
        //                         }
        //                         if (el.OK_Count > el.Err_Count) {
        //                             el.status = `moreSuccess`;
        //                             el.label = `Есть ошибки`;
        //                             el.color = `#30BE56`;
        //                             return;
        //                         }
        //                         if (el.OK_Count < el.Err_Count) {
        //                             el.status = `moreErrors`;
        //                             el.label = `Требует отладки`;
        //                             el.color = `#FF9500`;
        //                         }
        //                     });
        //                     for (let i = 0; i < 24; i++) {
        //                         if (filteredDate.find(el => el.HourValue === i)) {
        //                             const currentData = filteredDate.find(el => el.HourValue === i);
        //                             result.push(currentData);
        //                         }
        //                         else {
        //                             result.push({status: `inactive`, label: `Не активно`, color: `#4D4D4D`});
        //                         }
        //                     }
        //                     Monitoring.SetData(result, status.equipID);
        //                     Chart.SetData(result);
        //                     break;
        //                 case `no data`:
        //                     Monitoring.Proto.SetProperty(`InfoMessage`, `За выбранный период нет данных, либо устройство было неактивно`);
        //                     break;
        //             }
        //         }
        //     });
        });
    }
});

window.SideNavigator = SideNavigator;
module.exports = SideNavigator;