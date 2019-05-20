const getObjectStats = string => {
          return string.split(', ');
      },
      addBranch = (tree, parentId = `accordion`) => {
          return tree.reduce((acc, item) => {
              return acc +    `<div class="card">
                                     <div class="card-header" id="${item.ID}">
                                          <button class="btn" type="button" data-toggle="collapse" data-objectdata="${item.Name}, ${item.ID}, ${!!item.Children}" data-target="#${item.Title}${item.ID}" aria-expanded="true" aria-controls="${item.Title}${item.ID}">
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

const Nav = new Lure.Content ({
    Name: `Nav`,
    Target: `.body`,
    Content:    `<div class="nav">
                    <div class="accordion" id="accordion">{{Tree}}</div>
                </div>`,

    // ControllerConfig: {
    //     Target: '.tree',
    //     Type: 'TreeBuilder',
    //     SubSelector: '.card-body',
    //     ListElement: `<div>
    //                     <div><div class="card-body"></div></div>
    //
    //                   </div>`
    // },

    GetSet: {
        get Tree() {
            return this.State.Tree;
        },
        set Tree(tree) {
            this.State.Tree = tree;
            this.Proto.Refresh();
        }
    },

    State: {
        Tree: []
    },

    PropFormat: {
        Tree: tree => {
            return addBranch(tree);
        }
    },

    Methods() {
        this._InitTree = function () {
            this.Load.Show();
            api.Devices_Get(-1, -1)
                .then(res => {
                    this.Tree = res;
                    this.Load.Hide();
                });
        };
        this.OnClick = function (e) {
            const currentButton = e.currentTarget;
            if (this.currentButtonMemo === currentButton)
                return;
            this.currentButtonMemo = currentButton;
            const objectData = getObjectStats(currentButton.dataset[`objectdata`]);
            const equipDescription = {
                Name: objectData[0],
                ID: objectData[1],
                HasChildren: objectData[2]
            };
            Report.Run(equipDescription);
        }
    },

    LoadTarget: ``,

    AfterBuild() {
        this._InitTree();

        this.AddEventListener(`click`, `.btn`, (e) => {
            this.OnClick(e);
        });
    }
});

window.SideNavigator = Nav;
module.exports = Nav;