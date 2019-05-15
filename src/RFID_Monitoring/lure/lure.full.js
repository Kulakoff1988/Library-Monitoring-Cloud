//
// Lure Framework v0.29.7 [27.12.2017]
//

/* Date Format */
Date.prototype.Format = function (format, isBandMonthNames) {
   // console.warn('Deprecation warning.', 'This method will be killed on release. Use Lure.Date().Format');
    return Lure.Date.Format(this, format, isBandMonthNames);
};


/* Micro LINQ */

Array.prototype.Select = function (delegate) {
    let a = [];
    for (let i = 0; i < this.length; i++){
        if (typeof delegate === 'string')
            a.push((this[i][delegate]));
        else
            a.push(delegate(this[i], i));
    }
    return a;
};

Array.prototype.ToDictionary = function (delegateKey, delegateValue = x=>x) {
    let dict = {};
    for (let i = 0; i < this.length; i++){
        dict[delegateKey(this[i], i)] = delegateValue(this[i], i);
    }
    return dict;
};

Array.prototype.Where = function (delegate) {
    let a = [];
    for (let i = 0; i < this.length; i++){
        if (delegate(this[i], i))
            a.push(this[i]);
    }
    return a;
};

Array.prototype.FirstOrDefault = function (Default) {
    for (let i = 0; i < this.length; i++){
        if (this[i] !== null && this[i] !== void 0)
            return this[i];
    }
    return Default === void 0 ?  null : Default;
};

Array.prototype.LastOrDefault = function (Default) {
    for (let i = this.length -1; i >= 0; i--){
        if (this[i] !== null && this[i] !== void 0 )
            return this[i];
    }
    return Default === void 0 ?  null : Default;
};
Array.prototype.First = function () {
    return this[0];
};
Array.prototype.Last = function () {
    return this[this.length-1];
};
Array.prototype.ToList = function () {
    let a = [];
    for (let i = 0; i < this.length; i++){
        a.push(this[i]);
    }
    return a;
};
Array.prototype.Sort = function (delegate,...args) {
    for (let i = 0; i < args.length; i++){

    }

    return this;
};

Array.prototype.Contains = function(Value){
    return this.indexOf(Value) > -1;
};

// Array.prototype.GroupBy = function(key) {
//     let xx =  this.reduce(function(rv, x) {
//         (rv[x[key]] = rv[x[key]] || []).push(x);
//         return rv;
//     }, {});
//     let g = [];
//     for (let k in xx){
//         if (xx.hasOwnProperty(k) ){
//             xx[k].Key = k;
//             g.push(xx[k]);
//         }
//     }
//     return g;
// };
Array.prototype.GroupBy = function (keyGetter) {
    return Lure.Array.GroupBy(this, keyGetter);
};





NodeList.prototype.Select = Array.prototype.Select;
NodeList.prototype.Where = Array.prototype.Where;
NodeList.prototype.ToDictionary = Array.prototype.ToDictionary;
NodeList.prototype.ToList = Array.prototype.ToList;

HTMLCollection.prototype.Select = Array.prototype.Select;
HTMLCollection.prototype.Where = Array.prototype.Where;
HTMLCollection.prototype.ToDictionary = Array.prototype.ToDictionary;
HTMLCollection.prototype.ToList = Array.prototype.ToList;


//</utils>

/**
 * @typedef {object} ApiCallHandlers
 * @property {ApiCallCallback} [Then]
 * @property {ApiCallCallback} [Catch]
 * @property {ApiCallCallback} [Finally]
 */
/**
 * @callback ApiCallCallback
 * @param {T} x
 * @template T
 * @returns {Promise<T>}
 */
/** @typedef {number} Double */
/** @typedef {number} Float */

const Lure = {
    get Version(){
        return 'v2.1.17'
    },


    Plugin: {
        Regis5ter: function (PluginName, object, PluginEndPoint, RegistratorDelegate = function(){}) {
            if (typeof this[PluginName] !== 'undefined' && PluginName === 'Register'){
                return this.System.ShowError(`[Lure] Plugin name "${PluginName}" is not allowed.`);
            }
            this.Plugin[PluginName] = object;
            if (PluginEndPoint)
                this[PluginName] = this.Plugin[PluginName][PluginEndPoint];
            else
                this[PluginName] = this.Plugin[PluginName];
            RegistratorDelegate.call(this);
        }.bind(this)
    },

    System: {
        Error(Text, err){
            console.warn('[deprecation] use Lure.Pop.* instead');
            Lure.Pop.Error(Text, err);
        },
        Warn(Text){
            console.warn('[deprecation] use Lure.Pop.* instead');
            Lure.Pop.Warn(Text);
        },
        Success(Text){
            console.warn('[deprecation] use Lure.Pop.* instead');
            Lure.Pop.ShowSuccess(Text);
        },
        Notice(Text, TextLog){
            console.warn('[deprecation] use Lure.Pop.* instead');
            Lure.Pop.Notice(Text, TextLog);
        },
        ShowError: function (text) {
            console.warn('[deprecation] use Lure.Pop.* instead');
            Lure.Pop.Error(text);
        },
        ShowWarn: function (text) {
            console.warn('[deprecation] use Lure.Pop.* instead');
            Lure.Pop.Warn(text);
        },

        ShowSuccess: function (text) {
            console.warn('[deprecation] use Lure.Pop.* instead');
            Lure.Pop.ShowSuccess(text);
        },
        ShowNotice: function (text) {
            console.warn('[deprecation] use Lure.Pop.* instead');
            Lure.Pop.ShowNotice(text);
        }
    },

    Diagnostics: {
        /** @namespace window.performance */
        Perf: class LurePerformance{
            /**
             *
             * @param Name
             * @returns {*}
             * @constructor
             */
            Elapsed(Name = 'Perf') {
                if (!this.Enabled)
                    return 0;
                this.Stepped = window.performance.now();        //istantly save
                let v = (this.Stepped - this.Started).toFixed(2);
                console.info(`[${Name}]: ${ v }ms`);

                return v;
            }

            /**
             *
             * @param Name
             * @returns {number}
             * @constructor
             */
            Perf(Name = 'Perf', isDraw=true) {
                let step = window.performance.now();
                if (!this.Enabled)
                    return 0;
                let SpaceCount = 40-Name.length;
                let v = (step - this.Stepped).toFixed(4);
                if (isDraw)
                    console.info(`%c[${Name}]:${' '.repeat(SpaceCount>0? SpaceCount: 1)} ${v}ms`, 'color: #3583a7');

                this.Stepped = window.performance.now();
                return v;
            }

            /**
             *
             * @returns {number}
             * @constructor
             */
            Reset() {
                this.Started = performance.now();
                this.Stepped = this.Started;
                return 0;
            }

            /**
             *
             * @param {boolean} Enabled
             */
            constructor(Enabled = true){
                this.Started = performance.now();
                this.Stepped = this.Started;
                this.Enabled = Enabled;
            }
        }
    },
    /* Controllers (Template builders) */
    Controller: {
        TreeBuilder: class TreeBuilder{
            constructor(
                {
                    Target = null,                          //{string, HTMLElement}
                    Data = [],
                    ListElement = null,
                    Drop = false,                       //{bool}   - horisontal menu with drop down subtrees;
                    SubSelector = null,                 //{string} - cssselector of element, where put branches
                    SubSelectorHandler = function(){},  //{function} - click handle on SubSelector Element (hide/show branch for exaple)

                    BeforeBuild = function(){},
                    AfterBuild = function(){},

                    Owner = null               //Lure.Content, which owns this Controller
                }
            )
            {
                //### DEFINES
                this.isController = true;
                this.Content = Owner ? Owner.Select(Target) : Lure.Select(Target);
                this.Target = this.Content;
                this.Owner = Owner;
                this._Data = Data;
                this.SubSelector = SubSelector;
                this.SubSelectorHandler = SubSelectorHandler.bind(this.Owner? this.Owner : this);
                this.BeforeBuild = BeforeBuild.bind(this.Owner? this.Owner : this);
                this.AfterBuild = AfterBuild.bind(this.Owner? this.Owner : this);
                let SubTreeClass = Drop ? 'mtb-sub_tree dropable':'mtb-sub_tree';
                let Lvl = 0;
                let Branch = ListElement === null ? this.Content.innerHTML : ListElement;
                if (this.SubSelector === null){
                    this.SubSelector = '.mtb-sub_tree';
                    Branch = Branch.replace(/^([\s\S]*)(<\/\w+>)$/, function (match, html, entag) {
                        entag = `<div class="${SubTreeClass}"></div>${entag}`;
                        return html+entag
                    })
                }
                this.LineBuilder = Lure.Compile(Branch, true);
                let $this = this;

                let Index = 0;          //unque serial number of branch

                let BuildElement = function(obj, key, indexJ) {
                    Index++;
                    let extra = {
                        $lvl: Lvl,
                        $key: key,
                        $index: Index,
                        $j: indexJ
                    };
                    let line = Lure.CreateElementFromString($this.LineBuilder.call($this.Owner, obj, extra));
                    line.classList.add('mtb-branch');
                    for (let key in obj)
                    {
                        if (!obj.hasOwnProperty(key))
                            continue;

                        let ObjItem = obj[key];
                        if (Array.isArray(ObjItem))
                        {
                            Lvl++;
                            for (let i = 0; i < ObjItem.length; i++)
                            {
                                if ($this.SubSelector === null)
                                {
                                    line.appendChild(  BuildElement(ObjItem[i], key, i) );
                                }
                                else
                                {
                                    line.classList.add('mtb-has_tree');
                                    if (Drop)
                                        line.classList.add('dropable');
                                    let sub = line.querySelector($this.SubSelector);
                                    sub.appendChild(  BuildElement(ObjItem[i], key, i) );
                                }
                            }
                            Lvl--;
                        }
                    }
                    return line;
                };
                let Build = function () {
                    $this.BeforeBuild();
                    if (Array.isArray($this._Data))
                    {
                        $this.Content.innerHTML = '';
                        Lvl++;
                        for (let j = 0; j < $this._Data.length; j++)
                            $this.Content.appendChild(  BuildElement($this._Data[j], "root", 0) );
                        Lvl--;
                    }
                    else{
                        $this.Content.appendChild(BuildElement($this._Data, "root", 0));
                    }
                    Lvl = 0;
                    Index = 0;
                    $this.AfterBuild();

                };

                Build(this._Data);

                //### METHODS
                this.Refresh = function (data=$this._Data) {
                    $this._Data = data;
                    Build();
                }

            }
            get Data(){
                return this._Data;
            }
            set Data(data){
                this._Data = data;
            }
        },
    },

    ///

    Settings: {
        _Locale: 'ru',
        /**
         *
         * @returns {string}
         * @constructor
         */
        get Locale(){
            return this._Locale;
        },
        set Locale(loc){
            if (Lure.CultureInfo[loc])
            {
                Lure.Culture = Lure.CultureInfo[loc];
                this._Locale = loc;
                Lure._UpdateCultureMonths();
            }
            else
            {
                Lure.System.ShowError(`[SetLocale] Error. Locale "${loc}" is unknown`)
            }
        },
        LocaleSort: 'en',
        Controller: {
            Common:{
                Undefined: '???'
            },
            Templator: {
                Pagination:{
                    PageSize:  -1,
                    DataLength:-1,
                    DataCount: -1,
                    PageGet: null,
                    isGetAllButton:  true,
                    isGetAllCount:   true,
                    isGetMoreButton: true,
                    isGetMoreCount:  true,
                    isRefreshButton: true
                },
                isDataClone: false,
                isEmptyVisible: true,
            }
        },
        Dialog: {
            Blur: 'l-blur',
            BlurTarget: '.body',
            Wrapper: 'l-dialog-wrapper'
        },
        Confirm: {
            Wrapper: 'l-dialog-wrapper-transparent'
        },
        Common: {
            CSSButtonBusy: 'l-busy'
        },
        PopLog: {
            Default:{
                AnimationDuration: 500,
                Duration: 5000,
            }
        }
    },

    CultureInfo: {
        en: {
            Lang: {
                Change: 'Change',
                Remove: 'Remove',
                GetMore: 'Get more',
                GetAll: 'Get all',
                Refresh: 'Refresh',
                YouHaveNoPermission: 'You have no permission',
                Ok: 'Ok',
                Cancel: 'Cancel',
                ListEmpty: 'list empty',
                SelectEmpty: 'Not chosen',
            },
            DateFormat: 'MM.DD.YYYY',
            DateFormatFull: 'MM.DD.YYYY HH:mm:ss',
            MonthNames: ["January", "February", "March", "April", "May", "June", "Jule", "August", "September", "October", "November", "December"],
            MonthNamesBanded: ["January", "February", "March", "April", "May", "June", "Jule", "August", "September", "October", "November", "December"],
            MonthNamesShort: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
            WeekDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            WeekDaysShort: ["mo", "tu", "we", "th", "fr", "sa", "su"],
        },
        ru: {
            Lang: {
                Change: 'Изменить',
                Remove: 'Удалить',
                GetMore: 'Загрузить еще',
                GetAll: 'Загрузить все',
                Refresh: 'Обновить',
                YouHaveNoPermission: 'Недостаточно прав',
                Ok: 'Ок',
                Cancel: 'Отмена',
                ListEmpty: 'нет элементов для отображения',
                SelectEmpty: 'Не выбрано',
            },
            DateFormat: 'DD.MM.YYYY',
            DateFormatFull: 'DD.MM.YYYY HH:mm:ss',
            MonthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            MonthNamesBanded: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
            MonthNamesShort: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
            WeekDays: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
            WeekDaysShort: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
        }
    },
    Culture: {
        Lang: {
            Change: 'Изменить',
            Remove: 'Удалить',
            GetMore: 'Загрузить еще',
            GetAll: 'Загрузить все',
            Refresh: 'Обновить',
            YouHaveNoPermission: 'Недостаточно прав',
            Ok: 'Ок',
            Cancel: 'Отмена',
            ListEmpty: 'нет элементов для отображения',
            SelectEmpty: 'Не выбрано'
        },
        DateFormat: 'DD.MM.YYYY',
        DateFormatFull: 'DD.MM.YYYY HH:mm:ss',
        MonthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        MonthNamesBanded: ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"],
        MonthNamesShort: ["янв.", "фев.", "мар.", "апр.", "май", "июн.", "июл.", "авг.", "сен.", "окт.", "ноя.", "дек."],
        WeekDays: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
        WeekDaysShort: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
    },
    _CultureDataDict: {},
    _UpdateCultureMonths: function(){
        Lure.Culture._DataDict = {};
        for (let i = 0; i < Lure.Culture.MonthNames.length; i++){
            Lure.Culture._DataDict[Lure.Culture.MonthNames[i].replace('.', '').toLowerCase()] = i;
        }
        for (let i = 0; i < Lure.Culture.MonthNamesBanded.length; i++){
            Lure.Culture._DataDict[Lure.Culture.MonthNamesBanded[i].replace('.', '').toLowerCase()] = i;
        }
        for (let i = 0; i < Lure.Culture.MonthNamesShort.length; i++){
            Lure.Culture._DataDict[Lure.Culture.MonthNamesShort[i].replace('.', '').toLowerCase()] = i;
        }
    },
    ContentList: {
        _Root: [],
        _Typed: []
    },
    _Dialog:  {
        List: [],
        Add(DOMElement){
            if (Lure._Dialog.List.indexOf(DOMElement) < 0)
                Lure._Dialog.List.push(DOMElement);
        },
        Remove(DOMElement){
            //Lure.Route.Back();
            let i = Lure._Dialog.List.indexOf(DOMElement);
            if (i > -1){
                Lure._Dialog.List.splice(i, 1);
            }
        },
        get zIndex(){
            if (Lure._Dialog.List.length < 1)
                return 10;
            return Lure._Dialog.List
                .Select(x=>parseInt(window.getComputedStyle(x).zIndex))
                .sort((a,b)=>a<b)
                .First()
        }
    },
    _DialogCount: 0,
    _ConfirmCount: 0,

    //TODO get full
    PropTypes: {
        /**
         *
         * @param obj
         * @returns {*}
         * @constructor
         */
        GetType(obj){
            if (Lure.isNumeric(obj))
                return 'number';
            if (obj instanceof Date || obj instanceof Lure._Date)
                return 'date';
            if (obj instanceof Function)
                return 'function';
            if (obj instanceof Array || obj instanceof NodeList)
                return 'array';
            if (obj instanceof Node)
                return 'node';
            if (obj instanceof Object)
                return 'object';
            if (obj === null)
                return 'null';
            return typeof (obj);
        },
        Check(PropTypes, Obj){
            for (let prop in PropTypes){
                if (!PropTypes.hasOwnProperty(prop))
                    continue;
                Lure.PropTypes.CheckProp(Obj, PropTypes[prop], prop);
            }
        },
        CheckProp(Obj, type, prop){
            Lure.SetProperty(Obj, prop, Lure.PropTypes.TryParse(type, Lure.GetProperty(Obj, prop), prop));
        },
        /**
         *
         * @param {string} PropType
         * @param {*} Val
         * @param {string} prop
         * @returns {*}
         */
        TryParse(PropType, Val, prop){
            let n;
            switch (PropType){
                case Lure.PropTypes.Number:
                    n = parseFloat(Val);
                    if (Number.isNaN(n) || !Lure.isNumeric(Val))
                    {
                        //console.warn(new TypeError(`[Lure.PropTypes] ${prop} ${Val} is not a Number`));
                        console.warn(`[Lure.PropTypes] ${prop} ${Val} is not a Number`);
                        n = 0;
                    }
                    return n;
                case Lure.PropTypes.Int:
                    n = parseInt(Val);
                    if (Number.isNaN(n)|| !Lure.isNumeric(Val))
                    {
                        //console.warn(new TypeError(`[Lure.PropTypes] ${prop} ${Val} is not Int`));
                        console.warn(`[Lure.PropTypes] ${prop} ${Val} is not Int`);
                        n = 0;
                    }
                    return n;
                case Lure.PropTypes.UInt:
                    n = parseInt(Val);
                    if (Number.isNaN(n) || n < 0 || !Lure.isNumeric(Val))
                    {
                        //console.warn(new TypeError(`[Lure.PropTypes] ${prop} ${Val} is not UInt`));
                        console.warn(`[Lure.PropTypes] ${prop} ${Val} is not UInt`);
                        n = 0;
                    }
                    return n;
                case Lure.PropTypes.Bool:
                    if (Val === 'true' || Val === 'True')
                        Val = true;
                    if (Val === 'false' || Val === 'False')
                        Val = false;
                    if (Val !== true && Val !== false){
                        console.warn(`[Lure.PropTypes] ${prop} ${Val} is not Bool`);
                        Val = false;
                    }
                    return Val;
                case Lure.PropTypes.Date:
                    return Lure.Date(Val).Date;
            }
            return Val;
        },
        Number:  'number',
        Float:   'number',
        Int:     'int',
        UInt:    'uint',
        Bool:    'boolean',
        String:  'string',
        Text:    'text',    //rich text
        Function:'function',
        Date:    'date',
        List:    'list',
        Array:   'list',
        NodeList:'list',
        Object:  'object',
    },


    Array: {
        Remove: (array, delegate)=>{
            for (let i = array.length - 1; i >= 0; --i) {
                if (delegate(array[i], i)) {
                    array.splice(i,1);
                }
            }
            return array;
        },
        GroupBy: function (list, keyGetter) {
            if (typeof keyGetter === 'string'){
                const KeyStr = keyGetter;
                keyGetter = (x)=>x[KeyStr];
                console.warn('[Deprecation] Lure.Array.GroupBy must get keyGetter function, not a key string value');
            }
            const map = new Map();
            for (let item of list) {
                let key = keyGetter(item);
                if (Array.isArray(key) || typeof key === 'object'){
                    const Keys = map.keys();
                    for (let k of Keys){
                        if (Lure.Object.CheckDirty(k, key) ) {
                            key = k;
                            break;
                        }
                    }
                }
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [item]);
                } else {
                    collection.push(item);
                }
            }
            const Grouped = [];
            const Keys = map.keys();
            for (let key of Keys){
                let v = map.get(key);
                v.Key = key;
                Grouped.push(v);
            }
            return Grouped;
        },
    },
    Object: {
        /**
         * @param {T} object
         * @template T
         * @returns T
         */
        Clone: function (Object) {
            return JSON.parse(JSON.stringify(Object));  //TODO to optimize cloning
        },
        Copy: function (ObjectCopyFrom, ObjectCopyTo) {
            for (let p in ObjectCopyFrom){
                if (ObjectCopyFrom.hasOwnProperty(p)){
                    ObjectCopyTo[p] = ObjectCopyFrom[p];
                }
            }
            return Object;
        },
        /**
         *
         * @param Obj
         * @param Prop
         * @returns {*}
         */
        GetProperty(Obj, Prop) {
            if (Prop === '')
                return Obj;
            let Way = Prop.replace(/\[([^\]]+)\]/g, '.$1'); //TODO check slash in regexp
            Way = Way.substring(0,1) === '.'? Way.substring(1):Way;
            Way = Way.split('.');
            let i = 0;
            let Dest = Obj;
            for (i; i < Way.length-1; i++){
                Dest = Dest[Way[i]];
            }
            if (Dest === void 0 || Dest === null){
                console.warn(`[Lure.Object.GetProperty] Property '${Prop}' is unreachable`, Obj, );
                return null;
            }
            return Dest[Way[i]];
        },
        SetProperty(Obj, Prop, Value) {
            if (Prop === ''){
                Obj = Value;
                return Obj;
            }
            let Way = Prop.replace(/\[([^\]]+)\]/g, '.$1');//TODO check slash in regexp
            Way = Way.substring(0,1) === '.'? Way.substring(1):Way;
            Way = Way.split('.');
            let i = 0;
            let Dest = Obj;
            for (i; i < Way.length-1; i++){
                Dest = Dest[Way[i]];
            }
            Dest[Way[i]] = Value;
            return Obj;
        },
        isEmpty(obj, isStrict = false){
            if (isStrict && typeof obj !== 'object')
                return false;
            return !(obj && Object.keys(obj).length>0);
        },

        CheckDirty: function(Obj1, Obj2, isStrict=true){
            if (!Obj1 || !Obj2)
                return false;
            let isEqual = true;
            if (Obj1 instanceof Array){
                if (isStrict && Obj1.length != Obj2.length){
                    return false;
                }
                for (let i = 0; i < Obj1.length; i++){
                    if (Obj1[i] instanceof Object){
                        isEqual = Lure.CheckDirty(Obj1[i], Obj2[i], isStrict)
                        if (!isEqual){
                            return false;
                        }
                        continue;
                    }
                    if (Obj1[i] !== Obj2[i]){
                        return false;
                    }
                }
            }
            else if (Obj1 instanceof Object){
                if (isStrict && Object.keys(Obj1).length !== Object.keys(Obj2).length)
                    return false;
                for (let i in Obj1){
                    if (Obj1[i] instanceof Object){
                        isEqual = Lure.CheckDirty(Obj1[i], Obj2[i], isStrict)
                        if (!isEqual){
                            return false;
                        }
                        continue;
                    }
                    if (Obj1[i] !== Obj2[i]){
                        return false;
                    }
                }
            }
            else {
                return Obj1 === Obj2
            }
            return isEqual;
        },
    },

    Blob: {
        SaveAs: function (Blob, FileName) {
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = window.URL.createObjectURL(Blob);
            a.download = FileName;
            a.click();
            window.URL.revokeObjectURL(a.href);
        },
        /**
         *
         * @param Blob
         * @returns {Promise<string>}
         */
        ToBase64: function (Blob) {
            return new Promise( (res, rej)=>{
                const reader = new FileReader();
                reader.readAsDataURL(Blob);
                reader.onloadend = function() {
                    res(reader.result);
                };
                reader.onerror = rej;
            })
        }
    },
    CSS: {
        /**
         *
         * @param selector
         * @returns {CSSStyleDeclaration}
         */
        GetStylesBySelector: function (selector) {
            for (let i = 0; i < document.styleSheets.length; i++){
                if(document.styleSheets[i].href){
                    let rules;
                    if (document.styleSheets[i].rules){
                        rules = document.styleSheets[i].rules; //chrome
                    }
                    else if (document.styleSheets[i].cssRules){
                        rules = document.styleSheets[i].cssRules; //firefox
                    }
                    if (!rules){
                        continue;
                    }
                    for (let j = 0; j < rules.length; j++){
                        if (rules[j].selectorText === selector)
                            return rules[j].style;
                    }
                }
            }
            return null;
        }
    },
    DOM: {
        /**
         *
         * @param {HTMLElement} DOMElement
         * @param {string} query
         * @returns {boolean}
         */
        isQuery: function (DOMElement, query) {
            if (!DOMElement || DOMElement === document)
                return false;
            DOMElement = DOMElement.cloneNode();
            const Tag = DOMElement.tagName.toLowerCase();
            let TagParent = 'div';
            if (['tr, th'].indexOf(Tag) > -1 )
                TagParent = 'tr';
            else if (Tag === 'tr')
                TagParent = 'tbody';
            else if (['tbody, thead'].indexOf(Tag) > -1)
                TagParent = 'table';

            const p = document.createElement(TagParent);
            p.appendChild(DOMElement);
            let elem = Lure.Select(query, p);

            return elem !== null;
        },
        isElement: function (obj) {
            return (typeof obj === "object") &&
                (obj.nodeType===1) &&
                (typeof obj.style === "object") &&
                (typeof obj.ownerDocument === "object");
        },
        ShowWithAnimation: function (HTMLElement, CSSAnimation) {
            let Duration = Lure.GetDurationAnimation(CSSAnimation, HTMLElement);
            HTMLElement.style.display = '';
            HTMLElement.classList.add(CSSAnimation);
            setTimeout(function () {
                HTMLElement.classList.remove(CSSAnimation);
            }, Duration)
        },
        HideWithAnimation: function (HTMLElement, CSSAnimation) {
            let Duration = Lure.GetDurationAnimation(CSSAnimation, HTMLElement);
            HTMLElement.classList.add(CSSAnimation);
            setTimeout(function () {
                HTMLElement.style.display = 'none';
                HTMLElement.classList.remove(CSSAnimation);
            }, Duration)
        },
        /**
         * @param {HTMLElement} HTMLElement
         * @returns {number}
         */
        GetLineID: function (HTMLElement) {
            return parseInt(HTMLElement.dataset['line']);
        },


        Print: function (HTMLElement, CSSPrint="") {
            let MyWindow = window.open('', 'PRINT');//, 'height=800,width=1000');
            let styles = '';
            for (let i = 0; i < document.styleSheets.length; i++){
                if(document.styleSheets[i].href){
                    let rules;
                    if (document.styleSheets[i].rules){
                        rules = document.styleSheets[i].rules; //chrome
                    }
                    else if (document.styleSheets[i].cssRules){
                        rules = document.styleSheets[i].cssRules; //firefox
                    }
                    if (!rules){
                        continue;
                    }
                    for (let j = 0; j < rules.length; j++){
                        if (rules[j].cssText.indexOf("@") < 0) //skip other @media, @key-frames
                            styles += rules[j].cssText;
                    }
                }
            }
            styles = `@media print{
                        ${styles}
                        .button-print{display:none!important}
                        ${CSSPrint}
                    }
                    @media screen{
                        ${styles}
                        .button-print{display:none!important}
                        ${CSSPrint}
                    }`;
            //console.log('styles', styles);
            MyWindow.document.write('<html><head><title>' + document.title  + '</title>');

            MyWindow.document.write(`<style>${styles}</style>`);
            MyWindow.document.write('</head><body>');
            MyWindow.document.write(HTMLElement.innerHTML);
            MyWindow.document.write('</body></html>');

            MyWindow.document.close(); // necessary for IE >= 10
            MyWindow.focus(); // necessary for IE >= 10*/

            MyWindow.print();
            MyWindow.close();
        },



        Swap: function(Element1, Element2){
            const t = Element1.parentNode.insertBefore(document.createTextNode(''), Element1);
            Element2.parentNode.insertBefore(Element1, Element2);
            t.parentNode.insertBefore(Element2, t);
            t.parentNode.removeChild(t);
        },
        /**
         * @param {string} string
         * @param {string} ownerTagName
         * @return {HTMLElement}
         */
        CreateElementFromString: function(string, ownerTagName = "div"){
            let frag = document.createDocumentFragment();
            let elem = document.createElement(ownerTagName);
            elem.innerHTML = string;
            while (elem.childNodes[0]) {
                frag.appendChild(elem.childNodes[0]);
            }
            return frag.childNodes.Where(x=>x.nodeName.indexOf('text') < 0).First();
        },

        /**
         * @param {string} string
         * @param {string} ownerTagName
         * @return {Array}
         */
        CreateElementsFromString: function(string, ownerTagName = "div"){
            let frag = document.createDocumentFragment();
            let elem = document.createElement(ownerTagName);
            elem.innerHTML = string;
            while (elem.childNodes[0]) {
                frag.appendChild(elem.childNodes[0]);
            }
            if (frag.childNodes.length > 0)
            {
                let nodes = [];
                for (let i = 0; i < frag.childNodes.length; i++)
                    nodes.push(frag.childNodes[i]);
                return nodes.Where(x=>x.nodeName.indexOf('text') < 0);
            }
            return null;
        },


        /**
         * @param {HTMLElement} Child
         * @param {HTMLElement} Ancestor
         */
        isDescendant: function (Child, Ancestor) {
            if (Child.isSameNode(Ancestor))
                return true;
            let ParentCursor = Child;
            while (ParentCursor){
                if (ParentCursor.isSameNode(Ancestor))
                    return true;
                ParentCursor = ParentCursor.parentElement;
            }
            return false;
        },
        /**
         * @param {HTMLElement} element
         * @param {string} query
         * @return {?HTMLElement} query
         */
        Closest: function (element, query) {
            let ElementCursor = element;
            while (ElementCursor){
                if (Lure.DOM.isQuery(ElementCursor, query))
                    return ElementCursor;
                ElementCursor = ElementCursor.parentElement;
            }
            return null;
        }





    },
    String: {
        _KeyBD: {
            En:[
                'q','w','e','r','t','y','u','i','o','p','[',']',
                'a','s','d','f','g','h','j','k','l',';','\'',
                'z','x','c','v','b','n','m',',','.','/',

                'Q','W','E','R','T','Y','U','I','O','P','{','}',
                'A','S','D','F','G','H','J','K','L',':','"','|',
                'Z','X','C','V','B','N','M','<','>','?'
            ],
            Ru:[
                'й','ц','у','к','е','н','г','ш','щ','з','х','ъ',
                'ф','ы','в','а','п','р','о','л','д','ж','э',
                'я','ч','с','м','и','т','ь','б','ю','.',

                'Й','Ц','У','К','Е','Н','Г','Ш','Щ','З','Х','Ъ',
                'Ф','Ы','В','А','П','Р','О','Л','Д','Ж','Э', '/',
                'Я','Ч','С','М','И','Т','Ь','Б','Ю',','
            ]
        },
        /**
         * @param string
         * @returns {string}
         */
        Capitalize(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        /**
         * @param {string} string
         * @param {string} part
         * @param {boolean} isIgnoreCase
         * @return {boolean}
         */
        Contains(string, part, isIgnoreCase = false){
            return (isIgnoreCase && string.toLowerCase().indexOf(part.toLowerCase()) > -1) || (string.indexOf(part) > -1)
        },
        /**
         *
         * @param string
         * @param isHTML
         * @returns {*}
         */
        QuoteScreen(string, isHTML=false){
            if (typeof string !== 'string')
                return string;
            if (isHTML)
                return string.replace(/"/g, '&quot;');
            else
                return string.replace(/"/g, '\"');
        },
        ReplaceAsync(string, regExp, callback) {
            string = String(string);
            let parts = [],
                i = 0;
            if (Object.prototype.toString.call(regExp) === "[object RegExp]") {
                if (regExp.global)
                    regExp.lastIndex = i;
                let m;
                while (m = regExp.exec(string)) {
                    let args = m.concat([m.index, m.input]);
                    parts.push(string.slice(i, m.index), callback.apply(null, args));
                    i = regExp.lastIndex;
                    if (!regExp.global)
                        break; // for non-global regexes only take the first match
                    if (m[0].length === 0)
                        regExp.lastIndex++;
                }
            } else {
                regExp = String(regExp);
                i = string.indexOf(regExp);
                parts.push(string.slice(0, i), callback.apply(null, [regExp, i, string]));
                i += regExp.length;
            }
            parts.push(string.slice(i));
            return Promise.all(parts).then(function(strings) {
                return strings.join("");
            });
        },

        /**
         *
         * @param {string} string
         * @param {string} LangFrom
         * @param {string} LangTo
         * @param {boolean} isReverseSwitch
         * @returns {string}
         */
        KeyboardSwitch(string, LangFrom='En', LangTo='Ru', isReverseSwitch = true){
            LangFrom = Lure.String.Capitalize(LangFrom);
            LangTo   = Lure.String.Capitalize(LangTo);

            if (!string)
                return '';

            let x = '';
            for (let i = 0; i < string.length; i++){
                let Index = Lure.String._KeyBD[LangFrom].indexOf(string[i]);
                if (Index > -1) {
                    x += Lure.String._KeyBD[LangTo][Index];
                }
                else if (Index < 0 && isReverseSwitch) {
                    Index = Lure.String._KeyBD[LangTo].indexOf(string[i]);
                    x += Index > -1 ? Lure.String._KeyBD[LangFrom][Index] : string[i];
                }
                else if (Index < 0 && !isReverseSwitch){
                    x += string[i];
                }
            }
            return x;
        },
        Random(Length, isRandomCase=false) {
            let s = '';
            for (let i = 0; i < Length; i++){
                let Num = Lure.GetRandom(35, 0);
                let l = Num.toString(36);
                if (isRandomCase && Num > 23){
                    l = l.toUpperCase()
                }
                s += l;
            }
            return s;
        },
    },
    Input: {
        /**
         *
         * @param input
         * @returns {{Start: number, End: number}}
         */
        GetCursorPosition: function(input) {
            let Pos = {
                Start: -1,
                End: -1
            };
            if ("selectionStart" in input && document.activeElement === input) {
                Pos.Start = input.selectionStart;
                Pos.End   = input.selectionEnd;
            }
            else if (input.createTextRange) {
                let Selection = document.selection.createRange();
                if (Selection.parentElement() === input) {
                    let Range = input.createTextRange();
                    Range.moveToBookmark(sel.getBookmark());
                    for (let len = 0; Range.compareEndPoints("EndToStart", Range) > 0; Range.moveEnd("character", -1))
                    {
                        len++;
                    }
                    Range.setEndPoint("StartToStart", input.createTextRange());
                    while(Range.compareEndPoints("EndToStart", rng) > 0){
                        Pos.Start++;
                        Pos.End++;
                        Range.moveEnd("character", -1)
                    }
                }
            }
            if (input.tagName.toLowerCase() === 'textarea'){
                let val = input.value;
                Pos.Start += val.substr(0, Pos.Start).split('').Where(x=>x === '\n').length;
                Pos.End += val.substr(0, Pos.End).split('').Where(x=>x === '\n').length;
            }
            return Pos;
        }
    },
    Button: {
        /**
         *
         * @param {HTMLElement} ButtonElement
         */
        Lock: function (ButtonElement) {
            ButtonElement = Lure.Select(ButtonElement);
            ButtonElement.disabled = true;
            ButtonElement.classList.add(Lure.Settings.Common.CSSButtonBusy);
        },
        /**
         *
         * @param {HTMLElement} ButtonElement
         */
        Unlock: function (ButtonElement) {
            ButtonElement = Lure.Select(ButtonElement);
            ButtonElement.disabled = false;
            ButtonElement.classList.remove(Lure.Settings.Common.CSSButtonBusy);
        },
        /**
         *
         * @param {HTMLElement} ButtonElement
         */
        Release: function (ButtonElement) {
            ButtonElement = Lure.Select(ButtonElement);
            ButtonElement.disabled = false;
            ButtonElement.classList.remove(Lure.Settings.Common.CSSButtonBusy);
        }
    },
    Cookie: {
        Get: function (name) {
            let matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        },
        Set: function (Name, Value, Options) {
            Options = Options ? Options : {};
            if (Options.expires){
                Options.expires = Lure.Date(Options.expires).Date.toUTCString();
            }
            let cookie = `${Name}=${Value}`;
            Options.path = Options.path !== void 0 ? Options.path : '/';
            for (let p in Options) {
                if (Options.hasOwnProperty(p)){
                    cookie += `; ${p} = ${Options[p] !== true ? Options[p]: ''}`;
                    /*let propValue = Options[p];
                    if (propValue !== true) {
                        cookie += "=" + propValue;
                    }*/
                }
            }
            document.cookie = cookie;
        },
        Remove: function (Name, Path='/') {
            Lure.Cookie.Set(Name, '', {
                expires: new Date(0),
                path: Path
            })
        }
    },




    User: {
        ID: -1,
        Roles: [],      // ex.: Roles: [2,5,7]
        SubRoles: {},   // ex.: SubRoles: {4:[-1], 8:[123,212,314]}

        Cache: {},
    },


    //private 'n experimentals:
    /**
     * @param {Event} e
     * @return {object} ClonedEvent
     */
    _EventClone: function(e) {
        function ClonedEvent() {}

        let clone = new ClonedEvent();
        for (let p in e) {
            let d = Object.getOwnPropertyDescriptor(e, p);
            if (d && (!d.writable || !d.configurable || !d.enumerable || d.get || d.set)) {
                Object.defineProperty(clone, p, d);
            }
            else {
                clone[p] = e[p];
            }
        }
        Object.setPrototypeOf(clone, e);
        return clone;
    },


    /*** API ***/

    /**
     * @param promise
     * @param handlers
     * @returns {*}
     */
    ApiCall: function (promise, handlers={}) {
        const P = promise;
        P.then(x=>{
            handlers.Success ? handlers.Success.call(x): null;
            handlers.Finally ? handlers.Finally.call(x) : null;
        });
        P.catch(x=>{
            handlers.Catch   ? handlers.Catch.call(x): null;
            handlers.Finally ? handlers.Finally.call(x) : null;
        });
        return P;
    },
    /**
     * @param {Promise<T>} promise
     * @param {ApiCallHandlers} handlers
     * @template T
     * @returns {Promise<T>}
     */
    Call: function (promise, handlers={}) {

        // if (promise.isResolved)
        //     return promise;
        //
        // let isPending = true;
        // let isRejected = false;
        // let isFulfilled = false;
        return promise
            .then(x=>{
                //isFulfilled = true;
                //isPending = false;
                handlers.Then ? handlers.Then(x): null;
                handlers.Finally ?  handlers.Finally(x) : null;
                return promise;
            })
            .catch(x=>{
                //isRejected = true;
                //isPending = false;
                handlers.Catch ? handlers.Catch(x): console.error('[api.call]'+x);
                handlers.Finally ?  handlers.Finally(x) : null;
                return promise;
            });
        // result.isFulfilled = function() { return isFulfilled; };
        // result.isPending = function() { return isPending; };
        // result.isRejected = function() { return isRejected; };
        // return result;
    },
    /**
     * @param {object} Context   thisArg
     * @param {object} Arg       event
     * @param {HTMLElement} Target
     * @param {function} before
     * @param {function} after
     * @param {string} CSSBefore
     * @param {string} CSSAnimate
     * @param {number} Duration
     * @param {timeout|int} Timeout
     * @returns {number|*}
     */
    AsyncToggle: function (Context, Arg, Target, before, after, CSSBefore, CSSAnimate, Duration, Timeout) {
        if (Timeout)
            clearTimeout(Timeout);
        before.call(Context, Arg);
        if (CSSBefore)
            Target.classList.remove(CSSBefore);

        if (CSSBefore === CSSAnimate){


            //wait for remove css
            // setTimeout(()=>{
            //     if (CSSAnimate)
            //         Target.classList.add(CSSAnimate);
            //     Timeout = setTimeout(() => {
            //         after.call(Context, Arg);
            //     }, Duration);
            // }, 2);
            //no wait (if wait prev and new content will be blinked)
            if (CSSAnimate)
                Target.classList.add(CSSAnimate);
            Timeout = setTimeout(()=>{
                after.call(Context, Arg);
            }, Duration);

            return Timeout;
        }
        if (CSSAnimate)
            Target.classList.add(CSSAnimate);
        Timeout = setTimeout(() => {
            after.call(Context, Arg);
        }, Duration);
        return Timeout;

    },

    /**
     * @param CSSAnimation
     * @param HTMLElement
     * @returns {Object}
     */
    GetDurationAnimation: function(CSSAnimation, HTMLElement=null) {
        let isNull = false;
        if (!HTMLElement){
            isNull = true;
            HTMLElement = document.createElement('div');
            document.body.appendChild(HTMLElement);
        }
        /* Check for CSS animation or transition */
        if (CSSAnimation)
            HTMLElement.classList.add(CSSAnimation);

        let Style        = window.getComputedStyle(HTMLElement);
        let Duration     = eval(Style.transitionDuration.replace('ms', '*1').replace('s', '*1000'));
        let DurationAnim = eval(Style.animationDuration.replace('ms', '*1').replace('s', '*1000'));
        if (Duration < DurationAnim)
            Duration = DurationAnim;
        if (CSSAnimation)
            HTMLElement.classList.remove(CSSAnimation);
        if (isNull)
            HTMLElement.remove();
        return Duration;
    },


    /**
     * @param {string | Element} query
     * @param {Element} [parent]
     * @return {HTMLElement}
     */
    Select: function(query, parent = document){
        if (query === '' || query === null)
            return null;
        if (query instanceof Node && query.parentNode === null)
            return null;
        return query instanceof Node ? query : parent.querySelector(query)
    },
    SelectAll: function(Selector, parent = document){
        if (typeof Selector === 'undefined')
            return [];
        if (typeof Selector.tagName !== 'undefined' || Selector === document)
            return [Selector];
        return parent.querySelectorAll(Selector);
    },


    /**
     * @param {string} eventName
     * @param {string} selector
     * @param {function} handler
     * @param {HTMLElement} parent
     * @param {object} thisArg
     */
    AddEventListenerGlobal: function(eventName, selector, handler, parent = document, thisArg){
        parent.addEventListener(eventName, function(e) {
            let target = e.target;
            let isIt = false;
            let event = Lure._EventClone(e);
            let elems = parent.querySelectorAll(selector);
            if (elems[0] === target)
            {
                event.currentTarget = target;
                isIt = true;
            }
            if (!isIt){
                for (let i = 0; i < elems.length; i++){
                    if (elems[i].contains(target)){
                        isIt = true;
                        event.currentTarget = target.closest(selector);
                        break;
                    }
                }
            }
            if (event.target.classList.contains('l-edit-editor')  && eventName === 'click') {
                e.stopPropagation();
                //console.log('stopPropagation', event.target);
                return;
            }
            if (isIt){
                let p = {
                    ID: null,
                    LineID: null,
                };
                let ID = event.currentTarget.dataset['id'];
                let LineID = event.currentTarget.dataset['line'];
                if (ID){
                    p.ID = parseInt(ID);
                }

                if (LineID){
                    p.LineID = parseInt(LineID);
                }
                else {
                    let TemplatorLine = event.currentTarget.closest('.l-t-line');
                    if (TemplatorLine){
                        p.LineID = parseInt(TemplatorLine.dataset['line']);
                    }
                }

                handler.call(thisArg? thisArg : event.currentTarget, event, p);
            }

        });
    },

    DocumentSelectionClear: function () {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }
    },


    isVisible: (HTMLElement)=>{
        let isVisible = Lure._isVisible(HTMLElement);
        if (isVisible){
            while (HTMLElement.parentElement){
                if (!Lure._isVisible(HTMLElement)){
                    return false;
                }
                HTMLElement = HTMLElement.parentElement;
            }
        }
        return isVisible;
        /*
        //check invisible state;
        let isVisibleSelf = function(element){
            let ContentStyle = window.getComputedStyle(element);
            if ( (ContentStyle.display === "none") || (ContentStyle.opacity === "0") || (ContentStyle.visibility === "hidden") )
                return false;
            //check for null-size
            if ( (parseInt(ContentStyle.minWidth) === 0 || ContentStyle.minWidth === "auto")  && parseInt(ContentStyle.width) === 0)
                return false;
            if ( (parseInt(ContentStyle.minHeight) === 0 || ContentStyle.minHeight === "auto") && parseInt(ContentStyle.height) === 0)
                return false;
            return true;
        };
        let isVisibleParent = function (element) {
            while (element.parentElement){
                if (!isVisibleSelf(element.parentElement)
                    || (element.tagName.toLowerCase() !== 'body' && !element.parentElement))//not real elem
                {
                    return false;
                }
                element = element.parentElement;
            }
            return true;
        };
        if (!isVisibleSelf(HTMLElement))
        {
            return false;
        }

        return isVisibleParent(HTMLElement);

        return true;*/
    },
    _isVisible: function (HTMLElement) {
        let Style = window.getComputedStyle(HTMLElement);

        let isVisible =  Style.display    !== 'none'
            && Style.visibility !== 'hidden'
            && parseFloat(Style.opacity) !== 0
            && parseFloat(Style.height) + parseFloat(Style.minHeight) !== 0
            && parseFloat(Style.width)  + parseFloat(Style.minWidth)  !== 0;
            //&& ( HTMLElement.tagName.toLowerCase() === 'body' || (HTMLElement.offsetParent !== null && Style.position !== 'fixed'))
        if (Style.position !== 'fixed' || !isVisible)
            return isVisible;

        let rect = HTMLElement.getBoundingClientRect();
        let rectVisible = rect.x + rect.width > 0 &&  rect.x < document.body.clientWidth
                 && rect.y + rect.height > 0 &&  rect.y < document.body.clientHeight;

        return rectVisible;
            //&& (Style.position !== 'fixed' || (Style.position === 'fixed' && ) )
        //jquery
        //return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
    },


    GetFileText: function (url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve( xhr.response);
            };
            xhr.onerror = function () {
                reject(new Error(
                    'XMLHttpRequest Error: '+this.statusText));
            };
            if (url.indexOf('..') > -1)
                url = url.replace('..', document.location.protocol + "//" + document.location.host);
            else {
                url = document.location.href.substring(0, document.location.href.lastIndexOf('/')+1) + url;
            }
            console.log('Lure.GetFileText', url);
            xhr.open('GET', url);
            //xhr.setRequestHeader('Content-Type',"text/plain; charset=x-user-defined");
            xhr.send();
        });


    },

    GetTextWidth: function(txt, fontname, fontsize){
        if(this.c === undefined){
            this.c=document.createElement('canvas');
            this.ctx=this.c.getContext('2d');
        }
        this.ctx.font = fontsize + ' ' + fontname;
        return this.ctx.measureText(txt).width;
    },
    GetInlineSize: function(elem, fontSize='1rem'){
        const hiddenStyle = "left:-10000px;top:-10000px;height:auto;width:auto;position:absolute;";
        const clone = document.createElement('div');
        for (let k in elem.style) {
            if (!elem.style.hasOwnProperty(k))
                continue;
            try {
                if ((elem.style[k] !== '') && (elem.style[k].indexOf(":") > 0)) {
                    clone.style[k] = elem.style[k];
                }
            } catch (e) {}
        }
        document.all ? clone.style.setAttribute('cssText', hiddenStyle) : clone.setAttribute('style', hiddenStyle);
        clone.style.fontSize = fontSize;
        clone.innerHTML = elem.innerHTML;
        parent.document.body.appendChild(clone);
        const sizes = {width:clone.clientWidth,height:clone.clientHeight};
        parent.document.body.removeChild(clone);
        return sizes;
    },

    /**
     * @returns {int}
     */
    GetID: (()=>{
        let f = function(){
            f._Counter++;
            return f._Counter;
        };
        f._Counter = 0;
        return f;
    })(),
    /**
     * @returns {int}
     */
    GetLastID: function(){
        return Lure.GetID._Counter;
    },
    isNumeric: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    Perf: function(perfStart, text='Perf', ConsoleParam=''){
        const x = Math.floor((window.performance.now()-perfStart)*100)/100;
        console.log("%c[" + text + "]: " + x + "ms",ConsoleParam);
        return x;
    },


    NoFeature: function(name = ""){
        if (name !== "")
            name = "\""+name+"\"";
        Lure.Confirm(
            "Error",
            "Sorry, function "+name+" is not available yet"
        )
    },
    /**
     * @param {Element} object
     * @param {string} msg
     */
    ErrorHint: function(object, msg) {
        if (!msg)
            msg = "Поле не может быть пустым";
        let div = document.createElement('div');
        div.classList.add('lure-error-hint');
        div.innerHTML = msg;
        object.parentElement.style.position = 'relative';
        object.parentElement.appendChild(div);
        div.style.display = 'block';
        try {
            div.animate({opacity: [0, 1]}, {duration : 300});
        }
        catch (e){}

        setTimeout(function(){

            try {
                div.animate({opacity: [1, 0]}, {duration : 300})
                    .onfinish = ()=>{div.style.display = 'none'};
            }
            catch (e){
                div.style.display = 'none';
            }
            //TODO CHECK FADEIN FADEOUT
            setTimeout(function(){
                if (object.parentElement)
                    object.parentElement.style.position = '';
                div.remove();
            }, 500)
        }, 2000)
    },
    /**
     * @param {number} number
     * @param {number} divider
     * @param {string} mode (ceil, floor, round)
     * @returns {number}
     */
    RoundBy: function(number, divider, mode='ceil'){ //mode: ceil, floor, round
        let b = number % divider;
        if (b === 0)
            return number;
        if (mode === 'ceil')
            return number - b + divider;
        else if (mode === 'floor')
            return number - b;
        return number - b +  (b/divider < 0.5 ? 0: divider);
    },
    /**
     * @param number
     * @returns {number}
     */
    GetNumberOrder: function(number){
        //debugger;
        let b = number.toString().split('.');
        if (parseInt(b[0]) !== 0){
            b = b[0].length;
            return b-1;
        }else{
            let p = b[1]?b[1].match(/[^0]/):null;
            p = p? p.index+1:1;
            return -p;
        }
    },

    GetRandom: (max=100, min=0)=>{
        return Math.round(Math.random()*(max-min)+min)
    },

    Confirm: function(Caption  = "Achtung", Message = '', {
        Error = false,
        CaptionColor =  '',
        CaptionBackground = '',
        ButtonAgreeText = Lure.Culture.Lang.Ok,
        ButtonCancelText = Lure.Culture.Lang.Cancel,
        OnAgree = () => {},
        OnCancel = null
    } = {})
    {
        document.activeElement.blur();
        let zIndex = Lure._Dialog.zIndex;

        let dialog = document.createElement('div');
        dialog.classList.add('lure-confirm');
        if (Lure.Settings.DialogAnimation)
            dialog.classList.add(Lure.Settings.DialogAnimation);
        //###title
        let title = document.createElement("div");
        title.classList.add('cd-caption');
        title.innerHTML = Caption;
        title.style.color = CaptionColor;
        title.style.background = CaptionBackground;
        dialog.appendChild(title);
        //###message field
        let msg = document.createElement("div");
        msg.classList.add('cd-text');
        msg.innerHTML = Message;
        dialog.appendChild(msg);
        //###buttonfield
        let buttons = document.createElement("div");
        buttons.classList.add("cd-buttons");
        dialog.appendChild(buttons);
        //###button confirm
        let btnOk = document.createElement("div");
        btnOk.classList.add("button", "cd-button", "btn-diag-confirm");
        btnOk.innerHTML = ButtonAgreeText;
        btnOk.onclick = function(){
            Lure._ConfirmCount--;
            if (OnAgree !== null && OnAgree !== void 0)
                OnAgree();
            if (Lure.Settings.Dialog.Blur && Lure._ConfirmCount < 1 )
                Lure.Select(Lure.Settings.Dialog.BlurTarget).classList.remove(Lure.Settings.Dialog.Blur);
            //$(Lure.Settings.DialogBlur).removeClass('lure-blur');
            Lure._Dialog.Remove(dialog);
            wrap.remove();
            dialog.remove();

        };
        dialog.getElementsByClassName("cd-buttons")[0].appendChild(btnOk);
        //###button cancel
        if (OnCancel !== null)
        {
            let btnCancel = document.createElement("div");
            btnCancel.classList.add("button", "cd-button", "btn-diag-cancel");
            btnCancel.innerHTML = ButtonCancelText;
            btnCancel.onclick = function(){
                Lure._ConfirmCount--;
                if (OnCancel !== null)
                    OnCancel();
                if (Lure.Settings.Dialog.Blur  && Lure._ConfirmCount < 1)
                    Lure.Select(Lure.Settings.Dialog.BlurTarget).classList.remove(Lure.Settings.Dialog.Blur);
                Lure._Dialog.Remove(dialog);
                wrap.remove();
                dialog.remove();
            };
            dialog.getElementsByClassName("cd-buttons")[0].appendChild(btnCancel);
        }
        //### Dialog-Wrapper
        let wrap = document.createElement("div");
        wrap.classList.add(Lure.Settings.Dialog.Wrapper);
        if (Lure.Settings.Confirm.Wrapper)
            wrap.classList.add(Lure.Settings.Confirm.Wrapper);
        wrap.style.zIndex = zIndex + 1;
        dialog.style.zIndex = zIndex + 2;

        Lure._Dialog.Add(dialog);
        if (Lure.Settings.Confirm.Wrapper)
            document.body.appendChild(wrap);
        document.body.appendChild(dialog);
        Lure._ConfirmCount++;
        if (Lure.Settings.Dialog.Blur)
        {
            wrap.style.background = 'none';
            Lure.Select(Lure.Settings.Dialog.BlurTarget).classList.add(Lure.Settings.Dialog.Blur);
        }
    },

    _Experimental: {
        Clone2: function (object) {
            let Clone = false;
            if (object instanceof Array){
                Clone = [];
                for (let i = 0; i < object.length; i++){
                    if (Lure.GetType(object[i]) === 'object' || Lure.GetType(object[i]) === 'array'){
                        Clone[i] = Lure.Clone2(object[i]);
                    }
                    else{
                        Clone[i] = object[i];//JSON.parse(JSON.stringify(object[i]));
                    }
                }
            }
            else{
                Clone = {};
                for (let k in object){
                    if (object.hasOwnProperty(k)){
                        if (Lure.GetType(object[k]) === 'object'|| Lure.GetType(object[k]) === 'array'){
                            Clone[k] = Lure.Clone2(object[k]);
                        }
                        else{
                            Clone[k] = object[k] instanceof Function ? object[k] :JSON.parse(JSON.stringify(object[k]))
                        }
                    }
                }
            }

            return Clone;
        },
        GetInlineSize1: function(elem, fontSize='12px'){
            let pp = performance.now();
            const hiddenStyle = "left:-10000px;top:-10000px;height:auto;width:auto;position:absolute;";
            const clone = document.createElement('div');
            for (let k in elem.style) {
                try {
                    if ((elem.style[k] !== '') && (elem.style[k].indexOf(":") > 0)) {
                        clone.style[k] = elem.style[k];
                    }
                } catch (e) {}
            }
            document.all ? clone.style.setAttribute('cssText', hiddenStyle) : clone.setAttribute('style', hiddenStyle);
            clone.style.fontSize = fontSize;
            clone.innerHTML = elem.innerHTML;
            parent.document.body.appendChild(clone);
            let xx = getComputedStyle(clone);
            let ps = performance.now();
            let sizes = {width: Lure.GetTextWidth(elem.innerText, xx.getPropertyValue('font-family'), xx.getPropertyValue("font-size")), height: 12};
            Lure.Perf(ps, '--size');
            parent.document.body.removeChild(clone);
            console.log('sizes', sizes, xx);
            Lure.Perf(pp, '--calxXwidth');
            return sizes;
        },
    }
};

/* Shortcuts */
Lure.GetType = Lure.PropTypes.GetType;
Lure.GetProperty = Lure.Object.GetProperty;
Lure.SetProperty = Lure.Object.SetProperty;
Lure.CreateElementFromString  = Lure.DOM.CreateElementFromString;
Lure.CreateElementsFromString = Lure.DOM.CreateElementsFromString;
Lure.Clone = Lure.Object.Clone;
Lure.CheckDirty = Lure.Object.CheckDirty;
Lure.PrintElement = Lure.DOM.Print;
Lure.SaveBlob = Lure.Blob.SaveAs;

















//#DEFAULTS
Lure.Settings.Locale     = navigator.language.substring(0,2);
Lure.Settings.LocaleSort = Lure.Settings.Locale;





document.addEventListener('DOMContentLoaded', function(){
    /** @type {LurePopLog} */
    Lure.Pop = new Lure.PopLog();

    Lure.DOM.ScrollBarWidth = (()=>{
                    let outer = document.createElement("div");
                    outer.style.visibility = "hidden";
                    outer.style.width = "100px";
                    document.body.appendChild(outer);
                    let widthNoScroll = outer.offsetWidth;
                    // force scrollbars
                    outer.style.overflow = "scroll";
                    // add innerdiv
                    let inner = document.createElement("div");
                    inner.style.width = "100%";
                    outer.appendChild(inner);
                    let widthWithScroll = inner.offsetWidth;
                    // remove divs
                    outer.parentNode.removeChild(outer);
                    return widthNoScroll - widthWithScroll;
                })();

});
Lure.__PreloadImages = [
    'lure/img/icon-load.png',
    'lure/img/icon-edit.png',
    'lure/img/icon-edit_white.png',
    'lure/img/icon-x.svg',
    'lure/img/icon-x_white.svg',

    'lure/img/control-sort.svg',
    'lure/img/control-sort_black.svg',
    'lure/img/l-checkbox.svg',
    'lure/img/l-radio.svg',
];
Lure.__TempImg = [];
for(let i = 0; i < Lure.__PreloadImages.length; i++) {
    Lure.__TempImg[i] = new Image();
    Lure.__TempImg[i].src = Lure.__PreloadImages[i]
}
Lure.__TempImg = void 0;








/**
 *
 * @type {Lure.IEnumerable}
 * @class
 */
Lure.__Linq = class IEnumerable{
    /**
     * @callback WhereCallback
     * @param {T[]} array
     * @param {int} [i]
     * @template T
     * @returns {boolean}
     */

    /**
     *
     * @param {WhereCallback} delegate
     * @returns {Lure.IEnumerable}
     */
    Where(delegate){
        this._Delegates.push({d:delegate, t: 0});
        return this;
    }
    Select(delegate){
        this._Delegates.push({d:delegate, t: 1});
        return this;
    }
    /**
     *
     * @returns {T}
     * @template T
     */
    FirstOrDefault(def=null){
        for (let i = 0; i < this._Arr.length; i++){
            let drop = false;
            let e = this._Arr[i];
            for (let j = 0; j < this._Delegates.length; j++){
                let del = this._Delegates[j];
                if (del.t === 0 && !del.d(e, i) ){
                    drop = true;
                    break;
                }
                else
                {
                    e = this._Delegates[j].d(e, i);
                }
            }
            if (!drop) {
                return e;
            }
        }
        return def;
    }

    /**
     *
     * @returns {T[]}
     * @template T
     */
    ToList(){
        let a = new Array(this._Arr.length);
        let currix=0;
        for (let i = 0; i < this._Arr.length; i++){
            let drop = false;
            let e = this._Arr[i];
            for (let j = 0; j < this._Delegates.length; j++){
                let del = this._Delegates[j];
                if (del.t === 0 && !del.d(e, i) ){
                    drop = true;
                    break;
                }
                else
                //if (del.t === 1)
                {
                    e = this._Delegates[j].d(e, i);
                }
            }
            if (!drop) {
                a[currix]=e;
                currix++;
            }
        }
        return a.slice(0,currix);
    }

    /**
     *
     * @param {T} arr
     * @template T
     */
    constructor(arr){
        /**
         *
         * @type {T}
         * @template T
         */
        this._Arr = arr;
        this._Delegates = [];
    }
};
/**
 *
 * @param arr
 * @returns {Lure.IEnumerable}
 */
Lure.Linq = function (arr) {
    return new Lure.__Linq(arr);
};

function kuk__Linq() {
    let A = [];
    for (let i = 1 ; i < 1000000; i++){
        A.push({
            ID: i,
            Name: `er${i}geg`,
            Val: i*2
        })
    }
    let p = window.performance.now();
    let x = A
        .Where(x=>x.Val < 1000).Select(x=>x.ID).Where(x=>x % 3 === 0).FirstOrDefault();
    console.log('prto', window.performance.now() - p, x);
    p = window.performance.now();
    let y = Lure.Linq(A)
        .Where(x=>x.Val < 1000).Select(x=>x.ID).Where(x=>x % 3 === 0).FirstOrDefault();
    console.log('linq', window.performance.now() - p, y);
}








Lure.Application = {
    Entry: null,
    isRun: false,
    Content: [],
    Run(){
        if  (Lure.Application.isRun)
            return Lure.System.ShowWarn('Lure Application is already run');

        if (Lure.Route.Enabled && !document.location.hash && localStorage.getItem('LureRoute')){
            document.location.hash = localStorage.getItem('LureRoute');
            localStorage.setItem('LureRoute', '');
        }
        Lure.Application.isRun = true;
        for (let i = 0; i < Lure.Application.Content.length; i++){
            if (!Lure.Application.Content[i].Parent)
            {
                if (Lure.Application.Content[i]._Init)
                Lure.Application.Content[i]._Init();
                try{
                    //can be as field in another Content (just as field, not like child) so that _Init() could called also as child
                }
                catch (e){
                    console.error(`Error in "${Lure.Application.Content[i].Name}"`,Lure.Application.Content[i],'\n',e);
                }
            }
        }
        let LureRouteStat = 0;
        try{
            if (Lure.Route.Enabled)
                LureRouteStat = Lure.Route.Run();
        }
        catch (e) {
            console.warn('[Lure.Application] RunByRoute error. Wrong route or not enough permission');
        }
        if (Lure.Application.Entry && LureRouteStat < 1){
            Lure.Route._PopState = false; //to push  entry route
            let ct = Lure._Content.List.Where(c=>c.Name === Lure.Application.Entry).FirstOrDefault();
            console.log('Lure.Application.Entry', Lure.Application.Entry, ct);

            if (ct)
                ct.Show();
        }
        if (Lure.Route.Enabled){
            Lure.Route.Init();
        }
        console.log('[Lure.Application.Run]');
    }
};
/* Editable */
//Lure.isEditableEventsEnabled = false;
Lure.Editable = {
    isEnabled: false,

    ListenEditable:(LureContent, Controller)=>{
        let CType = Controller.Type;
        //console.log(`ListenEditable: ${Controller.ID}`);
        LureContent.AddEventListener('click', `.${Lure.Settings.Editable.ClassEditable} .l-edit[data-controller="${Controller.ID}"]`, function(e){
            if (e.target.classList.contains('l-edit-btn-edit')){
                Lure.Editable.RemoveEdits(LureContent);
                if (e.target.classList.contains(`l-edit-${CType}`))
                    Lure.Editable.AddEdits.call(LureContent, e.target.parentElement.parentElement.parentElement, Controller, CType); // e.target (l-edit-icon) -> l-edit-controls -> l-row -> editable
            }
            else if (e.target.classList.contains('l-edit-btn-save')){
                if (e.target.classList.contains(`l-edit-${CType}`))
                    Lure.Editable.Save.call(LureContent, e.target.parentElement.parentElement.parentElement, Controller)
            }
        });
        LureContent.AddEventListener('dblclick', `.${Lure.Settings.Editable.ClassEditable}[data-controller="${Controller.ID}"]`, function(e){
            if (e.target !== e.currentTarget && !e.target.classList.contains('l-edit-value'))
                return;
            Lure.Editable.RemoveEdits(LureContent);
            if (Lure.Select(`.l-edit-${CType}`, e.currentTarget) !== null)
                Lure.Editable.AddEdits.call(LureContent, e.currentTarget, Controller, CType);
        });
        LureContent.AddEventListener('input', `.${Lure.Settings.Editable.ClassEditable} .l-edit-textbox[data-controller="${Controller.ID}"]`, function (e) {
            //console.log('textbox', e.target, e.currentTarget.classList);
            if (e.currentTarget.classList.contains(`l-edit-${CType}`)){
                let EditElement = e.currentTarget.parentElement.parentElement;
                let LineID   = e.currentTarget.dataset['line'];
                let Property = e.currentTarget.dataset['property'];//Lure.Editable.GetPropertyName(EditElement, Controller);
                Property = Property.replace('$item', '').replace('.$this', '').replace('$this', '');
                //if max or min is exists, then value is numeric
                let val = e.currentTarget.value;
                let max = e.currentTarget.max;
                let min = e.currentTarget.min;
                if (max && parseFloat(max) < val)
                    val = parseFloat(max);
                if (min && parseFloat(min) > val)
                    val = parseFloat(min);
                if (Controller.PropTypes[Property]){
                    val = Lure.PropTypes.TryParse(Controller.PropTypes[Property], val, Property);
                }


                if (Property === ''){
                    if (Controller.isLineBuilder){
                        Controller._DataPrivateDict[LineID].Data = val;
                    }else{
                        Controller._DataPrivate = val
                    }
                }
                else {
                    Lure.SetProperty(Controller.isLineBuilder? Controller._DataPrivateDict[LineID].Data: Controller._DataPrivate, Property, val);
                }
                //if (Controller.PropTypes[Property])
                //    Lure.PropTypes.CheckProp(Controller.isLineBuilder? Controller._DataPrivateDict[LineID].Data: Controller._DataPrivate, this.PropTypes[Property], Property);
                //Controller._SetEditProperty(Property, val);
                Lure.Editable.CheckChanges(EditElement, Controller, Property, LineID);
                //console.log('textbox', Property, val);
            }
    
        });
        LureContent.AddEventListener('keyup', `.${Lure.Settings.Editable.ClassEditable}  .l-edit-textbox[data-controller="${Controller.ID}"]`, function (e) {
            if(e.keyCode === 13 && e.target.tagName.toLowerCase() !== 'textarea' && e.target.classList.contains(`l-edit-${CType}`) ) {
                return Lure.Editable.Save.call(LureContent, e.target.parentElement.parentElement, Controller)
            }
        });
        LureContent.AddEventListener('change', `.${Lure.Settings.Editable.ClassEditable}  .l-edit-select[data-controller="${Controller.ID}"]`, function (e) {
            if (e.target.classList.contains(`l-edit-${CType}`)){
                let EditElement = e.currentTarget.parentElement.parentElement;
                let Property = EditElement.dataset['property'];//Lure.Editable.GetPropertyName(EditElement, Controller);
                Property = Property.replace('$item', '').replace('.$this', '').replace('$this', '');
                let LineID   = e.currentTarget.dataset['line'];

                //console.log('select', Property, e.currentTarget.value);


                Lure.SetProperty(Controller.isLineBuilder? Controller._DataPrivateDict[LineID].Data: Controller._DataPrivate, Property, e.currentTarget.value);
                if (Controller.PropTypes[Property])
                    Lure.PropTypes.CheckProp(Controller.isLineBuilder? Controller._DataPrivateDict[LineID].Data: Controller._DataPrivate, Controller.PropTypes[Property], Property);
                //Controller._SetEditProperty(Property, e.currentTarget.value);
                Lure.Editable.CheckChanges(EditElement, Controller, Property, LineID);
            }
    
        });
    
        /* Removable */
        if (Controller.Type !== 'proto'){
            LureContent.AddEventListener('click', `.${Lure.Settings.Editable.ClassRemovable}  .l-edit-btn-remove:not(.active)[data-controller="${Controller.ID}"]`, function (e) {
                e.currentTarget.classList.add('active');
                const i = e.currentTarget.dataset['line'];
                Lure.Call(Controller.Remove(i), {
                    Finally: ()=>{
                        e.currentTarget.classList.remove('active');
                    }
                })
            });
        }
        /* Editors click skipper*/
        if (!Lure.Editable.isEnabled){
            document.addEventListener('click', function (e) {
                if ( e.target.classList.contains('l-edit') && Lure.SelectAll('.l-edit, .l-edit-editing').length > 0)
                {
                    return;
                }
                Lure.Editable.RemoveEdits();
            });
            Lure.Editable.isEnabled = true;
        }
        //debugger;
        //console.log('e reg event', this);
        LureContent.isListenEditable = true;
    },
    ListenRemovable: function (content) {

        Lure.AddEventListenerGlobal('click', '.removable-icon', function (e) {
            let LineID = e.currentTarget.closest('.removable').dataset['line'];
            content.Remove(LineID);
        }, content.Content);
    },
    /**
     *
     * @param EditElement
     * @returns {string}
     */
    GetPropertyName(EditElement){
        //property name from DOM line like object[i].PropertyName or object.PropertyName
        let LineID = EditElement.dataset['line'];
        if (LineID>-1){
            return `[${LineID}].`+ EditElement.dataset['property'];
        }
        return EditElement.dataset['property'];
    },
    EditableForceRefresh(Controller){
        let DOMContent = Controller.Content;
        let Query = `.${Lure.Settings.Editable.ClassEditableForce}`;
        if (Controller.Type === 'proto')
            Query = `.${Lure.Settings.Editable.ClassEditableForce}[data-line="null"]`;
        let EditableList = Lure.SelectAll(Query, DOMContent);
        for (let i = 0; i < EditableList.length; i++){
            EditableList[i].classList.remove(Lure.Settings.Editable.ClassChanged);
            Lure.Editable.AddEdits(EditableList[i], Controller, Controller.Type);
        }
    },
    CheckChanges(EditElement, Controller, Property, LineID){
        if (Lure.GetProperty(Controller.isLineBuilder? Controller._DataDict[LineID].Data: Controller._Data, Property) !== Lure.GetProperty(Controller.isLineBuilder? Controller._DataPrivateDict[LineID].Data: Controller._DataPrivate, Property))
            EditElement.classList.add('l-edit-changed');
        else
            EditElement.classList.remove('l-edit-changed');
    },
    RemoveWaiting(LureContent){
        let Waiters = Lure.SelectAll(`.${Lure.Settings.Editable.ClassWaiting}`, LureContent ? LureContent.Content : document);
        for (let i = 0; i < Waiters.length; i++){
            Waiters[i].classList.remove(Lure.Settings.Editable.ClassWaiting);
        }
    },
    RemoveEdits(LureContent){
        let Editables = Lure.SelectAll(`.l-edit-editing:not(.l-edit-datepick):not(.${Lure.Settings.Editable.ClassEditableForce})`, LureContent? LureContent.Content : document);
        for (let i = 0; i < Editables.length; i++){
            //debugger;
            Editables[i].innerHTML = Editables[i]._innerHTML;
            Editables[i].classList.remove(Lure.Settings.Editable.ClassEditing);
            Editables[i].classList.remove(Lure.Settings.Editable.ClassChanged);
        }
        //Lure.Editable.RemoveWaiting(LureContent);
    },
    AddEdits(EditableElement, Controller, CType) {
        if (EditableElement.classList.contains('editable-special') )
            return;
        EditableElement.classList.add('l-edit-editing');
        EditableElement._innerHTML = EditableElement.innerHTML;
        let LineID = Controller.isLineBuilder ? parseInt(EditableElement.dataset['line']): 'proto';
        let Property = EditableElement.dataset['property'];
        Property = Property.replace('$item', '').replace('.$this', '').replace('$this', '');

        let ControllerData        = Controller.isLineBuilder ? Controller._DataDict[LineID].Data        : Controller._Data;
        let ControllerDataPrivate = Controller.isLineBuilder ? Controller._DataPrivateDict[LineID].Data : Controller._DataPrivate;

        if (Controller.Owner.isContent && (!Controller.Owner.HasPermissionWrite || !Controller.Owner.HasElementWritePermission(EditableElement, ControllerData)) ){
            return;
        }
        let SaveButton = `<div class="l-edit l-edit-controls"><div class="l-edit l-edit-icon l-edit-btn-save l-edit-${CType}" data-controller="${Controller.ID}" data-line="${LineID}"></div></div>`;

        if (!EditableElement.dataset['object']) //if no selectable data, just text editor it's needed
        {
            let EditType = Controller.PropTypes[Property]; //Controller.PropTypes[Property.replace(/\[[\d]+\]\./, '')];
            let EditMin  = EditableElement.dataset['min'];
            let EditMax  = EditableElement.dataset['max'];

            let isRichText = EditType === Lure.PropTypes.Text;

            EditType = EditType ? EditType : 'text';
            EditType = EditType === Lure.PropTypes.String ? 'text':EditType;

            if (EditType === Lure.PropTypes.Date){
                if (!EditableElement.LurePeriodPicker){
                    let DatePlace = Lure.Select('.l-edit-value', EditableElement);
                    DatePlace.classList.remove('l-edit');
                    EditableElement.classList.add('l-edit-datepick');
                    EditableElement.classList.add(`l-edit-${CType}`);
                    EditableElement.dataset['controller'] = Controller.ID;
                    if (Controller.isLineBuilder){
                        EditableElement.dataset['line'] = LineID;
                    }
                    EditableElement.dataset['property'] = Property;
                    EditableElement.LurePeriodPicker = new Lure.PeriodPicker({
                        Target: DatePlace,
                        TargetImmutable: true,
                        NoRange: true,
                        Min: EditMin? Lure.Date(EditMin).Date:null,
                        Max: EditMax? Lure.Date(EditMax).Date:null,
                        DateTarget: Lure.GetProperty(ControllerData, Property),
                        OnConfirm: function(DateStart, DateFinish){
                            //this here is PeriodPicker context
                            if (LineID === 'proto'){
                                Lure.SetProperty(Controller._DataPrivate, Property, DateStart);
                            }
                            else {
                                let DataItem = Controller.GetPrivateDataItemByLineID(LineID);
                                Lure.SetProperty(DataItem.Data, Property, DateStart);
                            }

                            Lure.Editable.Save(EditableElement, Controller);
                        }
                    });
                }
                EditableElement.LurePeriodPicker.Min  = EditMin? Lure.Date(EditMin).Date:null;
                EditableElement.LurePeriodPicker.Max  = EditMax? Lure.Date(EditMax).Date:null;
                EditableElement.LurePeriodPicker.Date = Lure.GetProperty(ControllerData, Property);
                return EditableElement.LurePeriodPicker.Show();
            }
            EditMin  = EditMin  ? `min="${EditMin}"`: '';
            EditMax  = EditMax  ? `max="${EditMax}"`: '';
            if  (EditType === 'uint' && (EditMin === '' || EditMin < 0) )
                EditMin = 'min="0"';

            if (isRichText){
                EditableElement.innerHTML = `<div class="l-row l-flex-between l-flexa-center l-flex-100"><textarea class="textbox l-textbox l-edit l-edit-editor l-edit-textbox l-edit-${CType}" ${EditType? 'data-type="'+EditType+'"': ''} ${EditMin} ${EditMax} data-controller="${Controller.ID}" data-property="${Property}" data-line="${LineID}">${Lure.GetProperty(ControllerData, Property)}</textarea>${SaveButton}</div>`;

            }else{
                EditableElement.innerHTML = `<div class="l-row l-flex-between l-flexa-center l-flex-100"><input class="textbox l-textbox l-edit l-edit-editor l-edit-textbox l-edit-${CType}" type="${EditType.indexOf('int')>-1 ? 'number':EditType}" ${EditType? 'data-type="'+EditType+'"': ''} ${EditMin} ${EditMax} value="${Lure.String.QuoteScreen(Lure.GetProperty(ControllerData, Property), true)}"  data-controller="${Controller.ID}" data-property="${Property}"  data-line="${LineID}"> ${SaveButton}</div>`;
            }

            if (Lure.Settings.Editable.AutoFocus)
                Lure.Select('.l-edit-editor', EditableElement).focus();
            if (Lure.Settings.Editable.AutoSelect)
                Lure.Select('.l-edit-editor', EditableElement).select();
        }
        else    //<select>'able data
        {
            let string_Select = `<div class="l-row l-flex-between l-flexa-center l-flex-100"><select class="select l-select l-edit l-edit-editor l-edit-select l-edit-${CType}"  data-controller="${Controller.ID}" data-property="${Property}" data-line="${LineID}">`;
            let SelectData = eval(EditableElement.dataset['object']);
            let PropertyValue = EditableElement.dataset['value'];
            let PropertyShow = EditableElement.dataset['present'];
            for (let i = 0; i < SelectData.length; i++ ){
                let item = SelectData[i];
            if (typeof item === typeof {}){
                    string_Select += `<option class="l-edit" value="${Lure.GetProperty(item, PropertyValue)}" ${(Lure.GetProperty(item, PropertyValue) === Lure.GetProperty(ControllerData, Property))? "selected":""} data-controller="${Controller.ID}" data-property="${Property}" data-line="${LineID}">${Lure.GetProperty(item, PropertyShow)}</option>`;
                }
                else{
                    string_Select += `<option class="l-edit" value="${item}" ${(item === Lure.GetProperty(ControllerData, Property))? "selected":""} data-controller="${Controller.ID}" data-property="${Property}" data-line="${LineID}">${item}</option>`;
                }
            }
            string_Select += `</select>${SaveButton}</div></div>`;
            EditableElement.innerHTML = string_Select;

        }


    },
    Save(EditableElement, Controller){
        let LineID = Controller.isLineBuilder ? EditableElement.dataset['line']: 'proto';
        let Property = EditableElement.dataset['property'];
        Property = Property.replace('$item', '').replace('.$this', '').replace('$this', '');
        //console.log('Property',`[${LineID}].`,Property);

        let ItemNew  = Controller.isLineBuilder? Controller._DataPrivateDict[LineID].Data : Controller._DataPrivate;
        let ItemPrev = Controller.isLineBuilder? Controller._DataDict[LineID].Data        : Controller._Data;
        let ValueNew  = Lure.GetProperty(ItemNew, Property);
        let ValuePrev = Lure.GetProperty(ItemPrev, Property);
        /* set editor value */
        const Editor = Lure.Select('.l-edit-editor', EditableElement);
        if (Editor) Editor.value = ValueNew;

        if (ValueNew === ValuePrev)
            return Lure.Editable.RemoveEdits(Controller.Owner);

        EditableElement.classList.remove('l-edit-editing');
        EditableElement.classList.remove('l-edit-changed');
        EditableElement.classList.add('l-edit-waiting');
        if (!EditableElement.classList.contains(Lure.Settings.Editable.ClassEditableForce))
        {
            EditableElement.innerHTML = EditableElement._innerHTML;
            Lure.Select('.l-edit-value',EditableElement).innerHTML = Controller.PropFormat[Property] ? Controller.PropFormat[Property](ValueNew, ItemNew) : ValueNew;
        }
        if (Controller.Type === 'proto'){
            return Controller.OnChange(Property, ValueNew, ValuePrev)
                .then((res)=>{
                    let isNum = Lure.isNumeric(res);
                    if ( (isNum && res > 0) || (!isNum && Boolean(res)) || res === void 0){
                        EditableElement.classList.remove('l-edit-waiting');
                        Controller.SetProperty(Property, Lure.GetProperty(ItemNew, Property), false);
                        //Controller.Refresh();
                        //Lure.Editable.RemoveEdits(Controller.Owner);
                        return;
                    }
                    EditableElement.classList.remove('l-edit-waiting');
                    Lure.Select('.l-edit-value',EditableElement).innerHTML = Controller.PropFormat[Property] ? Controller.PropFormat[Property](ValuePrev, ItemPrev) : ValuePrev;
                    console.error(`[Lure.Proto] Save Error. Property: "${Property}", Value: "${ValueNew}"`, '\n',Controller, '\n',e);
                })
                .catch((e)=>{
                    EditableElement.classList.remove('l-edit-waiting');
                    Lure.Select('.l-edit-value',EditableElement).innerHTML = Controller.PropFormat[Property] ? Controller.PropFormat[Property](ValuePrev, ItemPrev) : ValuePrev;
                    console.error(`[Lure.Proto] Save Error. Property: "${Property}", Value: "${ValueNew}"`, '\n',Controller, '\n',e);
                })
        }
        else if (Controller.Type === 'controller'){
            return Controller.LineSave(Controller._DataDict[LineID], Property, ValueNew, LineID)
                .then((res)=>{
                    let isNum = Lure.isNumeric(res);
                    if ( (isNum && res > 0) || (!isNum && Boolean(res)) || res === void 0){
                        EditableElement.classList.remove('l-edit-waiting');
                        if (Property === ''){
                            Controller._DataDict[LineID].Data = Lure.GetProperty(Controller._DataPrivateDict[LineID].Data, Property)
                        }else{
                            Lure.SetProperty(Controller._DataDict[LineID].Data, Property, Lure.GetProperty(Controller._DataPrivateDict[LineID].Data, Property));
                        }

                        //Lure.Editable.RemoveEdits(Controller.Owner);
                        Controller.OnChange('save', Controller._DataDict[LineID], Property);
                        return;
                    }
                    EditableElement.classList.remove('l-edit-waiting');
                    Lure.Select('.l-edit-value', EditableElement).innerHTML = Controller.PropFormat[Property] ? Controller.PropFormat[Property](ValuePrev) : ValuePrev;
                    console.error(`[Lure.Templator] Save Error. LineID: "${LineID}", Property: "${Property}", Value: "${Lure.GetProperty(ItemNew, Property)}"`, e, '\n',Controller);

                })
                .catch((e)=>{
                    EditableElement.classList.remove('l-edit-waiting');
                    Lure.Select('.l-edit-value', EditableElement).innerHTML = Controller.PropFormat[Property] ? Controller.PropFormat[Property](ValuePrev) : ValuePrev;
                    console.error(`[Lure.Templator] Save Error. LineID: "${LineID}", Property: "${Property}", Value: "${Lure.GetProperty(ItemNew, Property)}"`, e, '\n',Controller);
                })
        }
    }
};





//DialogBlur: null,                    //{string, jQuery, HTMLElement} - where blur on dialog
//DialogAnimation: 'lure-animation-dialog', //{string} -  css-animation class
//EditableClass:  'editable',
//EditableWaiting:  'editable-waiting',
Lure.Settings.Editable = {
    _CSSEditable: 'editable',
    _ClassEditable: 'editable',
    /**
     * @returns {string}
     */
    get ClassEditable(){
        return this._ClassEditable;
    },
    set ClassEditable(val){
        this._ClassEditable = val;
        Lure._CompileSmart.RegExp.Editable   = new RegExp(`<[^>]+class=['"][\\w\\d\\s-{}]*(${val})[\\w\\d\\s-{}]*['"][^>]*>([^<]*)<[^>]+>/`);
        Lure._CompileSmart.RegExp.EditRemove = new RegExp(`<[^>]+class=['"][\\w\\d\\s-{}]*(${this._ClassEditable}|${this._ClassRemovable})[\\w\\d\\s-{}]*['"][^>]*>([^<]*)<[^>]+>`, 'g');
    },
    _ClassRemovable: 'removable',
    /**
     * @returns {string}
     */
    get ClassRemovable(){
        return this._ClassRemovable;
    },
    set ClassRemovable(val){
        this._ClassRemovable = val;
        Lure._CompileSmart.RegExp.Editable   = new RegExp(`<[^>]+class=['"][\\w\\d\\s-{}]*(${val})[\\w\\d\\s-{}]*['"][^>]*>([^<]*)<[^>]+>/`);
        Lure._CompileSmart.RegExp.EditRemove = new RegExp(`<[^>]+class=['"][\\w\\d\\s-{}]*(${this._ClassEditable}|${this._ClassRemovable})[\\w\\d\\s-{}]*['"][^>]*>([^<]*)<[^>]+>`, 'g');
    },
    ClassEditableForce: 'editable-force',
    CSSEditableForce: 'editable-force',

    CSSEditing: 'l-edit-editing',
    CSSChanged: 'l-edit-changed',
    CSSWaiting: 'l-edit-waiting',

    ClassEditing: 'l-edit-editing',
    ClassChanged: 'l-edit-changed',
    ClassWaiting: 'l-edit-waiting',


    AutoSelect: true,
    AutoFocus: true,
};
/* make refresher template fields only*/
Lure._CompileSmart = {
    RegexpOperator: new RegExp(`{{#(each|if|endeach|endif)[^}]*}}`, 'i'),
    RegExp:{
        SpaceKiller:    new RegExp(`<\\/[\\w-]+>[^\\s]*(\\s{2,}[^\\S]*)<`, 'g'),
        _Parser:        new RegExp(`<[\\s\\S]*?>([\\s\\S]*)<[\\s\\S]*>`),
        DataLine:       new RegExp(`<[\\w ]+ [\\s\\S]*?({{#data-line}})[\\s\\S]*?>`, 'gi'),
        LineID:         new RegExp(`{{#LineID}}`, 'gi'),

        If:             new RegExp(`{{#if\\s+([^}]+)}}([\\s\\S]*?){{#endif}}`, 'gi'),
        IfInline:       new RegExp(`{{#if[\\s]*(\\([\\s\\S]+?\\)[\\s\\S]*?:[\\s\\S]*?)}}`, 'gi'),//new RegExp(`{{#if([\\s\\S]*?\\?[\\s\\S]*?:[\\s\\S]*?)}}`, 'gi'),
        IfInlineSelect: new RegExp(`{{#if([\\s\\S]*?)\\?[\\s\\S]*?}}`, 'gi'),//new RegExp(`{{#if([\\s\\S]*?\\?[\\s\\S]*?:[\\s\\S]*?)}}`, 'gi'),
        Each:           new RegExp(`{{#each\\s+([^}]+)}}`,'gi'),
        
        EditRemove:     new RegExp(`<[^>]+class=['"][\\w\\d\\s-#{()}.='":?\\\\>]*(editable|removable)[\\w\\d\\s-#{()}.='":?\\\\>]*['"][^>]*>([^<]*)<[^>]+>`, 'g'),//new RegExp(`<[^>]+class=['"][\\w\\d\\s-{}]*(editable|removable)[\\w\\d\\s-{}]*['"][^>]*>([^<]*)<[^>]+>`, 'g'),
        Editable:       new RegExp(`<[^>]+class=['"][\\w\\d\\s-#{()}.='":?\\\\>]*(editable)[\\w\\d\\s-#{()}.='":?\\\\>]*['"][^>]*>([^<]*)<[^>]+>`),//new RegExp(`<[^>]+class=['"][\\w\\d\\s-{}]*(editable)[\\w\\d\\s-{}]*['"][^>]*>([^<]*)<[^>]+>`),
        Removable:      new RegExp(`<[^>]+class=['"][\\w\\d\\s-#{()}.='":?\\\\>]*(removable)[\\w\\d\\s-#{()}.='":?\\\\>]*['"][^>]*>([^<]*)<[^>]+>`),//new RegExp(`<[^>]+class=['"][\\w\\d\\s-{}]*(removable)[\\w\\d\\s-{}]*['"][^>]*>([^<]*)<[^>]+>`),
        EditableInEach: new RegExp(`{{#each\\s+([^}]+)}}[\\s\\S]*<[^>]+class=['"][\\w\\d\\s-{}]*(editable|removable)[\\w\\d\\s-{}]*['"][^>]*>([^<]*)<[^>]+>[\\s\\S]*{{#endeach}}`, 'g'),
         
        Expression:     new RegExp(`{{([^#}]+)}}`, 'g'),
    },
    
    CompilePart: {
        /* Editable & Removable*/
        //helper preCompileEditable
        /**
         *
         * @param match
         * @param editable
         * @param content
         * @param ParentProp
         * @param Controller
         * @returns {*}
         */
        PlaceEditable(match, editable, content, ParentProp, Controller) {
            if (match.indexOf('data-property=')> -1)
                return match;

            let DataController = Controller ? `data-controller="${Controller.ID}"`: '';
            let matchingEditable  = (Lure._CompileSmart.RegExp.Editable).exec(match);
            let matchingRemovable = (Lure._CompileSmart.RegExp.Removable).exec(match);
            const rem  = matchingRemovable !== null ? `<div class="l-edit l-edit-icon l-edit-${Controller.Type} l-edit-btn-remove" ${DataController} data-line="{{__LineID}}" title="${Lure.Culture.Lang.Remove}"></div>` : '';
            const edt  = matchingEditable  !== null ? `<div class="l-edit l-edit-icon l-edit-${Controller.Type} l-edit-btn-edit"   ${DataController} data-line="{{__LineID}}" title="${Lure.Culture.Lang.Change}"></div>` : '';
            match = match.replace(/<[\s\S]+?(>)/, function (a, b) {
                return a.replace(b, ` data-line={{__LineID}} data-property="${ParentProp? ParentProp+'[{{j}}].':''}${content.replace('{{','').replace('}}','')}" ${DataController}>`);
            });
            Controller.isEditable  = matchingEditable  ? true: Controller.isEditable;
            Controller.isRemovable = matchingRemovable ? true: Controller.isRemovable;
            //if (content.indexOf('Status')>-1) debugger;
            return match.replace(new RegExp(`>[^<]*(${content.replace(/\$/g, "\\$")})[^>]*</`), function(m, ctn){
                return m.replace(ctn, `<div class="l-edit-container l-row l-flex-between l-flexa-center l-flex-100"><div class="l-edit l-edit-value" data-line="{{__LineID}}" ${DataController}>${content}</div><div class="l-edit l-edit-controls">${edt}${rem}</div></div>`)
            });
        },
        // helper preCompileEditable
        MakeEditable(s, ParentProp, Controller) {
            return s.replace(Lure._CompileSmart.RegExp.EditRemove, function (match, editable, content) {
                return Lure._CompileSmart.CompilePart.PlaceEditable(match, editable, content, ParentProp, Controller)
            });
        },
        // Check ListItem Editable
        Editable(s, Controller){
            //if (Controller && Controller.ID === 165) debugger;
            //check for Editable in #each
            s = s.replace(Lure._CompileSmart.RegExp.EditableInEach, function (match, editable, content) {
                //let ParentProp = match.match(/{{#each\s+([^}]+)}}/)[1];
                //TODO bug with parent prop if editable after #endeach
                return Lure._CompileSmart.CompilePart.MakeEditable(match, '', Controller);
            });
            s = Lure._CompileSmart.CompilePart.MakeEditable(s, false, Controller);
            return s;
        },
        /* #if (big) */

        If(s, Controller) {
            return s.replace(/#IF/g, '#if')
                    .replace(/#ENDIF/g, '#endif')
                    .replace(Lure._CompileSmart.RegExp.If, function (bkt, condition, expression ) {
                        condition = condition
                            .replace(/&gt;/g,  ">")
                            .replace(/&lt;/g,  "<")
                            .replace(/#less/gi, "<")
                            .replace(/#more/gi, ">")
                            .replace(/&amp;/g, "&")
                            .replace(/\\'/g,   '"')
                            .replace(/#or/gi,  " || ")
                            .replace(/#and/gi, " && ");
                    return `\`+
/* OUTER "IF" */
(function($this){
if (${(Lure._CompileSmart.CompilePart.Prepare(condition, Controller))}) {
    return \`${expression}\`;
}
return '';
}).call(this, $this)+\``;
                });
        },

        /* #if (inline) */
        IfInline(s){
            s = s.replace(Lure._CompileSmart.RegExp.IfInline, function (s, condition) {
                condition = condition
                    .replace(/&gt;/g,  ">")
                    .replace(/&lt;/g,  "<")
                    .replace(/#less/gi, "<")
                    .replace(/#more/gi, ">")
                    .replace(/&amp;/g, "&")
                    //.replace(/\|/g,    '"')
                    .replace(/\\'/g,   '"')
                    .replace(/#or/gi,  " || ")
                    .replace(/#and/gi, " && ");
                return `\`+
/* LOCAL "IF" */
(function(){
    return (${condition}); 
    return '';}).call(this)+\``;
            });
            return s;
        },

        Each(s, Controller){
            let spaces = "    ";
            let EachList = s.match(Lure._CompileSmart.RegExp.Each);
            let lvl = 0;
            if (EachList !== null){
                for (let i = EachList.length-1; i >= 0; i--){
                    let current = EachList[i];
                    let isInnerEach = false;
                    lvl++;
                    let StartPoint = s.indexOf(current);
                    let EndPoint   = s.indexOf("{{#endeach}}", StartPoint);

                    let prevStarts = s.slice(0, StartPoint).match(Lure._CompileSmart.RegExp.Each);
                    prevStarts = prevStarts!==null ? prevStarts.length: 0;
                    let prevEnds = s.slice(0, StartPoint).match(/{{#endeach}}/g);
                    prevEnds = prevEnds!==null ? prevEnds.length: 0;
                    if ( (prevStarts > prevEnds ))
                    {
                        isInnerEach = true;
                        lvl = 0;
                    }
                    ////
                    let string_Each = s.slice(StartPoint, EndPoint+12);
                    let expression  = string_Each.slice(current.length, string_Each.length-12);
                    let ObjectName = current.replace(/{{#each\s+([\s\S]+)}}/, function(a,name){
                        return name;
                    });
                    ObjectName = Lure._CompileSmart.CompilePart.CheckProperty(ObjectName, Controller);
                    //the each template
                    let eachComplied = '`+' +
                        spaces.repeat(lvl)+'/* EACH */(function(inner, $parent){                                                                   \r\n' +
                        spaces.repeat(lvl)+'    if (!inner || inner === "'+Lure.Settings.Controller.Common.Undefined+'" || (Object.keys(inner).length === 0 && inner.constructor === Object && isNaN(inner)))   \r\n' +
                        spaces.repeat(lvl)+'        return "";                                                                                     \r\n' +
                        spaces.repeat(lvl)+'    let string_result= "";                                                                             \r\n' +
                        spaces.repeat(lvl)+'    for(let j = 0; j < inner.length; j++){                                                             \r\n' +
                        spaces.repeat(lvl)+'        let $this = inner[j];                                                                          \r\n' +
                        spaces.repeat(lvl)+'        let o = inner[j];                                                                              \r\n' +
                        spaces.repeat(lvl)+'        string_result = string_result + \`'+Lure._CompileSmart.CompilePart.Prepare(expression, Controller) + '\`; \r\n' +
                        spaces.repeat(lvl)+'    }                                                                                                  \r\n' +
                        spaces.repeat(lvl)+'    return string_result;                                                                              \r\n' +
                        spaces.repeat(lvl)+'}).call(this,'+ObjectName+', {$parent: typeof $parent !== "undefined"?$parent:null, $this: $this, i: i} ) +`         ';
                    s = s.replace(string_Each, eachComplied)

                }
            }
            return s;
        },


        /* Common Parsing */
        CheckProperty(ObjectName, Controller) {
            //ok check if it's expression
            //ObjectName = ObjectName.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
            function checking(c) {
                let s = c;//.replace(/\s/g, "");
                //open bracket
                let OpenBracket  = '';
                let CloseBracket = '';
                let Anti = ''; // IsEnabled - !IsEnabled
                if (s.match(/^\(([^(]*)$/) !== null){
                    s=s.substring(1);
                    OpenBracket = "(";
                }
                if ( /^([^)]*)\)$/.test(s)){
                    s=s.substring(0, s.length-1);
                    CloseBracket = ")";
                }
                if (s.trim().indexOf("!") === 0){
                    Anti = '!';
                    s = s.replace('!', '');
                }
                // if (Controller.ID === 33 && s.indexOf('!IsEnabled') > -1)
                //     ;//debugger;
                //if (c.indexOf('QuanReturn')> -1)
                //    debugger;
                //if(s.indexOf('this.') > -1) debugger;
                let containsSpecialObject = (s.indexOf('$item')> -1 || s.indexOf('$this') > -1 || s.indexOf('$parent') > -1 ) ;
                let containsSpecialObjectTreeBuiler = (s.indexOf('$index')> -1 || s.indexOf('$j')> -1 || s.indexOf('$key') > -1 || s.indexOf('$lvl') > -1 || s.indexOf('$g.') > -1 || s.trim().indexOf('this.') === 0 ) ;
                let isSpecialSymbol = (s === "?" || s.indexOf("=") > -1 || s.indexOf(">") > -1|| s.indexOf("<") > -1);
                let isString = s.match(/^["'\\][\s\S]*["'\\]$/) !== null;
                let isIteratorOrLineID = s === "i" || s === "j" || s === '__LineID';
                let isNumber = !isNaN(s);
                if (containsSpecialObject || containsSpecialObjectTreeBuiler || isIteratorOrLineID || isNumber || isString ||isSpecialSymbol){
                    if (s.indexOf('$g.') > -1){ //if global object
                        return OpenBracket+Anti+s.replace('$g.', '');
                    }
                    return c;
                }
                //if (c.indexOf('DateOperation228')>-1) debugger;
                //if (!!Controller && Controller.Owner.Name === 'RepairCurrent') debugger;

                if (!!Controller && Controller.PropFormat && Controller.PropFormat[s]  /* && false */){
                    //return OpenBracket +Anti+`this.${Lure.String.Capitalize(Controller.Type)}.PropFormat["${s}"].call(this, o.${s}, $this)`+CloseBracket;
                    return OpenBracket +Anti+`__Controller.PropFormat["${s}"].call(this, o.${s}, $this)`+CloseBracket;
                }

                return (OpenBracket+`((typeof o.${s} !== 'undefined')? ${Anti}o.${s}:"${Lure.Settings.Controller.Common.Undefined}")`+CloseBracket);
                //return (OpenBracket+"o."+s);
            }
            ObjectName = ObjectName.replace(/[^\-+\/%*]+/g, function (c) {
                let parent = c.match(/&/g);
                if (parent !== null){
                    for (let i = 0; i < parent.length; i++){
                        if (i < parent.length-1)
                            c = c.replace('&', "$parent");
                        else
                            c = c.replace('&', "$parent.$this");
                    }
                    return c;
                }
                else {
                    return checking(c);
                }
            });
            ObjectName = ObjectName.replace(/\\'/g,"'");
            ObjectName = "("+ObjectName+")"; //fucking concatenation shell
            return ObjectName;
        },
        CheckPropertyE(ObjectName, Controller) {
            let Special = ['this', '$item', '$this', '$parent', '$g', '__LineID', 'i' ,'j', //'$global',
                '$index', '$j', '$key', '$lvl'];                //TreeBuilder's
            let Func = 0;                   //function count(level) like f(g(p(x,y))) - 3
            let Word = '';                  //property or number or const string
            let Splitters = '+-*/^<>?:|&%= ,';
            let Quotes = '`"\'';
            let isString = false;
            let isFunc   = false;

            let Result = '';
            function isParam(word) {
                return word.trim().length>0                        //not empty
                    && Special.indexOf(word.split('.')[0]) < 0  //if not special word
                    && !Lure.isNumeric(word)                    //not a number
                //&& "()".indexOf(word.trim()) < 0            //kurwa?
                //&& !isString
            }
            function FinishWord(Ch) {
                if (!isString){
                    if (isParam(Word)){ //is param
                        //debugger;
                        if (!!Controller && Controller.PropFormat && Controller.PropFormat[Word])
                            Word = `this.${Lure.String.Capitalize(Controller.Type)}.PropFormat["${Word}"].call(this, o.${Word}, $this)`;
                        else
                            Word = `((typeof o.${Word}!==typeof void 0)?o.${Word}:"${Lure.Settings.Controller.Common.Undefined}")`;
                    }
                    Result += Word;
                    Word = '';
                    if (Ch !== ' ')
                        Result += Ch;
                }else{
                    Word +=Ch;
                    Result += Word;
                    Word = '';
                    isString = false
                }
            }
            for (let i = 0; i < ObjectName.length; i++){
                let Ch = ObjectName.charAt(i);
                //string check
                if (Quotes.indexOf(Ch) > 0){
                    if (isString){
                        if (Ch === Word.charAt(0) && (i>0 && ObjectName.charAt(i-1) !== '\\')){
                            FinishWord(Ch);
                            continue;
                        }
                        else if (Ch === Word.charAt(0) && (i>0 && ObjectName.charAt(i-1) === '\\')){
                            Word = Word.substring(0, Word.length-1);
                            Word += Word.charAt(0);
                            continue;
                        }
                    }else{
                        isString = true;
                        Word += Ch;
                        continue;
                    }
                }
                //if sting quote opened before
                if (isString){
                    Word += Ch;
                    continue;
                }
                if (Splitters.indexOf(Ch) < 0){   //if not splitter character
                    /*bracket test: function caller or just brackets*/
                    if (Ch === '(' && !isString){
                        if (i > 0 && Splitters.indexOf(ObjectName.charAt(i-1)) < 0){
                            isFunc = true;
                            Func++;
                            FinishWord(Ch);
                        }
                        else{
                            Result += Ch;
                        }
                    }
                    else if (Ch === ')' && !isString){
                        if (Func>0){
                            Func--;
                        }
                        FinishWord(Ch);
                    }
                    else {
                        Word += Ch;
                    }
                }
                else{
                    FinishWord(Ch);
                }
            }
            //last word commit
            FinishWord('');
            return Result;
        },
        Prepare(c, Controller){
            //c = Lure._CompileSmart.CompilePart.IfInline(c, Controller);
            return c.replace(Lure._CompileSmart.RegExp.Expression, function(bkt, expression){
                return '${'+Lure._CompileSmart.CompilePart.CheckProperty(expression,Controller)+'}';
            })
        },

        /**
         *
         * @returns {string}
         */
        FnString(){
            return `if (!p)
    p = {};
var i = p.i ? p.i : 0;
var j = p.j ? p.j : 0;
var length = p.length;
var __LineID = typeof p.LineID !== 'undefined' ? p.LineID : null;
var __Controller = p.Controller;
var $this = o;
var $item = o;
var $num = i+1;
var $denum = length-i;
//TreeBuilder's
var $index = p.$index;
var $key = p.$key;
var $lvl = p.$lvl;
var $j   = p.$j;
var string_Result = "";
if (o === undefined || (!p.RenderAnyway && Object.keys(o).length === 0 && o.constructor === Object && isNaN(o)) ) 
    return '';
return \``
        },
    },
    Compile(DomString, Controller){
        //let ControllerID = Controller.ID;
        let fns = Lure._CompileSmart.CompilePart.FnString();

        DomString = DomString.replace(Lure._CompileSmart.RegExp.LineID, '{{__LineID}}');
        DomString = DomString.replace(Lure._CompileSmart.RegExp.DataLine, (m, dataline)=>{
            return m.replace(dataline, 'data-line="{{__LineID}}"');
        });


        DomString = DomString.replace(/[\n]+/g, " ").replace(/[ ]{2,}/g, ' ');

        //shell '
        DomString = DomString.replace(/'/g, "\\'");
        //DomString = DomString.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
        DomString = DomString.replace(Lure._CompileSmart.IfInlineSelect, function(match, b){
            return match.replace(b, '&lt;');
        });

        DomString = Lure._CompileSmart.CompilePart.Editable(DomString, Controller);
        DomString = Lure._CompileSmart.CompilePart.IfInline(DomString, Controller);
        DomString = Lure._CompileSmart.CompilePart.If(DomString, Controller);
        DomString = Lure._CompileSmart.CompilePart.Each(DomString, Controller);

        DomString = Lure._CompileSmart.CompilePart.Prepare(DomString, Controller);

        
        fns += DomString +'`;';
        fns = fns
                .replace(/`/g, `'`)
                .replace(/\${([^}]*)}/g, function(match, val){
                    return `'+${val}+'`
                });

        let function_f;
        try {
            function_f = new Function('o', 'p', fns);
            function_f({},{});
        }
        catch (e){
            console.info(fns);
            console.error(e);
        }
        //console.log('Compiled:');
        //console.log(f);
        return function_f;
    },

    GetContentElements(HTMLContent){
        let x = Lure.SelectAll('*:not(g):not(path):not(clipPath):not(text):not(br)', HTMLContent)
            .Where(()=>true); //trick for get normal array
        x.push(HTMLContent);
        return x;
    },

    /**
     * @returns {string}
     **/
    TagScreen(DOMString){
        return DOMString.replace(/</g,'lt;').replace(/>/g,'gt;')
    },

    /**
     * @returns {string}
     **/
    TagUnscreen(DOMString){
        return DOMString.replace(/lt;/g,'<').replace(/gt;/g,'>')
    },
    TableScreen(DOMString){
        return DOMString.replace(/<\/?(tr|td|th|thead|tbody|table)[^>]*>/gi, (tag, tagName)=>{
            return tag.replace(tagName, `l-${tagName}`)
        })
    },
    TableUnscreen(DOMString){
        return DOMString.replace(/<\/?(l-tr|l-td|l-th|l-thead|l-tbody|l-table)[^>]*>/gi, (tag, tagName)=>{
            return tag.replace('l-','');
        })
    },
    FilterEachIf(s){
        let EachList = [];
        let IfList = [];
        let each = Lure._CompileSmart.RegExp.Each.exec(s);
        let aif =  Lure._CompileSmart.RegExp.If.exec(s);
        while(each !== null){
            EachList.push(each);
            each = Lure._CompileSmart.RegExp.Each.exec(s);
        }
        while(aif !== null){
            IfList.push(aif);
            aif = Lure._CompileSmart.RegExp.If.exec(s);
        }

        //let EachList = s.match(Lure._CompileSmart.RegExp.Each);
        let lvl = 0;
        if (EachList.length > 0){
            for (let i = EachList.length-1; i >= 0; i--){
                let current = EachList[i];
                let isInnerEach = false;
                //lvl++;
                let StartPoint = current.index;
                let EndPoint   = s.indexOf("{{#endeach}}", StartPoint);

                let prevStarts = s.slice(0, StartPoint).match(Lure._CompileSmart.RegExp.Each);
                prevStarts = prevStarts!==null ? prevStarts.length: 0;
                let prevEnds = s.slice(0, StartPoint).match(/{{#endeach}}/g);
                prevEnds = prevEnds!==null ? prevEnds.length: 0;

                //console.warn(`i:${i}, lvl:${lvl}`);
                //console.warn(s.slice(StartPoint, EndPoint+12));

                if ( lvl > 0){
                    let x = lvl;
                    for (let l = 0; l < x; l++){
                        EndPoint   = s.indexOf("{{#endeach}}", EndPoint+12);
                        lvl--;
                    }
                    //console.error(s.slice(StartPoint, EndPoint+12));
                }

                if ( (prevStarts > prevEnds ))
                {
                    isInnerEach = true;
                    lvl += prevStarts - prevEnds;
                    //lvl++;
                    // TOD CHECK FOR BUG WHEN INNER EACH 17.08.2018.. seems like wokrs properly
                    // upd. no repro
                }
                let string_Each = s.slice(StartPoint, EndPoint+12);
                s = s.replace(string_Each, Lure._CompileSmart.TagScreen(string_Each))
            }
        }
        lvl = 0;
        if (IfList !== null){
            for (let i = IfList.length-1; i >= 0; i--){
                let current = IfList[i];
                let isInnerIf = false;
                let StartPoint = current.index;
                let EndPoint   = s.indexOf("{{#endif}}", StartPoint);

                let prevStarts = s.slice(0, StartPoint).match(Lure._CompileSmart.RegExp.Each);
                prevStarts = prevStarts!==null ? prevStarts.length: 0;
                let prevEnds = s.slice(0, StartPoint).match(/{{#endif}}/g);
                prevEnds = prevEnds!==null ? prevEnds.length: 0;

                if ( lvl > 0){
                    let x = lvl;
                    for (let l = 0; l < x; l++){
                        EndPoint   = s.indexOf("{{#endif}}", EndPoint+10);
                        lvl--;
                    }
                }
                if ( prevStarts > prevEnds ) {
                    isInnerIf = true;
                    lvl += prevStarts - prevEnds;
                }
                let string_If = s.slice(StartPoint, EndPoint+10);
                s = s.replace(string_If, Lure._CompileSmart.TagScreen(string_If))
            }
        }
        return s;
    },
    FilterOpetators(DOMString){
        let s = DOMString;

        //return s;
        return s.replace(/{{#(each|if)[\w\s.()]*?}}([\s\S]*?){{#end(each|if)}}/gi, (match,name,inner)=>{
            return match.replace(inner, Lure._CompileSmart.TagScreen(inner));
        })
    },
    GenField: function(element, Controller){
        let ControllerID = Controller.ID;
        let Attributes = element.attributes;
        let Property = {
            LSElementID: element.attributes['data-lsmarti'].value,
            Attributes: {},
            InnerHTML: null
        };
        let Count = 0;
        for (let i = 0; i < Attributes.length; i++){
            if (Attributes[i].value.indexOf('{{') > -1){
                Property.Attributes[Attributes[i].name] = Lure._CompileSmart.Compile(Attributes[i].value,  Controller);
                Count++;
            }
        }
        let inner = element.innerHTML.replace(/[\s]*/g,'');
        /*if (inner.indexOf('{{#each') > -1)
            debugger;*/
        
        const isSelf = ( (element.childNodes.length < 1 || element.childNodes.length < 2 && element.childNodes[0] && element.childNodes[0].constructor.name.toLowerCase() === 'text') && inner.indexOf('{{') > -1);      //2 because first childNode is 'text'
        const isConsistsDiff = (inner.substring(0, 7).toLowerCase()  === '{{#each') || (inner.substring(0, 5).toLowerCase() === '{{#if');

        //if (element.classList.contains('ksks') || element.tagName.toLowerCase() === 'input') debugger;
        //TODO need test

        if ( isSelf || isConsistsDiff ){
            //<input([\s]*[\w\d]+=("|')[^"]*("|'))*[\s]*(({{[^{}]+}})([\s]*[\w\d]+=("|')[^>]*("|'))*)>
            /*if (element.classList.contains(Lure.Settings.Editable.ClassRemovable)){
                Controller.isRemovable = true;
            }*/

           /*
             //TODO find out for wat this code is needed
             //seems like it wraps inpunts and options for rerender it on refresh
           if (inner.indexOf('<input') > -1 || inner.indexOf('<option') > -1)
            {
                console.log('<>input|option   ->', inner);
                //debugger;
                //let ds = (inner.replace(/[\w\d]+=("|')[^"]*("|')/g, '').indexOf("{{") > -1);
                let inputs = Lure.SelectAll('input, option', element);
                for (let i = 0; i < inputs.length; i++){
                    let NewElem = Lure.CreateElementFromString(`<span></span>`);
                    let Outer = inputs[i].outerHTML;
                    element.insertBefore(NewElem, inputs[i]);
                    inputs[i].remove();
                    //FIXME input add to renderlist
                    Properties.push({
                        HTMLElement: NewElem,
                        Attributes: {},
                        InnerHTML: Lure._CompileSmart.Compile(Outer,  Controller)
                    });
                }
            }
            else */
           if (element.classList.contains(Lure.Settings.Editable.ClassEditable) || element.classList.contains(Lure.Settings.Editable.ClassRemovable) ){
                element = Lure.CreateElementFromString( Lure._CompileSmart.CompilePart.Editable(element.outerHTML, Controller)   );
                Property.InnerHTML = Lure._CompileSmart.Compile(element.innerHTML,  Controller);
            }
           else {

               let innerHTML = Lure._CompileSmart.TagUnscreen(element.innerHTML);
               element.innerHTML = '';
               Property.InnerHTML = Lure._CompileSmart.Compile(innerHTML,  Controller);
           }
           Count++;
           /*if (isConsistsDiff){
               //let ng = Lure.SelectAll('*', element).ToList();
               //this._NonGrata = this._NonGrata.concat(ng);
               element.innerHTML = '';
           }*/
        }
        return (Count>0) ? Property : null
    },
    GenFields: function(DOMElements, Controller){
        let Properties = [];
        let NonGrata = [];
        for( let i = 0; i < DOMElements.length; i++){
            let x = Lure._CompileSmart.GenField(DOMElements[i], Controller);
            if (x){
                Properties.push(x);
            }
        }
        return Properties;
    },

    SetUp(DOMString){
        return DOMString.replace(/<[\w-_]+ ?/g, (tag)=>{
            return `${tag} data-lsmarti="${Lure.GetID()}" `;
        })
    },
};
Lure.Compile = function(DomString, Controller){
    return Lure._CompileSmart.Compile(DomString, Controller);
};
Lure.CompileSmart = function(DOMString, Controller=null, Lazy=true){
    // if (Controller && Controller.ID === 1801)//992
    //     debugger;
    DOMString = Lure._CompileSmart.FilterEachIf(DOMString);
    DOMString = Lure._CompileSmart.FilterOpetators(DOMString);
    DOMString = Lure._CompileSmart.TableScreen(DOMString);
    DOMString = Lure._CompileSmart.SetUp(DOMString);
    //console.log(Screened);
    
    let DOMElement = Lure.CreateElementFromString(DOMString);
    //console.log('DOMElement', DOMElement);
    //let _Compiled = Lure.Compile(Lure._CompileSmart.TagUnscreen(DOMString), true, Controller);
    //if (DOMString.indexOf('dfdfx')>-1)
    //    debugger;


    let _Compiled = Lure._CompileSmart.Compile(
            Lure._CompileSmart.TagUnscreen(DOMString), Controller
        ).bind(Controller.Owner);


    let DOMElements = Lure._CompileSmart.GetContentElements(DOMElement);
    let Properties  = Lure._CompileSmart.GenFields(DOMElements, Controller);
    
    const TagName = Controller ? Controller.Target.tagName : 'div';
    let Smart = {
        _Components: Properties,
        _Compiled: _Compiled,
        Template: Lure._CompileSmart.TagUnscreen(DOMString),
        GetContext(LureContent, Element){
            let PropsCloned = [];
            for (let i = 0; i < Properties.length; i++){
                PropsCloned[i] = {
                    LSElementID: Properties[i].LSElementID,
                    InnerHTML: Properties[i].InnerHTML,
                };
                PropsCloned[i].Attributes = {};
                for (let k in Properties[i].Attributes){
                    PropsCloned[i].Attributes[k] = Properties[i].Attributes[k];
                }
            }
            let Ctx = {
                _Components: PropsCloned,
                _TargetElement: Element,
                _LureContent: LureContent,
                
                Refresh(o, p={}){

                    let Cs = this._Components;
                    for (let i = 0; i<Cs.length;i++){
                        if (!Cs[i].LSElement || !this._TargetElement.contains(Cs[i].LSElement)){
                            Cs[i].LSElement = Lure.Select(`[data-lsmarti="${Cs[i].LSElementID}"]`, this._TargetElement);
                            Cs[i].LSElement = Cs[i].LSElement !== null ? Cs[i].LSElement:this._TargetElement;

                            //here can be some elements in #if block, and on refresh may be  don't render:
                            Cs[i].LSElement = Cs[i].LSElement.dataset['lsmarti'] === Cs[i].LSElementID ? Cs[i].LSElement : null
                        }
                        if (Cs[i].LSElement){

                            if (Cs[i].InnerHTML){
                                Cs[i].LSElement.innerHTML = Cs[i].InnerHTML.call(this._LureContent, o,p);
                            }
                            for (let key in Cs[i].Attributes){
                                if (Cs[i].Attributes.hasOwnProperty(key)){
                                    if (key === 'value'){
                                        Cs[i].LSElement.value = Cs[i].Attributes[key].call(this._LureContent, o,p);
                                    }
                                    else if (key === 'checked' || key === 'disabled' || key === 'selected'){
                                        let val = Cs[i].Attributes[key].call(this._LureContent, o,p);
                                        if (Lure.PropTypes.TryParse(Lure.PropTypes.Bool, val) || val.toLowerCase() === key)
                                            Cs[i].LSElement[key] = true;
                                        else
                                            Cs[i].LSElement[key] = false;
                                    }
                                    else{
                                        Cs[i].LSElement.setAttribute(key, Cs[i].Attributes[key].call(this._LureContent, o,p) );
                                    }
                                }

                            }
                        }

                    }
                }
            };
            if (!Controller.isLineBuilder){
                Ctx.FieldAdd = function(DOMElement) {
                    DOMElement.setAttribute('data-lsmarti', Lure.GetID());
                    //if (Lure._CompileSmart.GenField(DOMElement, Controller) === null)
                    //    debugger;
                    let x = Lure._CompileSmart.GenField(DOMElement, Controller);
                    if (x){
                        x.LSElement = DOMElement;
                        this._Components.push(x);
                    }
                    
                };
            }
            return Ctx;
        },
        
        GenElement(o,p={}){
            return Lure.CreateElementFromString(Lure._CompileSmart.TableUnscreen(_Compiled(o,p)), TagName)
        },
        GenLine(o, p={}){
            return Lure._CompileSmart.TableUnscreen(_Compiled(o,p));
        },
        
    };
    return Smart;

};
Lure.Controller.TemplatorProto = class LProto{
    Refresh(NewData){
        this._Refresh(NewData)
    }
    get Data(){
        return this._Data;
    }
    set Data(d){
        this._DataInit(d);
        //this._DataChanged++;
        //this._Data = this.Settings.DataClone ? Lure.Clone(d) : d;
    }
    SetProperty(Property, Val){
        Lure.SetProperty(this._Data, Property, Val);
        if (this.PropTypes[Property])
            Lure.PropTypes.CheckProp(this._Data, this.PropTypes[Property], Property);
        Lure.SetProperty(this._DataPrivate, Property, Lure.Object.Clone(Lure.GetProperty(this._Data, Property)));
        this._Refresh();
    }
    GetProperty(Property){
        if (!Property){
            return this._Data;
        }
        return Lure.GetProperty(this._Data, Property);
    }
    FieldAdd(element){
        this.Context.FieldAdd(element)
    }

    get isController(){
        return false;
    }
    constructor({
        Target          = null,
        Content         = null,
        Data            = {},
        DataClone       = false,
        Owner           = null,           //Lure.Content, which owns this Controller
        OnChange        = ()=>{return Promise.resolve(true)},
        BeforeBuild     = ()=>{},
        AfterBuild      = ()=>{},
        PropTypes       = {},
        PropFormat      = {},

                }={}){
        this.ID = Lure.GetID();
        this.Type = 'proto';
        this.Owner = Owner ? Owner : this;
        this.OnChange = OnChange.bind(this.Owner);


        this.Settings = {};
        this.Settings.isDataClone = DataClone;

        this.isEditable = false;

        this.Target = Lure.Select(Target, Owner ? Owner.Target : document);

        

        this._Data = null;
        this._DataPrivate = null;//Lure.Clone(Data); //data state between change and confirm changes
        
        this._DataInit = (d)=>{
            if (!d)
                return;
            this._Data = this.Settings.isDataClone ? Lure.Clone(d) : d;
            this._DataPrivate = Lure.Clone(this._Data);  //data with unconfirmed changes
            //DataChanged++;
        };
        this.Data = Data;                   //fact real data.

        //this.PropTypes = GetPropTypes(Data);
        this.PropTypes = PropTypes;
        this.PropFormat = PropFormat;
    
    
        /* Init */
        this._SmartRender = Lure.CompileSmart(Content, this);
        //this.Content = this._SmartRender.GenElement(Data);
        this._Refresh = (newData)=>{
            this.Data = newData;
            Lure.PropTypes.Check(this.PropTypes, this._Data);
           
            BeforeBuild.call(this);
            this.Context.Refresh(this.Data, {LineID: null, Controller: this});
            Lure.Editable.EditableForceRefresh(this);
            let P = this.Owner._PermissionRules;
            if (P)
                P.Check();
            AfterBuild.call(this);
        };
        
        if (this.isEditable){
            Lure.Editable.ListenEditable(this.Owner, this);
        }
    }
};






















/**
 *
 * @typedef {object} DataItemType
 * @property {number} LineID
 * @property {object} Data
 * @property {HTMLElement} DOM
 */




class Templator{
    Refresh(NewList){
        return this._Refresh(NewList)
    }
    RefreshOne(Delegate){
        return this._RefreshOne(Delegate);
    }
    get Data(){
        return this._Data.Select(x=>x.Data)
    }
    set Data(NewList){
        this._DataInit(NewList);
    }

    get DataRender(){
        return this._DataRender.Select(x=>x.Data)
    }
    /**
     *
     * @return {DataItemType[]}
     */
    get DataItems(){
        return this._Data;
    }
    Filter(Delegate, isSaveState){
        return this._Filter(Delegate, isSaveState);
    }
    Sort(Delegate, isSaveState){
        return this._Sort(Delegate, isSaveState);
    }
    get Items(){
        return this.Content.children.Where(x=>x.classList.contains("l-t-line"))
    }
    Add(Item, isPrepend){
        return this._Add(Item, isPrepend);
    }
    Edit(Line, Prop, Val){
        return this._Edit(Line, Prop, Val);
    }
    Remove(ItemOrLineID, isLocal){
        return this._Remove(ItemOrLineID, isLocal);
    }


    /**
     *
     * @param LineID
     * @param Property
     * @param Val
     * @param isRefresh
     */
    SetProperty(LineID, Property, Val, isRefresh=true){
        LineID = parseInt(LineID);
        let DataItem = this._Data.Where(c=>c.LineID === LineID).FirstOrDefault();
        if (!DataItem)
        {
            return Lure.System.Error(`Can not set property of unknown LineID (${LineID})`);
        }
        Lure.SetProperty(DataItem.Data, Property, Val);
        if (this.PropTypes[Property])
            Lure.PropTypes.CheckProp(DataItem, this.PropTypes[Property], Property);
        if (isRefresh)
            this._Refresh(LineID);
        /*
        Lure.SetProperty(this._Data.Select(c=>c.Data), Property, Val);
        let i = Property.match(/\[([\d]+)\]/)[1];
        let prop = Property.replace(/\[[\d]+\]\./,'');
        if (this.PropTypes[prop])
            Lure.PropTypes.CheckProp(this._Data, this.PropTypes[prop], Property);
        if (isRefresh)
            this._Refresh(i);*/
    }
    GetProperty(Property){
        return Lure.GetProperty(this._Data.Select(c=>c.Data), Property);
    }

    /**
     * @param LineID
     * @returns {?object}
     */
    GetItemByLineID(LineID){
        return this._Data.Where(x=>x.LineID === LineID).Select(x=>x.Data).FirstOrDefault();
    }
    /**
     * @param {number} LineID
     * @returns {?DataItemType}
     */
    GetDataItemByLineID(LineID){
        LineID = parseInt(LineID);
        return this._Data.Where(x=>x.LineID === LineID).FirstOrDefault();
    }
    /**
     * @param {function} Delegate
     * @returns {?DataItemType}
     */
    GetDataItemByDelegate(Delegate){
        return this._Data.Where(x=>Delegate(x.Data)).FirstOrDefault();
    }
    /**
     * @param {number} LineID
     * @returns {?DataItemType}
     */
    GetPrivateDataItemByLineID(LineID){
        if (this._DataPrivateDict[LineID] === void 0)
            return null;
        return this._DataPrivateDict[LineID]
    }

    /** @return {boolean} */
    get isController(){
        return true;
    }
    /** @return {boolean} */
    get isLineBuilder(){
        return true;
    }
    constructor(
        {
            Target       = null,                           //{HTMLElement}
            Data         = [],                             //{object}, {array} - if object Templator would be refresh, if array - rebuild
            DataClone    = false,                          //{bool},  - set true if need undepend on another Content's data
            DataType     = {},                             //{object},  - defines  Data[] -> Data<DataType>
            PropTypes    = {},
            PropFormat   = {},
            ListElement  = ".list_element",                //{string} - dom string
            ListElementEmpty = null,                       //{string} - render instead ListElement if Data.length === 0
            EmptyMessage = "",                             //{string} - ListElement.innerHTML if Data.length === 0 and ListElementEmpty != null
            EmptyVisible = true,                           //{bool} - Templator.Content would be hidden if (Data.length === 0)

            Pagination = {},


            LineSave   = (DataItem)=>{return Promise.resolve(DataItem)},   //calls before commit changes to Data
            LineAdd    = (DataItem)=>{return Promise.resolve(DataItem)},   //calls before commit new item to Data
            LineRemove = (DataItem)=>{return Promise.resolve(DataItem)},   //calls before commit deleting item from Data
            CSSWaiting = Lure.Settings.Editable.CSSWaiting,

            NoBuild = false,

            BeforeBuild = function(){},
            AfterBuild = function(){},
            AfterAdd = function(){},
            OnChange = function(){},                       //{function} Calls on Edit, Add, Remove data
            Owner = null,                                  //Lure.Content, which owns this Controller
            Debug = true

        } = {}) {
        this.ID = Lure.GetID();
        this.Type = 'controller';
        this.isEditable  = false; //if true contains editable elements in line
        this.isRemovable = false; //if true data line is able to be removed
        this._NoBuild = NoBuild;


        this.Owner   = Owner ? Owner : this;
        this.Content = Owner && Owner.Select ? Owner.Select(Target) : Lure.Select(Target);
        this.Target  = this.Content;
        if (!this.Target){
            throw new Error(`[Lure.Controller] Error. Target is null (${Target}) in "${Owner? Owner.Name:'null'}"`);
        }
        this.Target.classList.add('l-t-content');

        /* Get Settings */
        this.Settings = Lure.Clone(Lure.Settings.Controller.Templator);

        this.Settings.Pagination.PageSize         = typeof Pagination.PageSize         !== 'undefined' ? Pagination.PageSize         : this.Settings.Pagination.PageSize;
        this.Settings.Pagination.PageGet          = typeof Pagination.PageGet          !== 'undefined' ? Pagination.PageGet          : this.Settings.Pagination.PageGet;
        this.Settings.Pagination.DataCount        = typeof Pagination.DataCount        !== 'undefined' ? Pagination.DataCount        : this.Settings.Pagination.DataCount;
        this.Settings.Pagination.isGetAllButton   = typeof Pagination.isGetAllButton   !== 'undefined' ? Pagination.isGetAllButton   : this.Settings.Pagination.isGetAllButton;
        this.Settings.Pagination.isGetAllCount    = typeof Pagination.isGetAllCount    !== 'undefined' ? Pagination.isGetAllCount    : this.Settings.Pagination.isGetAllCount;
        this.Settings.Pagination.isGetMoreButton  = typeof Pagination.isGetMoreButton  !== 'undefined' ? Pagination.isGetMoreButton  : this.Settings.Pagination.isGetMoreButton;
        this.Settings.Pagination.isGetMoreCount   = typeof Pagination.isGetMoreCount   !== 'undefined' ? Pagination.isGetMoreCount   : this.Settings.Pagination.isGetMoreCount;
        this.Settings.Pagination.isRefreshButton  = typeof Pagination.isRefreshButton  !== 'undefined' ? Pagination.isRefreshButton  : this.Settings.Pagination.isRefreshButton;

        this.Settings.isDataClone     = DataClone;
        this.Settings.isEmptyVisible  = EmptyVisible ? EmptyVisible : this.Settings.isEmptyVisible;


        this.ListElement  = ListElement;
        this.EmptyMessage = EmptyMessage;
       
        

        /* Server api callers */
        this.LineSave   = LineSave.bind(this.Owner);
        this.LineAdd    = LineAdd.bind(this.Owner);
        this.LineRemove = LineRemove.bind(this.Owner);
        this.OnChange   = OnChange.bind(this.Owner);
        this.AfterAdd   = AfterAdd.bind(this.Owner);

        this.PropTypes  = PropTypes;
        this.PropFormat = PropFormat;

        this._Data = null;

        //this._private = {};
        this.BeforeBuild = BeforeBuild.bind(this.Owner);
        this.AfterBuild  = AfterBuild.bind(this.Owner);

        this._DataPrivate = null; //Lure.Clone(this.Data);  //data with unconfirmed changes
        this._DataRender  = null; //this.Data.slice(0);     //data filtered/sorted/etc.

        this._DataItems = null;

        this._GetCurrentData = ()=>{return this._DataRender};
        
        this._DataInit = (NewList)=>{
            if (!NewList)
                return;
            this._DataSet = this.Settings.isDataClone ? Lure.Clone(NewList) : NewList;
            //this._DataDict = this._Data.ToDictionary((x,i)=>i, x=>x);
            this._Data = this._DataSet.Select((x,i)=>{return {LineID:i, Data:x}});
            this._DataDict = this._Data.ToDictionary((x)=>x.LineID, x=>x);
            this._DataPrivate = Lure.Clone(this._Data);             //data with unconfirmed changes
            this._DataPrivateDict = this._DataPrivate.ToDictionary((x)=>x.LineID, x=>x);
            this._DataRender  = this._Data.slice(0);
        };
        this._DataAppend = (List)=>{
            let LastLineID = this._Data.Last().LineID + 1;
            for (let i = 0; i < List.length; i++){
                let index = this._DataSet.push(this.Settings.isDataClone ? Lure.Clone(List[i]) : List[i]) - 1;
                let LineID = LastLineID + i;
                let DataItem = {
                    LineID: LineID,
                    Data: this._DataSet[index]
                };
                this._Data.push(DataItem);
                this._DataDict[LineID] = DataItem;
                this._DataRender.push(DataItem);

                this._DataPrivate.push(Lure.Clone({
                    LineID: LineID,
                    Data: Lure.Clone(this._DataSet[index])
                }));
                this._DataPrivateDict[LineID] = this._DataPrivate[index];
            }
        };
        this._DataPrepend = (List)=>{
            let LastLineID = this._Data[0].LineID - 1;
            for (let i = List.length-1; i >= 0; i--){
                this._DataSet.unshift(this.Settings.isDataClone ? Lure.Clone(List[i]) : List[i]);
                let LineID = LastLineID - i;
                let DataItem = {
                    LineID: LineID,
                    Data: this._DataSet[0]
                };
                this._Data.unshift(DataItem);
                this._DataDict[LineID] = DataItem;
                this._DataRender.unshift(DataItem);

                this._DataPrivate.unshift(Lure.Clone({
                    LineID: LineID,
                    Data: Lure.Clone(this._DataSet[0])
                }));
                this._DataPrivateDict[LineID] = this._DataPrivate[0];

                
            }            
        };



        this.Data = Data;

        let PageCursor = 0;                       //last rendered line
        let PageCursorReverse = 0;                //for build with it prepend

        this.isPageReverseOnce = false;

        let DataCount  = 0;                       //data portion length
        //let DataLength = Infinity;
        let isLastPage = false;

        let FilterDelegate  = null;
        let SorterDelegate  = null;
        let SorterInvert = 1;           //-1 for order desc


        this._NextPage = ()=>{
            //console.log('_NextPage', PageCursor, this.Settings.Pagination.PageSize, 'len:',this._DataRender.length)
            if (PageCursor >= this._DataRender.length){
                this.Settings.Pagination.PageGet.call(this.Owner, PageCursor, this.Settings.Pagination.PageSize)
                    .then(x=>{
                        if (x.length < this.Settings.Pagination.PageSize || this._Data.length+this.Settings.Pagination.PageSize === this.Settings.Pagination.DataCount)
                            isLastPage = true;
                        //console.log(`cid: ${this.ID} BuildWithIt`);
                        this.Append(x);
                    });
            }
            else{
                if (!this.Settings.Pagination.PageGet && (PageCursor+this.Settings.Pagination.PageSize) >= this._DataRender.length){
                    isLastPage = true;
                }
                Build();
            }

        };
        this._NextAll  = ()=>{
            isLastPage = true;
            //console.log('sdf',PageCursor, this._DataRender.length);
            if (PageCursor >= this._DataRender.length)
                this.Settings.Pagination.PageGet.call(this.Owner, PageCursor, this.Settings.Pagination.DataCount-PageCursor)
                    .then(x=>{
                        this.Append(x);
                    });
            else{
                Build();
            }

        };
        this._SetEditProperty = (Property, Val)=>{
            Lure.SetProperty(this._DataPrivate, Property, Val);
            let prop = Property.replace(/\[[\d]+\]\./,'');
            if (this.PropTypes[prop])
                Lure.PropTypes.CheckProp(this._DataPrivate, this.PropTypes[prop], Property);
        };
        this._GetEditProperty = (Property)=>{
            return Lure.GetProperty(this._DataPrivate, Property);
        };
        this._Filter = (Delegate=FilterDelegate)=>{
            FilterDelegate = Delegate;
            //console.log('_Filter', Delegate, isSaveStates);
            if (typeof Delegate !== 'function'){
                this._DataRender = this._Data.slice(0);
                this.Refresh();
                return;
            }
            this._DataRender = this._Data.Where(c=>Delegate(c.Data));
            this.Refresh();
            if (SorterDelegate)
            {
                SorterInvert = SorterInvert*(-1);
                this._Sort();
            }

        };
        this._Sort = (Delegate=SorterDelegate)=>{
            SorterInvert = (SorterDelegate === Delegate && SorterInvert>0) ? -1:1;
            SorterDelegate = Delegate;
            if (typeof Delegate !== 'function'){
                if (!FilterDelegate){
                    this._DataRender = this._Data.slice(0);
                    this.Refresh();
                }
                return Promise.resolve(0);
            }
            //debugger;
            this._DataRender.sort((a,b)=>{
                return Delegate(a.Data,b.Data)*SorterInvert;
            });
           /* this._DataPrivate.sort((a,b)=>{
                return Delegate(a.Data,b.Data)*SorterInvert;
            });*/
            PageCursor = 0;
            Build();
            return Promise.resolve(SorterInvert);
        };

        this._Add = (Item, isPrepend=false)=>{
            Item = this.Settings.DataClone? Lure.Clone(Item) : Item;
            let Empty = Lure.Select('.l-t-empty', this.Content);
            if (Empty !== null){
                Empty.remove();
            }
            let i = isPrepend ? 0 : this._Data.length;
            let LineID = 0;
            if (this._Data.length > 0 && isPrepend){
                LineID = Math.min.apply(null, this._Data.Select(x=>x.LineID)) - 1;
            }
            else if (this._Data.length > 0 && !isPrepend){
                LineID = Math.max.apply(null, this._Data.Select(x=>x.LineID)) + 1;
            }
            let DataItem = {
                LineID:  LineID,
                Data:  Item,
            };
            DataItem.DOM = this._SmartRender.GenElement(Item, {i:i, length: this._Data.length+1, LineID: DataItem.LineID, Controller: this});
            DataItem.DOM.classList.add(Lure.Settings.Editable.ClassWaiting);
            let P = this.Owner._PermissionRules;
            if (P)
                P.CheckLine(DataItem.DOM, DataItem.DOM.Data);
            if (isPrepend && this._DataRender.length>0){
                this.Content.insertBefore(DataItem.DOM, this._DataRender[0].DOM); //this.Content.prepend(Element);
            }
            else{
                this.Content.appendChild(DataItem.DOM);
            }
            return Lure.Call(this.LineAdd(DataItem), {
                Then: ()=>{
                    PageCursor++;
                    DataItem.DOM.classList.remove(Lure.Settings.Editable.ClassWaiting);
                    isPrepend ? this._Data.unshift(DataItem): this._Data.push(DataItem);
                    isPrepend ? this._DataRender.unshift(DataItem): this._DataRender.push(DataItem);
                    isPrepend ? this._DataPrivate.unshift(Lure.Clone(DataItem)): this._DataPrivate.push(Lure.Clone(DataItem));
                    this._DataDict[DataItem.LineID] = DataItem;
                    this._DataPrivateDict[DataItem.LineID] = isPrepend ? this._DataPrivate.First(): this._DataPrivate.Last();
                    if (FilterDelegate)
                        this.Filter();
                    if (SorterDelegate && !FilterDelegate)
                        this._Sort();
                    this.OnChange('add', DataItem);
                },
                Catch: e=>{
                    DataItem.DOM.remove();
                    console.error('[Lure.Templator] Add error item: ', Item, '\n', e);
                }
            });
            /*let p = this.LineAdd(Item);
            return p.then(()=>{
                DataItem.DOM.classList.remove(Lure.Settings.Editable.ClassWaiting);

                isPrepend ? this._Data.unshift(DataItem): this._Data.push(DataItem);
                isPrepend ? this._DataRender.unshift(DataItem): this._DataRender.push(DataItem);
                isPrepend ? this._DataPrivate.unshift(Lure.Clone(DataItem)): this._DataPrivate.push(Lure.Clone(DataItem));
                this._DataDict[DataItem.LineID] = DataItem;
                this._DataPrivateDict[DataItem.LineID] = isPrepend ? this._DataPrivate.First(): this._DataPrivate.Last();
                if (FilterDelegate)
                    this.Filter();
                if (SorterDelegate && !FilterDelegate)
                    this._Sort();
                this.OnChange('add', Item);
                return p;
            })
                .catch(x=>{
                    Element.remove();
                    console.error('[Lure.Templator] Add error item: ', Item, '\n', x);
                    return p;
                });*/
        };
        this._Remove = (Thing, isLocal=false)=>{
            let RemoverType = Lure.GetType(Thing);
            let LineID;
            let DataItem;
            if (Lure.isNumeric(Thing)){
                LineID = parseInt(Thing);
                DataItem = this._Data.Where(c=>c.LineID === LineID).FirstOrDefault();
            }
            else if (RemoverType === 'object') {
                DataItem = this._Data.Where(c => c.Data === Thing).FirstOrDefault();
                if (DataItem === null){
                    return Promise.reject();
                }
                LineID = DataItem.LineID;
                if (LineID === null) {
                    return Promise.reject();
                }
            }
            else if (RemoverType === 'function'){
                DataItem = this._Data.Where(c=>Thing(c.Data)).FirstOrDefault();
                if (DataItem === null){
                    return Promise.reject();
                }
                LineID = DataItem.LineID;
            }
            else{
                return Promise.reject();
            }
            if (DataItem === null)
                return Promise.reject();
            //TODO rendered indexes not changings

            const DomLine = DataItem.DOM;
            DomLine.classList.add(CSSWaiting);
            if (isLocal){
                DomLine.remove();
                let i  = this._Data.indexOf(DataItem);
                let i2 = this._DataRender.indexOf(DataItem);
                this._Data.splice(i, 1);
                this._DataPrivate.splice(i, 1);
                this._DataRender.splice(i2, 1);
                if (this._Data.length === 0)
                    this.Refresh();
                this.OnChange('remove', LineID);
                return Promise.resolve('local');
            }
            return Lure.Call(this.LineRemove(DataItem, DomLine), {
                Then: ()=>{
                    DomLine.remove();
                    let i  = this._Data.indexOf(DataItem);
                    let i2 = this._DataRender.indexOf(DataItem);
                    this._Data.splice(i, 1);
                    this._DataPrivate.splice(i, 1);
                    this._DataRender.splice(i2, 1);
                    if (this._Data.length === 0)
                        this.Refresh();
                    this.OnChange('remove', LineID);
                },
                Catch: x=>{
                    DomLine.classList.remove(CSSWaiting);
                    if (x && x instanceof Error)
                        console.error(`[Lure.Templator] Remove Error. LineID: ${LineID}`, x);
                    if (x)
                        console.log(`[Lure.Templator] Removing Canceled. LineID: ${LineID}`, x);
                }
            })
        };
        this._Edit = (LineID, Prop, Val)=>{
            let EditableElement = this._DataDict[LineID].DOM;
            EditableElement.classList.add(Lure.Settings.Editable.ClassWaiting);
            return Lure.Call(this.LineSave(this._DataDict[LineID], Prop, Val, LineID), {
                Then: ()=>{
                    Lure.SetProperty(this._DataDict[LineID].Data, Prop, Val);
                    this.OnChange('save', this._DataDict[LineID], Prop);
                },
                Catch: (e)=>{
                    console.error(`[Lure.Templator] Save Error. LineID: "${LineID}", Property: "${Prop}", Value: "${Val}"`+ e, '\n',this);
                },
                Finally: ()=>{
                    EditableElement.classList.remove(CSSWaiting);
                }
            });
        };

        
        const Builder = ()=>{   
            /* Clean Refresh */
            if (PageCursor === 0){
                let lines = Lure.SelectAll('.l-t-line, .l-t-empty', this.Content);
                for (let i = 0; i < lines.length; i++)
                    lines[i].remove();
            }
            /* Clean Pagination */
            if (this.Settings.Pagination.PageSize > 0){
                let Pager = Lure.Select('.l-t-pagination', this.Content.parentElement);
                if (Pager)
                    Pager.remove();
            }
            /* Pagination check */
            let NextCount;
            let PageLimit = this._DataRender.length;
            DataCount = this.Settings.Pagination.DataCount > 0 ? this.Settings.Pagination.DataCount : this._DataRender.length;
            if (this.Settings.Pagination.PageSize > 0)
            {
                if (!this.Settings.Pagination.PageGet && PageCursor === DataCount-this.Settings.Pagination.PageSize){
                    isLastPage = true;
                }
                let DOMPaginator = Lure.Select('.l-t-paginator', this.Content);
                if (DOMPaginator !== null)
                    DOMPaginator.remove();
                PageLimit = isLastPage ? DataCount: (PageCursor + this.Settings.Pagination.PageSize);
                if (PageLimit > DataCount)
                    PageLimit = DataCount;
                //if (this._Data.Where(x=>x.Data.Name.indexOf('Tony')> -1))
                //    debugger;
                NextCount = (this.Settings.Pagination.PageGet ? this.Settings.Pagination.DataCount : this._DataRender.length) - PageLimit;
                if (NextCount > this.Settings.Pagination.PageSize || NextCount < 0)
                    NextCount = this.Settings.Pagination.PageSize;
                //console.log(`(1)NextCount:${NextCount},DataCount:${DataCount},PageCursor:${PageCursor},PageLimit:${PageLimit}`);
            }
            /* Data Empty Case */
            if (this._DataRender.length === 0 && this.Settings.isEmptyVisible && this.EmptyMessage !== "")
            {
                if (this.Settings.isEmptyVisible && this.EmptyMessage !== ""){
                    let tag = this.ListElement.match(/\s?([\w]+) /)[0].replace(/\s/g, "");
                    let Empty = Lure.CreateElementFromString(`<${tag} class="l-t-empty">${this.EmptyMessage}</${tag}>`, this.Content.tagName);

                    return this.Content.appendChild(Empty);
                }
                if (!this.Settings.isEmptyVisible && this.Owner){
                    this.Owner.Hide();
                }
            }

            /* Render */
            if (this.isPageReverseOnce && PageCursorReverse > 0){
                for (let i = PageCursorReverse; i >= 0; i--){
                    this._DataRender[i].DOM = this._SmartRender.GenElement(this._DataRender[i].Data, {
                        i:i,
                        length: PageLimit,
                        LineID: this._DataRender[i].LineID,
                        Controller: this,
                    });
                    this._DataRender[i].DOM.setAttribute('data-line', this._DataRender[i].LineID);
                    //this.Content.prepend(this._DataRender[i].DOM);
                    CheckStatedElements(this._DataRender[i].DOM);
                    let P = this.Owner._PermissionRules;
                    if (P)
                        P.CheckLine(this._DataRender[i].DOM, this._DataRender[i].Data);
                    this.Content.prepend(this._DataRender[i].DOM);
                    //this.Content.insertBefore(this._DataRender[i].DOM, this._DataRender[PageCursorReverse+1].DOM)
                }
            }
            else{
                for (let i = PageCursor; i < PageLimit; i++){
                    this._DataRender[i].DOM = this._SmartRender.GenElement(this._DataRender[i].Data, {i:i, length: PageLimit, LineID: this._DataRender[i].LineID, Controller: this,});
                    this._DataRender[i].DOM.setAttribute('data-line', this._DataRender[i].LineID);
                    CheckStatedElements(this._DataRender[i].DOM);
                    let P = this.Owner._PermissionRules;
                    if (P)
                        P.CheckLine(this._DataRender[i].DOM, this._DataRender[i].Data);
                    this.Content.appendChild(this._DataRender[i].DOM);
                }
            }
            PageCursor = PageLimit;
            if (this.Settings.Pagination.PageSize > 0){
                let isTable = this.Content.tagName.toLowerCase() === 'tbody' || this.Content.tagName.toLowerCase() === 'table' || this.Content.tagName.toLowerCase() === 'thead';

                let TagName = 'div';
                let ColSpan = '';
                if (isTable){
                    TagName = 'tr';
                    ColSpan = ` colspan="${Lure.SelectAll('tr:last-child td', this.Content).length + 1}"`;
                }
                let Pager = Lure.CreateElementFromString(`<${TagName}${ColSpan} class="l-t-pagination"></${TagName}>`, this.Content.tagName);
                if (this.Data.length < this.Settings.Pagination.PageSize || isLastPage){
                    if (this.Settings.Pagination.isRefreshButton){
                        Pager.innerHTML = `<button class="button l-button l-t-refresh">${Lure.Culture.Lang.Refresh}</button>`;
                    }
                }
                else{

                    if (this.Settings.Pagination.isGetMoreButton)
                    {
                        let PagMore  = Lure.CreateElementFromString(`<button class="button l-button l-t-pagination-getmore"><span class="value">${Lure.Culture.Lang.GetMore}${this.Settings.Pagination.isGetMoreCount ? ` (${NextCount})`: ''}</span><span class="button-loading"></span></button>`);
                        PagMore.onclick = (e)=>{
                            e.currentTarget.disabled = true;
                            this._NextPage();
                        };
                        Pager.appendChild(PagMore);
                    }
                    //let PagDelim = Lure.CreateElementFromString(`<span class="l-t-pagination-delimiter">/</span>`);
                    let PagAll   = Lure.CreateElementFromString(`<button class="button l-button l-t-pagination-getall"><span class="value">${Lure.Culture.Lang.GetAll}${this.Settings.Pagination.isGetAllCount ? ` (${DataCount - PageCursor})`: ''}</span><span class="button-loading"></span></button>`);


                    let isRemoteDataKnownSize = (this.Settings.Pagination.isGetAllButton && (this.Settings.Pagination.DataCount>0 && this.Settings.Pagination.PageGet) );
                    let isLocalData = (this.Settings.Pagination.isGetAllButton && !this.Settings.Pagination.PageGet);
                    if (isLocalData || isRemoteDataKnownSize){
                        PagAll.onclick = (e)=>{
                            e.currentTarget.disabled = true;
                            this._NextAll();
                        };
                        Pager.appendChild(PagAll);
                    }
                }

                Lure.AddEventListenerGlobal('click', '.l-t-refresh', function () {
                    this.Owner.Refresh();
                }, Pager, this);

                this.Content.parentElement.appendChild(Pager);
                this.isPageReverseOnce = false;
            }
        };
        let Build;
        if (this.BeforeBuild.constructor.name === 'AsyncFunction'){
            Build = async (type="refresh")=>{
                await this.BeforeBuild(type);
                Builder();
                Lure.Editable.EditableForceRefresh(this);
                if (this._DataRender.length>0)
                    this.AfterBuild(type);
            };
        }
        else{
            Build = (type="refresh")=>{
                this.BeforeBuild(type);
                Builder();
                Lure.Editable.EditableForceRefresh(this);
                if (this._DataRender.length>0)
                    this.AfterBuild(type);
            };
        }


        this.Append = (data, isPrepend)=>{
            //if (this.ID === 156) debugger;
            if (data.length === 0){
                // DataCount = this._DataRender.length;
            }
            if (this._Data.length < 1){
                this.Data = data;
                return Build('refresh2');
            }
            if (this.isPageReverseOnce){
                this._DataPrepend(data);
                PageCursorReverse = data.length-1;
                return Build('prepend');
            }
            this._DataAppend(data);
            Build('append');
        };
        this.BuildWithIt = (data, isPrepend)=>{
            this.Append(data, isPrepend)
        };
        this.Redraw = ()=>{
            PageCursor = 0;
            Build();
        };
        this.NextPage = ()=>{
            this._NextPage();
        };

        const CheckStatedElements = function (RenderedDOM) {
            let StatedElements = Lure.SelectAll('[checked], [selected], [disabled]', RenderedDOM).ToList();
            if (Lure.DOM.isQuery(RenderedDOM, '[checked], [selected], [disabled]')){
                StatedElements.push(RenderedDOM);
            }
            for (let Elem of StatedElements){
                let isChecked  = Elem.getAttribute('checked')  || Elem.checked  || false;
                let isSelected = Elem.getAttribute('selected') || Elem.selected || false;
                let isDisabled = Elem.getAttribute('disabled') || Elem.disabled || false;
                Elem.checked = isChecked === 'checked' ? true : Lure.PropTypes.TryParse(Lure.PropTypes.Bool, isChecked, 'checked');
                Elem.selected = isSelected === 'selected' ? true : Lure.PropTypes.TryParse(Lure.PropTypes.Bool, isSelected, 'selected');
                Elem.disabled = isDisabled === 'disabled' ? true : Lure.PropTypes.TryParse(Lure.PropTypes.Bool, isDisabled, 'disabled');
            }
        };
        const RefreshSmart = (DataItem) =>{
            if (!DataItem.Context){
                DataItem.Context = this._SmartRender.GetContext(this.Owner, DataItem.DOM);
            }
            else{
                DataItem.Context._TargetElement = DataItem.DOM;
            }
            //console.log(DataItem.Context._TargetElement);
            DataItem.Context.Refresh(DataItem.Data, {
                i: this._DataRender.indexOf(DataItem),
                length: this._DataRender.length,
                LineID: DataItem.LineID,
                Controller: this,
            });
            //CheckStatedElements(DataItem.DOM);
            let P = this.Owner._PermissionRules;
            if (P)
                P.CheckLine(DataItem.DOM, DataItem.Data);
        };

        const RefreshByList = (data) =>{
            PageCursor = 0;
            isLastPage = false;

            if (this.Owner && this.Owner.isContent && this.Owner.Sort && SorterDelegate === null)
            {
                //TODO Make fixed sorting settings property
                this.Owner.Sort._Reset();
            }
            /*if (!Lure.CheckDirty(data, this._DataPrivate.Select(x=>x.Data), false) ){
                this.Data = data;
            }*/
            if (this.Settings.Pagination.PageGet /*&& Lure.isVisible(this.Owner.Content)*/){
                this.Data = [];
                this._NextPage()
            }
            else{
                this.Data = data;
                Build();
                if (SorterDelegate)
                {
                    SorterInvert = SorterInvert*(-1);
                    this._Sort();
                }
            }
        };
        const RefreshByObject = (obj)=>{
            let i = this._DataRender.Select(x=>x.Data).indexOf(obj);
            if (i < 0)
                return console.warn('[Lure.Controller.Templator] RefreshByObject is impossible, object is not exist, use "Controller.Add" instead', obj);
            RefreshSmart(this._DataRender[i]);
        };
        const RefreshByNode = (node)=>{
            let i = this._DataRender.Select(x=>x.DOM).indexOf(node);
            const DataRendered = this._DataRender[i];
            RefreshSmart(DataRendered);
            /* refresh permissions */
            // let P = this.Owner._PermissionRules;
            // if (P)
            //     P.CheckLine(DataRendered.DOM, DataRendered.Data);
        };
        const RefreshByLineID = (LineID)=>{
            //let LineID = this._Data[i].LineID;
            LineID = parseInt(LineID);
            let DataRendered = this._DataRender.Where(x=>x.LineID === LineID).FirstOrDefault();
            if (DataRendered){
                RefreshSmart(DataRendered);
            }
            // let P = this.Owner._PermissionRules;
            // if (P)
            //     P.CheckLine(DataRendered.DOM, DataRendered.Data);
                        
        };

        const RefreshByDelegate = (Delegate)=>{
            let LineIDs = this._Data.Where(x=>Delegate(x.Data)).Select(x=>x.LineID);
            for (let i = 0; i < LineIDs.length; i++){
                this.Refresh(LineIDs[i]);
            }
        };
        this._Refresh = (data=null)=>{
            let RefreshType = Lure.GetType(data); 
            switch (RefreshType){
                default:
                case 'array':
                    RefreshByList(data);
                    break;
                case 'object':
                    RefreshByObject(data);
                    break;
                case 'node':
                    RefreshByNode(data);
                    break;
                case 'number':
                    RefreshByLineID(data);
                    break;
                case 'function':
                    RefreshByDelegate(data);
                    break;
            }
            return Promise.resolve();
        };
        /*this._RefreshOne = function (delegate) {
            let i;
            if (Lure.isNumeric(delegate)){
                i = delegate;
            }
            else{
                i = this._DataRender.indexOf(delegate);
            }
            if (FilterDelegate){
                i = this._DataRender.indexOf(this._Data[i]);
            }
            let newItem = Lure.CreateElementFromString(this._LineBuilder(this._DataRender[i], i, this._DataRender.length), this.Content.tagName);
            let itemOld = this.Items[i];
            newItem.classList = itemOld.classList;
            this.Items[i].parentNode.replaceChild(newItem, itemOld);

        };*/


















        /* Construct */

        let isListElementIsCss = (/^[a-zA-Z0-9.,\-_ *#]+$/).test(this.ListElement);
        if (isListElementIsCss){
            let element = Lure.Select(ListElement, this.Content);
            element.classList.add('l-t-line');
            this.ListElement = element.outerHTML;
            element.remove();
        }
        else{
            let list_element = this.ListElement.match(/<[^>]+>/)[0];
            let list_elementClassed;
            let pos = list_element.indexOf('class="');
            if (pos < 0)
            {
                list_elementClassed = list_element.substr(0,list_element.length - 1) + ' class="l-t-line"' + list_element.substr(list_element.length-1);
            }
            else
            {
                pos = list_element.indexOf('"', pos+8);
                list_elementClassed = list_element.substr(0,pos) + " l-t-line" + list_element.substr(pos);
            }
            this.ListElement = this.ListElement.replace(list_element, list_elementClassed);
        }

        this.ListElement = this.ListElement.replace(/<[\s\S]+?(>)/, function (a, b) {
            return a
                .replace(/data-line=('|")[^('|")]*('|")/, ' ')
                .replace(b, ' data-line="{{__LineID}}">');
        });
        this._SmartRender = Lure.CompileSmart(this.ListElement, this);


        if (this.isEditable || this.isRemovable)//(Lure._CompileSmart.RegExp.EditRemove.test(this.ListElement))
        {
            Lure.Editable.ListenEditable(this.Owner, this);
        }


        /*if (this.Owner){

        }
        else{
            Lure.AddEventListenerGlobal('click', '.l-t-refresh', function () {
                this._Refresh();
            }, this.Content, this)
        }*/


    }
};


Lure.Controller.Templator = Templator;
/* Pop memssages */
Lure.CustomLog = class CustomLog{
    constructor({
                    Target = document.body,
                    Duration = 500,
                    Timeout  = 5000,
                    Style    = {},
                    Show     = null,
                    Hide     = null,
                    isNewInstance = false
                }={}){
        Lure.CustomLog.Count = Lure.CustomLog.Count? Lure.CustomLog.Count++: 1;

        this.Options = {
            Style: {
                padding:           Style.padding         ? Style.padding         : '10px 20px',
                marginTop:         Style.marginTop       ? Style.marginTop       : "5px",
                borderRadius:      Style.borderRadius    ? Style.borderRadius    : "0px",
                backgroundColor:   Style.backgroundColor ? Style.backgroundColor : '#d00',
                color:             Style.color           ? Style.color           : "#fff",
            },
        };
        let Block;
        if (!isNewInstance){
            Block = Lure.Select('#lure-customlog-1');
        }
        if (isNewInstance || Block === null){
            Block = document.createElement('div');
            Block.id = `lure-customlog-${Lure.CustomLog.Count}`;
            Block.style.position = "fixed";
            Block.style.right    = "5px";
            Block.style.bottom   = "5px";
            Block.style.zIndex   = "100";
        }


        /*function Show(div) {
            div.style.opacity = '1';
        }
        function Hide(div) {
            div.style.opacity = '0';
        }*/
        Target.appendChild(Block);

        /* API */
        this.AddLine = function(text) {
            const div = document.createElement('div');
            div.innerHTML = text;
            for (let style in this.Options.Style){
                div.style[style] = this.Options.Style[style];
            }
            div.style.position = 'relative';
            div.style.opacity = '0';
            div.style.transition = `${Duration}ms ease-in`;
            const LifeLine = document.createElement('div');
            LifeLine.style.height = '5px';
            LifeLine.style.width = '100%';
            LifeLine.style.backgroundColor = 'rgba(0,0,0,0.4)';
            LifeLine.style.position = 'absolute';
            LifeLine.style.bottom = '0';
            LifeLine.style.left = '0';
            LifeLine.style.transition = `${Timeout-50}ms linear`;
            div.appendChild(LifeLine);
            ///
            Block.appendChild(div);
            div.style.opacity = '1';
            setTimeout(function () {
                LifeLine.style.width = '0';

            }, 50);
            div.LureTimeout = setTimeout(function () {
                div.style.opacity = '0';
                setTimeout(function(){
                    div.remove();
                }, Duration)
            }, Timeout)
        }
    }
};
/* ajax loading holder */
Lure.Settings.Load = {
    /** @type {?string} */
    Svg: null,
};

/**
 *
 * @type {Lure.LureLoading}
 */
Lure.Load = class LureLoading{
    static _DoArc(radius, maxAngle, cx, cy){
        let d = " M "+ (cx + radius) + " " + cy;
        for (let angle = 0; angle < maxAngle; angle++)
        {
            let rad = angle * (Math.PI / 180);  //deg to rad
            let x = cx + Math.cos(rad) * radius;
            let y = cy + Math.sin(rad) * radius;
            d += " L "+x + " " + y;
        }
        return d;
    };
    constructor(
        {
            Target = 'body',
            SaveOriginalStylePosition = false,
            BackgroundColor = null,
            CustomSvg = null
        } = {}
    ){
        this._isActive = false;
        this.Target = Lure.Select(Target);
        const pos = getComputedStyle(this.Target).position.toLowerCase();
        if (pos !== 'absolute' && pos !== 'relative')
            this.Target.style.position = 'relative';
        this.Content = Lure.CreateElementFromString(`<div class="lure-loading" style="display: none"></div>`);
        if (BackgroundColor !== null){
            this.Content.style.backgroundColor = BackgroundColor;
        }
        let cx = 60; //diameter
        let cy = 60;
        // let _DoArc = function(radius, maxAngle){
        //     let d = " M "+ (cx + radius) + " " + cy;
        //     for (let angle = 0; angle < maxAngle; angle++)
        //     {
        //         let rad = angle * (Math.PI / 180);  //deg to rad
        //         let x = cx + Math.cos(rad) * radius;
        //         let y = cy + Math.sin(rad) * radius;
        //         d += " L "+x + " " + y;
        //     }
        //     return d;
        // };
        if (Lure.Settings.Load.Svg){
            this.Content.innerHTML = Lure.Settings.Load.Svg;
        }else{
            this.Content.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">
                     <path d="${Lure.Load._DoArc(45, 160, cx, cy)}" class="lure-arc1" fill="none" stroke="#449b22" stroke-width="5"></path>
                     <path d="${Lure.Load._DoArc(40, 130, cx, cy)}" class="lure-arc2" fill="none" stroke="#61c8de" stroke-width="5"></path>
                     <path d="${Lure.Load._DoArc(35, 100, cx, cy)}" class="lure-arc3" fill="none" stroke="#761c19" stroke-width="5"></path>
                     <path d="${Lure.Load._DoArc(30, 70, cx, cy)}"  class="lure-arc4" fill="none" stroke="#333333" stroke-width="5"></path>
                   </svg>`;
        }

        this.Target.appendChild(this.Content);

        this.Timeout = void 0;
        this.TimeoutHide = void 0;
        //this.Target.style.position = pos;
    }
    Show(){
        clearTimeout(this.Timeout);
        clearTimeout(this.TimeoutHide);
        this._isActive = true;
        this.Timeout = setTimeout(()=>{
            this.Content.style.display = '';
        }, 70);
    }
    Hide(){
        clearTimeout(this.Timeout);
        clearTimeout(this.TimeoutHide);
        this._isActive = false;
        this.TimeoutHide = setTimeout(()=>{
            this.Content.style.display = 'none';
        }, 250); //hide may be called in same time as the show()
    }
    get isActive(){
        return this._isActive;
    }
};

/* date-working class */

class LureDate {
    /**
     *
     * @param format
     * @param isBandMonthName [Deprecated] band to word cases. Deprecated param - use "MMMMM" template
     * @returns {string}
     */
    Format( format = Lure.Culture.DateFormatFull, isBandMonthName = false) {
        return Lure.Date.Format(this._Date, format, isBandMonthName);
    }

    /** @private */
    toString(){
        return this.Format();
    }

    /** @param {LureDate} Date
     *  @return {int[]}
     * */
    Diff(Date){
        let ms = Math.abs(this.Value - Date.Value);
        let diffs = [];
        let div = [1000, 60, 60, 24];
        let res = ms;
        for (let d of [86400000, 3600000, 60000, 1000]){
            let val = Math.floor(res / d);
            let rest = res % d;
            console.log(res, d, val, rest);
            diffs.push(val);
            res = rest;
        }
        console.warn('[Lure.Date().Diff] is experimental method');
        return diffs;
    }
    /** @param {LureDate | Date} Date
     *  @return {{Years: int, Months: int, Days: int, Hours: int, Minutes: int, Seconds: int, Milliseconds: int}}
     * */
    DiffFull(Date){
        Date = Lure.Date(Date);

        let FullMilliseconds = Date.Value;

        let DateMin = this;
        let DateMax = Date;
        if (this.Value > Date.Value){
            DateMin = Date;
            DateMax = this;
        }
        let Cursor  = DateMax.Clone();
        let Compars = Date.Date < this._Date ? Date : this;

        let DF = {
            Years: 0,
            Months: 0,
            Days: 0,
            Hours: 0,
            Minutes: 0,
            Seconds: 0,
            Milliseconds: 0
        };

        DF.Years = Cursor.Year - DateMin.Year;
        if (DF.Years > 0 && Cursor.Month < DateMin.Month){
            DF.Years--;
            DF.Months = Cursor.Month+1;
            Cursor.SetMonth(11)
        }
        DF.Months += Cursor.Month - DateMin.Month;
        if (DF.Months > 0 && Cursor.Day < DateMin.Day){
            DF.Months--;
            DF.Days = Cursor.Day+1;
            Cursor.SetDay(Cursor.CountDays);
        }
        DF.Days += Cursor.Day - DateMin.Day;
        if (DF.Days > 0 && Cursor.Hours < DateMin.Hours){
            DF.Days--;
            DF.Hours = Cursor.Hours+1;
            Cursor.SetHours(23);
        }
        DF.Hours += Cursor.Hours - DateMin.Hours;
        if (DF.Hours > 0 && Cursor.Minutes < DateMin.Minutes){
            DF.Hours--;
            DF.Minutes = Cursor.Minutes+1;
            Cursor.SetMinutes(59);
        }
        DF.Minutes += Cursor.Minutes - DateMin.Minutes;
        if (DF.Minutes > 0 && Cursor.Seconds < DateMin.Seconds){
            DF.Minutes--;
            DF.Seconds = Cursor.Seconds+1;
            Cursor.SetSeconds(59);
        }
        DF.Seconds += Cursor.Seconds - DateMin.Seconds;
        if (DF.Seconds > 0 && Cursor.Milliseconds < DateMin.Milliseconds){
            DF.Seconds--;
            DF.Milliseconds = Cursor.Milliseconds+1;
            Cursor.SetMilliseconds(999);
        }
        DF.Milliseconds += Cursor.Milliseconds - DateMin.Milliseconds;
        return DF;
    }


    get CountDays(){
        let month = this._Date.getMonth();
        let year = this._Date.getFullYear();
        return new Date(year, month+1, 0).getDate();
    }
    get DayStart(){
        let d = new Date(this._Date.getTime());
        d.setHours(0,0,0,0);
        return d;
    }
    get DayEnd(){
        let d = new Date(this._Date.getTime());
        d.setHours(23,59,59,997);
        return d;
    }

    get WeekStart(){
        let wd = this._Date.getDay();
        wd = wd !== 0 ? wd-1: 6; //monday as first weekday
        return this.AddDays(-wd).DayStart

    }
    get WeekEnd(){
        let wd = this._Date.getDay();
        wd = wd !== 0 ? wd-1: 6; //monday as first weekday
        return this.AddDays(6-wd).DayEnd
    }

    get MonthStart(){
        let d = new Date(this._Date.getTime());
        d.setDate(1);
        d.setHours(0,0,0,0);
        return d;
    }
    get MonthEnd(){
        let d = new Date(this._Date.getTime());
        d.setDate(Lure.Date(d).CountDays );
        d.setHours(23,59,59,997);
        return d;
    }

    get QuarterStart(){
        let d = new Date(this._Date.getTime());
        let quart = Math.floor( (d.getMonth()) / 3);
        d.setMonth(quart*3);
        d.setDate(1);
        d.setHours(0,0,0,0);
        return d;
    }
    get QuarterEnd(){
        let d = new Date(this._Date.getTime());
        let quart = Math.floor( (d.getMonth()) / 3);
        d.setMonth(quart*3 + 2);
        d.setDate(this.CountDays );
        d.setHours(23,59,59,997);
        return d;
    }

    get YearStart(){
        return new Date(this._Date.getFullYear(), 0, 1);
    }
    get YearEnd(){
        return new Date(this._Date.getFullYear(), 11, 31, 23, 59, 59, 997);
    }


    /**
     *
     * @param Count
     * @returns {LureDate}
     */
    AddMilliseconds(Count){
        this._Date.setMilliseconds(this._Date.getMilliseconds() + Count);
        return this;
    }
    /**
     *
     * @param Count
     * @returns {LureDate}
     */
    AddSeconds(Count){
        this._Date.setSeconds(this._Date.getSeconds() + Count);
        return this;
    }

    /**
     *
     * @param Count
     * @returns {LureDate}
     */
    AddMinutes(Count){
        this._Date.setMinutes(this._Date.getMinutes() + Count);
        return this;
    }

    /**
     *
     * @param Count
     * @returns {LureDate}
     */
    AddHours(Count){
        this._Date.setHours(this._Date.getHours() + Count);
        return this;
    }

    /**
     *
     * @param Count
     * @returns {LureDate}
     */
    AddDays(Count){
        //const dat = new Date(this._Date.valueOf());
        this._Date.setDate(this._Date.getDate() + Count);
        return this;
    }

    /**
     *
     * @param Count
     * @returns {LureDate}
     */
    AddMonths(Count){
        let DtDays = this._Date.getDate();
        let DtTargetDays = new Date(this._Date.getFullYear(), this._Date.getMonth()+Count + 1, 0).getDate();
        if (DtTargetDays >= DtDays)
        {
            this._Date.setMonth(this._Date.getMonth() + Count);
        }
        else
        {
            this._Date.setMonth(this._Date.getMonth() + Count);
            this.AddDays(DtTargetDays-DtDays);
        }
        return this;
    }
    /**
     *
     * @param Count
     * @returns {LureDate}
     */
    AddYears(Count){
        let DtMonths = this._Date.getMonth();
        let DtTargetMonths = new Date(this._Date.getFullYear() + Count, 0, 0).getMonth();

        if (DtTargetMonths >= DtMonths)
        {
            this._Date.setFullYear(this._Date.getFullYear() + Count);
        }
        else
        {
            this._Date.setFullYear(this._Date.setFullYear() + Count);
            this.AddMonths(DtTargetMonths-DtMonths);
        }

        //this._Date.setFullYear(this._Date.getFullYear() + Count);
        return this;
    }

    /**
     *
     * @returns {Date}
     */
    get Date(){
        return this._Date;
    }

    /**
     *
     * @returns {int}
     */
    get Int(){
        return this._Date.valueOf()
    }
    /**
     *
     * @returns {int}
     */
    get Value(){
        return this._Date.valueOf()
    }
    get DateCs(){
        return '\/Date(' + (+this.Value) + this.Format('Z') + ')\/'
    }

    get Milliseconds(){
        return this._Date.getMilliseconds();
    }
    get Seconds(){
        return this._Date.getSeconds();
    }
    get Minutes(){
        return this._Date.getMinutes();
    }
    get Hours(){
        return this._Date.getHours();
    }

    get Day(){
        return this._Date.getDate();
    }

    /**
     * @return {int}
     * @description returns from 1 to 7 where monday is 1, saturday is 7
     * */
    get DayOfWeek(){
        let d = this._Date.getDay();
        if (d === 0)
            return 7;
        return d;
    }
    get Month(){
        return this._Date.getMonth();
    }

    get Year(){
        return this._Date.getFullYear();
    }

    /** @param {int} Milliseconds */
    SetMilliseconds(Milliseconds){
        this._Date.setMilliseconds(Milliseconds);
        return this;
    }
    /** @param {int} Seconds */
    SetSeconds(Seconds){
        this._Date.setSeconds(Seconds);
        return this;
    }
    /** @param {int} Minutes
     * @return {LureDate}
     * */
    SetMinutes(Minutes){
        this._Date.setMinutes(Minutes);
        return this;
    }
    /** @param {int} Hours
     * @return {LureDate}*/
    SetHours(Hours){
        this._Date.setHours(Hours);
        return this;
    }
    /** @param {int} Day (from 1 to DayCount, 0 is prev day)
     * @return {LureDate}*/
    SetDay(Day){
        this._Date.setDate(Day);
        return this;
    }
    /** @param {int} Month (from 0 to 11)
     * @return {LureDate}*/
    SetMonth(Month){
        this._Date.setMonth(Month);
        return this;
    }
    /** @param {int} Year
     * @return {LureDate}*/
    SetYear(Year){
        this._Date.setFullYear(Year);
        return this;
    }

    /**
     *
     * @returns {LureDate}
     */
    SetDayStart(){
        this._Date.setHours(0,0,0,0);
        return this;
    }
    /**
     *
     * @returns {LureDate}
     */
    SetDayEnd(){
        this._Date.setHours(23, 59, 59, 997);
        return this;
    }
    /**
     *
     * @returns {LureDate}
     */
    SetWeekStart(){
        let wd = this._Date.getDay();
        wd = wd !== 0 ? wd-1: 6; //monday as first weekday
        this._Date = this.AddDays(-wd).DayStart;
        return this;
    }
    /**
     *
     * @returns {LureDate}
     */
    SetWeekEnd(){
        let wd = this._Date.getDay();
        wd = wd !== 0 ? wd-1: 6; //monday as first weekday
        this._Date = this.AddDays(6-wd).DayEnd;
        return this;
    }
    /**
     *
     * @returns {LureDate}
     */
    SetMonthStart(){
        this._Date.setDate(1);
        this._Date.setHours(0,0,0,0);
        return this;
    }

    /**
     *
     * @returns {LureDate}
     */
    SetMonthEnd(){
        this._Date.setDate(this.CountDays );
        this._Date.setHours(23,59,59,997);
        return this;
    }

    /**
     *
     * @returns {LureDate}
     */
    SetQuarterStart(){
        let quart = Math.floor( (this.Month) / 3);
        this._Date.setMonth(quart*3);
        this._Date.setDate(1);
        this._Date.setHours(0,0,0,0);
        return this;
    }
    /**
     *
     * @returns {LureDate}
     */
    SetQuarterEnd(){
        let quart = Math.floor( (this.Month) / 3);
        this._Date.setMonth(quart*3 + 2);
        this._Date.setDate(this.CountDays );
        this._Date.setHours(23,59,59,997);
        return this;
    }

    /**
     *
     * @returns {LureDate}
     */
    SetYearStart(){
        this._Date = new Date(this._Date.getFullYear(), 0, 1);
        return this;
    }
    /**
     *
     * @returns {LureDate}
     */
    SetYearEnd(){
        this._Date = new Date(this._Date.getFullYear(), 11, 31, 23, 59, 59, 997);
        return this;
    }


    /** @return {LureDate} */
    Clone(){
        return Lure.Date(this._Date);
    }

    /** @param {LureDate} LDate */
    CopyTime(LDate){
        this.SetHours(LDate.Hours);
        this.SetMinutes(LDate.Minutes);
        this.SetSeconds(LDate.Seconds);
        this.SetMilliseconds(LDate.Milliseconds);
    }
    /** @param {LureDate} LDate */
    isSameDate(LDate){
        return this.Year === LDate.Year && this.Month === LDate.Month && this.Day === LDate.Day;
    }

    get isToday(){
        return this.isCurrentDay
    }
    get isCurrentDay(){
        const today = new Date();

        const day   = this._Date.getDate();
        const month = this._Date.getMonth();
        const year  = this._Date.getFullYear();

        return (day === today.getDate() && month === today.getMonth() && year === today.getFullYear())
    }
    get isCurrentMonth(){
        const month = this._Date.getMonth();
        const year =  this._Date.getFullYear();
        const today = new Date();
        return (month === today.getMonth() && year === today.getFullYear())
    }

    constructor(date, format){
        if (date === null || typeof date === 'undefined'){
            Lure.System.ShowError('[Lure.Date] Input Date is undefined or null');
            console.error(new Error('[Lure.Date] Input Date is undefined or null'));
            return null;

        }
        if (date instanceof Date){
            this._Date = new Date(date.valueOf());
        }
        else if (date instanceof LureDate){
            this._Date = date._Date;
        }
        else if (Lure.isNumeric(date) && !format){
            this._Date = new Date(parseInt(date));
        }
        else{
            let ErrorSum = 0;

            const Dags = 'DDMMYYYYHHmmss';
            let Legacy = [];
            format = format ? format : Lure.Culture.DateFormatFull;
            if (format.indexOf('MMM') > -1){
                format = format.replace(/[M]{3,}/g, 'M');
                date = date.replace(/[a-zA-Zа-я-А-Я\\w]+\.?/, function (match, index) {
                    match = match.replace('.', '').toLowerCase();
                    if (Lure.Culture._DataDict[match] !== void 0){
                        return Lure.Culture._DataDict[match]+1;
                    }
                    ErrorSum++;
                    //throw new Error('[Lure.Date] Invalid date or date format')
                })
            }

            const rgx = format
                .replace(/[DMYHms]+/g,function (match, index) {
                    Legacy.push(match.substring(0,1));
                    if (Dags.indexOf(match) > -1){

                        let len = match.length < 2 ? `0,2`:match.length;
                        if (match === 'Y')
                            len = '2,4';
                        return `(\\d{${len}})?`;
                    }
                    //return `[a-zA-Zа-я-А-Я\\w]+`;
                })
                .replace(/[.-/ :;]/g, function (match) {
                    return match+'?';
                });
            let C = {
                Y:0,
                M:0,
                D:1,
                H:0,
                m:0,
                s:0,
            };

            date.replace(new RegExp(rgx), function(match, a,b,c,d,e,f,g,h){
                let x = [a,b,c,d,e,f,g,h];
                for (let i = 0; i < Legacy.length; i++){
                    C[Legacy[i]] = x[i]? x[i]: C[Legacy[i]];
                    if (x[i] === '' || x[i] === '0'){
                        ErrorSum++;
                    }
                }

            });
            if (!C.Y)
                ErrorSum++;
            if ((!C.M) && (C.D || C.H || C.m || C.s))
                ErrorSum++;
            if (C.M>12 || C.H > 23 || C.m>59 || C.s>59)
                ErrorSum++;

            this._Date = new Date(C.Y, C.M-1,C.D,C.H, C.m, C.s);
            if (!Lure.Date.isDateValid(this._Date) || ErrorSum > 0){
                let matchCS = date.match(/Date\(([\d]+)(\+\d{4})\)/);
                if (matchCS){
                    this._Date = new Date(parseInt(matchCS[1]));
                }
                ErrorSum = 0;
            }
            //return;
            if (!Lure.Date.isDateValid(this._Date) || ErrorSum > 0){
                this._Date = new Date(date);
            }
            if (!Lure.Date.isDateValid(this._Date) || ErrorSum > 0){
                Lure.System.ShowError('[Lure.Data] Can not parse properly input Data');
                console.error(`[Lure.Data] Parse Error. Can not parse properly input Data "${date}"`);
            }
            // console.log(Legacy, rgx, C,ErrorSum);
        }

    }
};
Lure._Date = LureDate;

/**
 *
 * @param date
 * @param format
 * @returns {LureDate}
 */
Lure.Date = (date=new Date(), format)=>{
    if (date === null){
        date = new Date();
        console.warn('[Lure.Date] Date is null');
    }
    return new Lure._Date(date, format);
};
//something like static methods
Lure.Date.Format = (date,  format = "DD.MM.YYYY HH:mm:ss", isBandMonthName = false)=>{
    //let date = this._Date;
    if (date === null || typeof date === 'undefined')
        return '';
    let day  = date.getDay();
    day = day !== 0 ? day-1: 7; //monday as first weekday
    const data = date.getDate();
    const mo   = date.getMonth() + 1;
    const year = date.getFullYear();
    const hour = date.getHours();
    const min  = date.getMinutes();
    const sec  = date.getSeconds();
    let Z    = date.getTimezoneOffset()/(-0.6);
    let ZzeroCount   = 4 - Z.toString().length;
    if (ZzeroCount>0)
        Z = '0'.repeat(ZzeroCount) + Z;
    format = format.replace(/[DdMmYyHhSsZz]/g, '%$&');


    return format.replace(/%D%D/g, data.toString().length < 2? `0${data}`: data)
        .replace(/%D/g, data)
        .replace(/%d%d%d%d/g, Lure.Culture.WeekDays[day])
        .replace(/%d%d%d/g, Lure.Culture.WeekDaysShort[day])
        .replace(/%M%M%M%M%M/g, Lure.Culture.MonthNamesBanded[mo-1] )
        .replace(/%M%M%M%M/g, isBandMonthName ? Lure.Culture.MonthNamesBanded[mo-1] : Lure.Culture.MonthNames[mo-1] )
        .replace(/%M%M%M/g,  Lure.Culture.MonthNamesShort[mo-1] )
        .replace(/%M%M/g, mo.toString().length < 2 ? `0${mo}`:mo)
        .replace(/%M/g, mo)
        .replace(/%Y%Y%Y%Y/g,year)
        .replace(/%Y%Y/g,year.toString().substring(2,4) )
        .replace(/%Y/g, year)
        .replace(/%H%H/g, hour.toString().length < 2 ? `0${hour}`:hour)
        .replace(/%h%h/g, (hour%12).toString().length < 2 ? `0${(hour%12)}`:(hour%12) )
        .replace(/%H/g, hour)
        .replace(/%h/g, hour % 12 )
        .replace(/%m%m/g, min.toString().length < 2 ? `0${min}`:min)
        .replace(/%m/g, min)
        .replace(/%s%s/g, sec.toString().length < 2 ? `0${sec}`:sec)
        .replace(/%s/g, sec)
        .replace(/%Z/g, `+${Z}`);

}
Lure.Date.isDateValid = (date)=>{
    return (Object.prototype.toString.call(date) === "[object Date]" && !isNaN( date.getTime()));
};



//###
//###TODO Beta
//Draggable alpha

/** @typedef {object} LureDraggable_constructor
 * @property {HTMLElement} Target
 * @property {HTMLElement} Content
 * @property {LureDraggable_Options} Content
 *
 * */
/** @typedef {object} LureDraggable_Options
 * @property {function} OnMove
 * @property {function} OnDrop
 * @property {int[]} Grid
 * @property {int[]} Containment
 *
 * */
class LureDraggable{
    /** @return {int[]} [left, top] */
    get Position(){
        return [this._Position.x, this._Position.y]
    }
    /** @param {int[]} pos */
    set Position(pos){
        this.Content.style.left = pos[0] + 'px';
        this.Content.style.top   = pos[1] + 'px';
    }
    Run(){

        this.Target.addEventListener('mousedown', this._drag);
        document.addEventListener('mousemove', this._move);
        document.addEventListener('mouseup', this._drop);
        return this._isDisabled = true;
    }
    Stop(){
        this.Target.removeEventListener('mousedown', this._drag);
        document.removeEventListener('mousemove', this._move);
        document.removeEventListener('mouseup', this._drop);
        return this._isDisabled = false;
    }

    /**
     *
     * @param {HTMLElement} Target
     * @param {HTMLElement} Content
     * @param {LureDraggable_Options} [Options]
     */
    constructor({
                    Target = null,   //handle
                    Content = null,  //draggable item
                    Options = {
                        OnMove: ()=>{},
                        OnDrop: ()=>{},
                        Grid: [1, 1],
                        Containment: null,
                    }
                }){
        this.Target = Lure.Select(Target);
        this.Content = Content ? Lure.Select(Content) : this.Target;

        this.Parent = this.Content.parentElement;
        this.Content.style.position = 'absolute';
        this.Options = {
            Grid: Options.Grid?  Options.Grid : [1, 1],
            isGridHard: Options.isGridHard ? Options.isGridHard : false,
            Containment: Options.Containment ? Options.Containment : ['auto', 'auto', 'auto', 'auto'],
        };
        this._Position = {
            x: 0,
            y: 0,
        };
        this._isDisabled = false;

        let obj, x, y, prev_x, prev_y;

        let ctn = this.Content;
        let ContentRect = this.Content.getBoundingClientRect();
        let ShiftY = this.Content.offsetTop - ContentRect.y;
        let ShiftX = this.Content.offsetLeft - ContentRect.x;
        let DeltaY = 0;
        let DeltaX = 0;
        this._drag = function(e) {
            obj = ctn;
            ContentRect = obj.getBoundingClientRect();
            ShiftY = obj.offsetTop - ContentRect.y;
            ShiftX = obj.offsetLeft - ContentRect.x;
            prev_x = x - obj.offsetLeft;
            prev_y = y - obj.offsetTop;
        };
        this._move = (e) => {
            if (e.pageX) {
                x = e.pageX;
                y = e.pageY;
            }
            if(obj) {
                //fix position if scrolling
                let ContentRectCurrent = obj.getBoundingClientRect();
                let ShiftYNew = obj.offsetTop - ContentRectCurrent.y;
                let ShiftXNew = obj.offsetLeft - ContentRectCurrent.x;
                DeltaY = ShiftYNew - ShiftY;
                DeltaX = ShiftXNew - ShiftX;
                let res_x = x - prev_x + DeltaX;
                let res_y = y - prev_y + DeltaY;

                ContentRect = ContentRectCurrent;
                if (this.Options.Grid[0] && this.Options.isGridHard && x!==prev_x){
                    res_x = Lure.RoundBy(res_x, this.Options.Grid[0], x<prev_x);
                }
                if (this.Options.Grid[1] && this.Options.isGridHard  && y!==prev_y){
                    res_y = Lure.RoundBy(res_y, this.Options.Grid[1], y<prev_y);
                }
                if (this.Options.Containment[0] !== 'auto' && res_x < this.Options.Containment[0]){
                    res_x = this.Options.Containment[0];
                }
                if (this.Options.Containment[1] !== 'auto' && res_y < this.Options.Containment[1]){
                    res_y = this.Options.Containment[1];
                }
                if (this.Options.Containment[2] !== 'auto' && res_x + obj.clientWidth > this.Options.Containment[2]){
                    res_x = this.Options.Containment[2] - obj.clientWidth;
                }
                if (this.Options.Containment[3] !== 'auto' && res_y + obj.clientHeight > this.Options.Containment[3]){
                    res_y = this.Options.Containment[3] - obj.clientHeight;
                }
                //console.log(res_x, res_y);
                obj.style.left = res_x + 'px';
                obj.style.top = res_y + 'px';
                if (Options.OnMove)
                    Options.OnMove(e);
            }
        };
        this._drop = (e)=>{
            if (!obj)
                return;
            if(obj && !this.Options.isGridHard ) {
                let res_x = x - prev_x + DeltaX;
                let res_y = y - prev_y + DeltaY;
                if (this.Options.Grid[0] && x!==prev_x){
                    res_x = Lure.RoundBy(res_x, this.Options.Grid[0], x<prev_x);
                }
                if (this.Options.Grid[1] && y!==prev_y){
                    res_y = Lure.RoundBy(res_y, this.Options.Grid[1], y<prev_y);
                }
                if (this.Options.Containment[0] !== 'auto' && res_x < this.Options.Containment[0]){
                    res_x = this.Options.Containment[0];
                }
                if (this.Options.Containment[1] !== 'auto' && res_y < this.Options.Containment[1]){
                    res_y = this.Options.Containment[1];
                }
                if (this.Options.Containment[2] !== 'auto' && res_x + obj.clientWidth > this.Options.Containment[2]){
                    res_x = this.Options.Containment[2] - obj.clientWidth;
                }
                if (this.Options.Containment[3] !== 'auto' && res_y + obj.clientHeight > this.Options.Containment[3]){
                    res_y = this.Options.Containment[3] - obj.clientHeight;
                }
                //console.log(res_x, res_y);
                this._Position.x = res_x;
                this._Position.y = res_y;
                obj.style.left = res_x + 'px';
                obj.style.top = res_y + 'px';
            }
            obj = false;
            if (Options.OnDrop)
                Options.OnDrop(e);
        };
        this.Target.addEventListener('mousedown', this._drag);
        document.addEventListener('mousemove', this._move);
        document.addEventListener('mouseup', this._drop);
        this.Target.LureDraggable = this;
    }
};
Lure._Draggable = LureDraggable;
    /**
 *
 * @param {HTMLElement} Target
 * @param {HTMLElement} Content
 * @param {LureDraggable_Options} [Options]
 * @return {LureDraggable}
 */
Lure.Draggable = (Target, Content, Options)=>{
    return new Lure._Draggable({Target:Target, Content:Content, Options:Options});
};

/**
 *
 * @typedef {object} SortableConstructorParameter
 * @property {HTMLElement|string} Container
 * @property {string} Handle
 * @property {string} Item
 * @property {function} OnMove
 * @property {function} OnDrop
 */

/**
 *
 * @typedef {object} DataItem
 * @property {HTMLElement} Handle
 * @property {HTMLElement} Item
 * @property {int} LineID
 * @property {int} Order
 * @property {function} OnDrag
 */

class LureSortable{
    _Init(){
        /** @type DataItem[] */
        this._DataList = [];
        this._EV = {
            x: 0,
            y: 0,
            prev_x: 0,
            prev_y: 0,
            ContentRect: void 0,
        };
        /** @type DataItem */
        this._CurrentData = null;
        this._ClonedItem = null;
        if (this.ItemList.length !== this.HandleList.length){
            console.warn('[Lure.Sortable] Handle query selector is not unique in Item (or Handle count must be equal to Item count)!');
            this.Destroy();
            return;
        }
        for (let i = 0; i < this.HandleList.length; i++){
            const h = this.HandleList[i];
            const OnDragDelegate = (e)=>this._Drag(e, i);
            h.addEventListener('mousedown', OnDragDelegate);
            this._DataList.push({
                Handle: h,
                Item: this.ItemList[i],
                OnDrag: OnDragDelegate,
                LineID: i,
                Order: i,
            })
        }
    }
    _CheckContainerPosition(){
        const pos = getComputedStyle(this.Container).position.toLowerCase();
        if (pos !== 'absolute' && pos !== 'relative')
            this.Container.style.position = 'relative';
    }
    _Drag(e, LineID){
        if (e.button === 2)
            return;
        this._CurrentData = this._DataList[LineID];
        this._ClonedItem = this._CurrentData.Item.cloneNode(true);
        this._CurrentData.Item.classList.add('l-srt-ghost');
        this._ClonedItem.classList.add('l-srt-cloned');
        this._ClonedItem.style.position = 'absolute';



        this._EV.prev_x = this._EV.x - this._CurrentData.Item.offsetLeft;
        this._EV.prev_y = this._EV.y - this._CurrentData.Item.offsetTop;


        this._EV.ContentRect = this._CurrentData.Item.getBoundingClientRect();
        this._EV.ContainerRect = this.Container.getBoundingClientRect();

        this._ClonedItem.style.left = this._CurrentData.Item.offsetLeft + 'px';
        this._ClonedItem.style.top = this._CurrentData.Item.offsetTop + 'px';

        this._ClonedItem.style.width = this._EV.ContentRect.width + 'px';
        this._ClonedItem.style.height = this._EV.ContentRect.height + 'px';
        this._ClonedItem.style.margin = '0';

        this.Container.appendChild(this._ClonedItem);
        if (this._CustomOnDrag)
            this._CustomOnDrag(e);
    }
    _Drop(e){
        if (this._CurrentData === null)
            return;

        this._CurrentData.Item.classList.remove('l-srt-ghost');
        this._ClonedItem.remove();
        this._ClonedItem = null;
        this._CurrentData = null;
        if (this._CustomOnDrop)
            this._CustomOnDrop(e);
    }
    _Move(e){
        if (e.pageX) {
            this._EV.x = e.pageX;
            this._EV.y = e.pageY;
        }
        if (this._ClonedItem === null)
            return;
        e.preventDefault();

        let res_x = this._EV.x - this._EV.prev_x;
        let res_y = this._EV.y - this._EV.prev_y;


        let ClonedCenter = {
            x: this._ClonedItem.offsetLeft + this._EV.ContentRect.width/2 + this._EV.ContainerRect.x,
            y: this._ClonedItem.offsetTop + this._EV.ContentRect.height/2 + this._EV.ContainerRect.y
        };

        const ElementFromPoint = document.elementsFromPoint(ClonedCenter.x, ClonedCenter.y)
            .Where(el=>this.ItemList.indexOf(el) > -1 && el !== this._CurrentData.Item)
            .FirstOrDefault();
        if (ElementFromPoint !== null){
            const ItemData = this._DataList.Where(x=>x.Item === ElementFromPoint).FirstOrDefault();
            const item = ItemData.Item;
            const Rect = item.getBoundingClientRect();
            const ItemCenter = {
                x: item.offsetLeft + Rect.width/2 + this._EV.ContainerRect.x,
                y: item.offsetTop + Rect.height/2 + this._EV.ContainerRect.y
            };
            //console.log(`----1-----`,ItemCenter.x, ClonedCenter.x);
            if (   ((ClonedCenter.y > ItemCenter.y || ClonedCenter.x > ItemCenter.x)  && this._CurrentData.Order < ItemData.Order)
                || ((ClonedCenter.y < ItemCenter.y || ClonedCenter.x < ItemCenter.x ) && this._CurrentData.Order > ItemData.Order))
            {
                //console.log(`order tar: ${ItemData.Order}, curr: ${this._CurrentData.Order}`, ItemData.Item, this._CurrentData.Item);
                Lure.DOM.Swap(item, this._CurrentData.Item);
                let ord = ItemData.Order;
                ItemData.Order = this._CurrentData.Order;
                this._CurrentData.Order = ord;
            }

        }
        this._ClonedItem.style.left = res_x + 'px';
        this._ClonedItem.style.top = res_y + 'px';
        if (this._CustomOnMove)
            this._CustomOnMove(e);
    }

    /**
     *
     * @returns {int[]}
     */
    get Order(){
        return this._DataList
            .Select((x,i)=>{
                return {Order: x.Order, LineID:i}
            })
            .sort((a,b)=> a.Order - b.Order)
            .Select(x=>x.LineID);
        //return this._DataList.Select(x=>x.Order);
    }

    /**
     *
     * @param {int[]} OrderList
     */
    set Order(OrderList){
        if (OrderList.length === 0)
            return;
        if (Math.max.apply(null, OrderList) > this._DataList.length)
            return console.warn(`[Lure.Sortable] set Order error. OrderList must has indexes of sortable Items`);

        for (let Order = 0; Order < OrderList.length; Order++){
            let Index = OrderList[Order];
            let Itm = this._DataList[Index];
            if (!Itm){
                return console.warn(`[Lure.Sortable] set Order error. OrderList must has indexes of sortable Items`);
            }
            Itm.Order = Order;
            this.Container.appendChild(Itm.Item);
        }
    }
    Refresh(){
        this.ItemList    = Lure.SelectAll(this._QueryItem, this.Container).ToList();
        this.HandleList  = Lure.SelectAll(this._QueryHandle, this.Container).ToList();

        for (let Itm of this._DataList){
            Itm.Handle.removeEventListener('mousedown', Itm.OnDrag);
        }
        this._Init();
    }
    Destroy(){
        for (let Itm of this._DataList){
            Itm.Handle.removeEventListener('mousedown', Itm.OnDrag);
        }
        this._Ev = null;
        this._DataList = null;
        this.HandleList = null;
        this.ItemList = null;
    }
    /**
     *
     * @param {HTMLElement|string} Container
     * @param {string} Handle
     * @param {string} Item
     * @param {function} OnMove
     * @param {function} OnDrop
     * @param {function} OnDrag
     */
    constructor({
                    Container = null,
                    Handle    = '',
                    Item      = '',
                    OnMove    = (e)=>{},
                    OnDrop    = (e)=>{},
                    OnDrag    = (e)=>{},

                }={}){
        this._CustomOnDrag = OnDrag;
        this._CustomOnDrop = OnDrop;
        this._CustomOnMove = OnMove;
        this._QueryItem   = Item;
        this._QueryHandle = Handle;
        this.Container   = Lure.Select(Container);
        this.ItemList    = Lure.SelectAll(Item, this.Container).ToList();
        this.HandleList  = Lure.SelectAll(Handle, this.Container).ToList();


        this._CheckContainerPosition();
        this._Init();
        document.addEventListener('mouseup', (e)=>this._Drop(e));
        document.addEventListener('mousemove', (e)=>this._Move(e));
    }
}
Lure.Sortable = LureSortable;




Lure.Listener = class LureListener {
    Run(){
        this.Stop();
        this._Interval = setInterval(()=>{
            this._Listen();
        }, this.Freq)
    }
    Stop(){
        clearInterval(this._Interval);
        clearTimeout(this._TimeOut);
    }

    _Listen(){
        if (!this.Target){
            this.Stop();
        }
        let Width = this.Target.clientWidth;
        if (Width !== this.Width){
            this.Width = Width;
            return this._OnEvent('width');
        }
        let Height = this.Target.clientHeight;
        if (Height !== this.Height){
            this.Height = Height;
            return this._OnEvent('height');
        }
    }
    _OnEvent(){
        clearTimeout(this._TimeOut);
        this._TimeOut = setTimeout(()=>{
            this.OnEvent();
        }, this.Delay)

    }
    constructor({
                    Target = null,
                    Type   = 'resize',
                    Freq   = 20,
                    Delay  = 0,
                    OnEvent = ()=>{},
                }={}){
        this.Target = Lure.Select(Target);
        if (this.Target === null)
            return;
        this.Type = 'resize';
        this.Freq = Freq;
        this.Delay = Delay;
        this.OnEvent = OnEvent;

        this._Interval = null;
        this._TimeOut    = null;

        this.Width  = this.Target.clientWidth;
        this.Height = this.Target.clientHeight;

        this._Timer = 0;
        this.Run();


    }
};




/*### Lure smart hint show manager. Auto-switch hint direction when out of screen (TargetArea) */

/**
 * @typedef {Object} HintPackT
 * @property {int} ID
 * @property {HTMLElement} Target
 * @property {HTMLElement} Hint
 * @property {DOMRect} Rect
 * @property {int} TimeoutToShow
 * @property {int} TimeoutToHide
 */

class LureHint {
    RunListen(){
        this.Config.TargetArea.addEventListener('mouseover', this._ListenToShow.bind(this));
    }
    StopListen(){
        this.Config.TargetArea.removeEventListener('mouseover', this._ListenToShow.bind(this));
    }

    _ListenToShow(e){
        if (Lure.DOM.isQuery(e.target, this.Config.QuerySelector)){
            const HinID = e.target.LHintID;
            /**
             * @type {HintPackT}
             */
            let HintPack;
            if (HinID > 0){
                HintPack = this._HintDict[e.target.LHintID];
            }else{
                HintPack = {
                    ID: this._HintCounter++,
                    Target: e.target,
                    Hint: null,
                    TimeoutToShow: null,
                    TimeoutToHide: null,
                };
                this._HintDict[HintPack.ID] = HintPack;
                HintPack.Target.LHintID = HintPack.ID;
                HintPack.Target.addEventListener('mouseleave', (e)=>this._ListenToHide(e, HintPack))
            }
            clearTimeout(HintPack.TimeoutToHide);
            clearTimeout(HintPack.TimeoutToShow);
            HintPack.TimeoutToShow = setTimeout(()=>{
                this._Show(HintPack);
            }, this.Config.Delay)
        }
    }
    _ListenToHide(e, HintPack){
        //const HintPack = this._HintDict[e.target.LHintID];
        if (HintPack){

            HintPack.TimeoutToHide = setTimeout(()=>{
                this._Hide(HintPack);
            }, this.Config.Duration)
        }
    }


    _GetPos(Direction, Rect, RectHint, RectContainment){
        let PosX = -RectContainment.x;
        let PosY = -RectContainment.y;
        if (Direction === 'bottom-right'){
            PosX += Rect.x + Rect.width + this.Config.Margin.x;
            PosY += Rect.y + Rect.height + this.Config.Margin.y;
        }
        else if (Direction === 'bottom-left'){
            PosX += Rect.x - RectHint.width;
            PosY += Rect.y + Rect.height + this.Config.Margin.y;
        }
        else if (Direction === 'top-right'){
            PosX += Rect.x + Rect.width + this.Config.Margin.x;
            PosY += Rect.y - RectHint.height - this.Config.Margin.y;
        }
        else if (Direction === 'top-left'){
            PosX += Rect.x - RectHint.width - this.Config.Margin.x;
            PosY += Rect.y - RectHint.height - this.Config.Margin.y;
        }
        return {
            x: PosX,
            y: PosY,
        }
    }

    /**
     *
     * @param {HintPackT} HintPack
     * @private
     */
    _Show(HintPack){
        if (!HintPack.Hint)
            HintPack.Hint = this.Config.Render(HintPack);


        const Rect = HintPack.Target.getBoundingClientRect();
        let RectContainment = this.Config.TargetArea.getBoundingClientRect();
        if (!HintPack.Hint.parentElement)
            this.Config.TargetArea.appendChild(HintPack.Hint);
        const RectHint = HintPack.Hint.getBoundingClientRect();


        let Direction = this.Config.Direction;
        if (this.Config.isContainment){

            let Directions = Direction.split('-');
            if (Rect.y + Rect.height + RectHint.height + this.Config.Margin.y > RectContainment.y + RectContainment.height){
                Directions[0] = 'top';
            }
            else if (Rect.y - RectHint.height - this.Config.Margin.y < RectContainment.y){
                Directions[0] = 'bottom';
            }

            if (Rect.x + Rect.width + RectHint.width + this.Config.Margin.x > RectContainment.x + RectContainment.width){
                Directions[1] = 'left';
            }
            else if (Rect.x - RectHint.width - this.Config.Margin.x < RectContainment.x){
                Directions[1] = 'right';
            }
            HintPack.Hint.classList.remove(Direction);
            Direction = Directions.join('-');
            HintPack.Hint.classList.add(Direction);
        }
        const Pos = this._GetPos(Direction, Rect, RectHint, RectContainment);
        HintPack.Hint.style.left = Pos.x + 'px';
        HintPack.Hint.style.top  = Pos.y + 'px';
        this.Config.MethodShow(HintPack.Hint);
    }
    _Hide(HintPack){
        //return;
        this.Config.MethodHide(HintPack.Hint);
        setTimeout(()=>{
            HintPack.Hint.remove();
        }, this.Config.AnimationDuration)
    }

    /**
     * @callback LHintRender
     * @param {HintPackT}
     * @return {HTMLElement}
     */
    /**
     * @typedef {object} PosObject
     * @property {int} x
     * @property {int} y
     */
    /**
     *
     * @param {HTMLElement} [TargetArea]
     * @param {string} [ExtraClassNames]
     * @param {string} [QuerySelector]
     * @param {string} [DataProp]
     * @param {string} [Direction]
     * @param {PosObject} [Margin]
     * @param {int} [Delay] time before hint will be shown
     * @param {int} [Duration] time before hint will be started hiding
     * @param {boolean} [isContainment] Auto-switch hint direction when out of screen (TargetArea)
     * @param {function} [MethodShow] default: elem.style.opacity = 1
     * @param {function} [MethodHide] default: elem.style.opacity = 0
     * @param {LHintRender} [Render] custom hint-element render
     */
    constructor({
                    TargetArea = document.body,
                    ExtraClassNames = '',
                    QuerySelector = '.l-hint',
                    DataProp = 'hint',
                    Direction = 'top-right',
                    Margin = {x: 0, y: 0},
                    Delay = 0,
                    Duration = 0,

                    isContainment = true,

                    MethodShow = (elem)=>elem.style.opacity = '1',
                    MethodHide = (elem)=>elem.style.opacity = '0',
                    Render = (HintPack)=>{
                        let HintText = HintPack.Target.dataset[this.Config.DataProp];
                        return Lure.CreateElementFromString(`<div class="l-hint-pop ${this.Config.ExtraClassNames}">${HintText}</div>`);
                    }
                }={}){
        this._HintCounter = 1;
        this._HintDict = {};
        this.Config = {
            DataProp,
            Delay,
            Duration,
            Direction,
            Margin,
            TargetArea,
            QuerySelector,
            isContainment,
            ExtraClassNames,
            AnimationDuration: Lure.GetDurationAnimation('l-hint-pop'),

            MethodShow,
            MethodHide,
            Render,
        };

        const pos = getComputedStyle(TargetArea).position.toLowerCase();
        if (pos !== 'absolute' && pos !== 'relative')
            TargetArea.style.position = 'relative';

        this.RunListen();
    }
}

Lure.Hint = LureHint;









/*### Lure pop log manager */

/**
 * @typedef {object} ShowMessageOptions
 * @property [Duration]
 * @property [LogItem]
 */



class LurePopLog{
    _ParseLink(text){
        if (!text.replace)
            return text;
        return text.replace(this._RegexLink, (m,link, c, capt)=>{
            //return text.replace(m, `<a class="a" href="${link}">${capt?capt:link}</a>`);
            return `<a class="a" href="${link}">${capt?capt:link}</a>`

        })
    }

    /**
     * @param {HTMLElement} [Target]
     * @param {number} [AnimationDuration] showing/hiding transition time
     * @param {number} [Duration] time until begin hide
     * @param {object} [Style]
     * @param {boolean} [isNewInstance]
     */
    constructor({
                    Target            = document.body,
                    AnimationDuration = Lure.Settings.PopLog.Default.AnimationDuration,
                    Duration          = Lure.Settings.PopLog.Default.Duration,
                    Style             = {},
                    isNewInstance = false,
                }={}){
        this._RegexLink = new RegExp(`\\[link=([\\s\\S]*?);?(title=([\\s\\S]*?))?\\]`, 'g');
        Target = Lure.Select(Target);
        Lure.PopLog.Count = Lure.PopLog.Count ? Lure.PopLog.Count++: 1;
        /**
         * @type {{AnimationDuration: number, Duration: number, Style: Object}}
         */
        this.Options = {
            AnimationDuration: AnimationDuration,
            Duration: Duration,
            // Style: {
            //     // padding:           Style.padding         ? Style.padding         : '10px 20px',
            //     // marginTop:         Style.marginTop       ? Style.marginTop       : "5px",
            //     // borderRadius:      Style.borderRadius    ? Style.borderRadius    : "0px",
            //     // backgroundColor:   Style.backgroundColor ? Style.backgroundColor : '#d00',
            //     // color:             Style.color           ? Style.color           : "#fff",
            // },
            Style: Style,
        };
        let Block;
        if (!isNewInstance){
            Block = Lure.Select('#l-pop-log-hook-1');
        }
        if (isNewInstance || Block === null){
            Block = Lure.CreateElementFromString(`<div class="l-pop-log-hook" id="l-pop-log-hook-${Lure.PopLog.Count}"></div>`);
        }
        Target.appendChild(Block);
        /**
         *
         * @param {string} text
         * @param {string} type
         * @param {ShowMessageOptions} opt
         * @private
         */
        this._AddLine = (text, type='', opt={}) => {
            text = this._ParseLink(text);
            const AnimationDuration = this.Options.AnimationDuration;
            const Duration = opt.Duration === void 0 ? this.Options.Duration : opt.Duration;

            const TemplateDefault = `<div class="l-pop-log ${type}" style="transition-duration: ${AnimationDuration}ms;">
                                    <div class="l-pop-log__close"></div>
                                    <div class="l-pop-log__text">${text}</div>
                                    <div class="l-pop-log__life" style="transition-duration: ${Duration}ms;"></div>
                                 </div>`;
            const div = Lure.CreateElementFromString(TemplateDefault);
            for (let style in this.Options.Style){
                if (!this.Options.Style.hasOwnProperty(style))
                    continue;
                div.style[style] = this.Options.Style[style];
            }
            const LifeLine    = Lure.Select('.l-pop-log__life', div);
            const ButtonClose = Lure.Select('.l-pop-log__close', div);
            ButtonClose.addEventListener('click', ()=>{
                clearTimeout(DestroyTimeout);
                div.style.opacity = '0';
                setTimeout(()=>{
                    div.remove();
                }, Math.round(AnimationDuration))
            });

            let DestroyTimeout = setTimeout(()=>{
                div.style.opacity = '0';
                setTimeout(()=>{
                    div.remove();
                }, AnimationDuration)
            }, Duration);
            div.addEventListener('mouseover', ()=>{
                LifeLine.style.width = LifeLine.clientWidth + 'px';
                clearTimeout(DestroyTimeout);
            });
            div.addEventListener('mouseleave', ()=>{
                const wp = div.clientWidth;
                const w = LifeLine.clientWidth;
                const TimeToDestroy = Math.round(w/wp * Duration);
                LifeLine.style.width = '0';
                LifeLine.style.transitionDuration = TimeToDestroy + 'ms';
                DestroyTimeout = setTimeout(()=>{
                    div.style.opacity = '0';
                    setTimeout(()=>{
                        div.remove();
                    }, Math.round(AnimationDuration))
                }, TimeToDestroy)
            });
            ///
            Block.appendChild(div);
            div.style.opacity = '1';
            setTimeout(function () {
                LifeLine.style.width = '0';
            }, 50);
        };
    }

    /**
     * @param {string} text
     * @param {ShowMessageOptions} opt
     */
    Success(text, opt={}){
        this._AddLine(text, 'success', opt);
    }
    /**
     * @param {string} text
     * @param {ShowMessageOptions} opt
     */
    Error(text, opt={}){
        this._AddLine(text, 'error', opt);
        console.error(opt.LogItem? opt.LogItem : text);
    }
    /**
     * @param {string} text
     * @param {ShowMessageOptions} opt
     */
    Warn(text, opt={}){
        this._AddLine(text, 'warning', opt);
        console.warn(opt.LogItem? opt.LogItem : text);
    }
    /**
     * @param {string} text
     * @param {ShowMessageOptions} opt
     */
    Notice(text, opt={}){
        this._AddLine(text, 'notice', opt);
        if (opt.LogItem)
            console.log(opt.LogItem)
    }

    ShowSuccess(text){
        this._AddLine(text, 'success');
    }
    ShowError(text){
        this._AddLine(text, 'error');
    }
    ShowWarn(text){
        this._AddLine(text, 'warning');
    }
    ShowNotice(text){
        this._AddLine(text, 'notice');
    }
}
Lure.PopLog = LurePopLog;




class LureImageViewer {
    /** @param {string[]} ImageSrcList */
    Run(ImageSrcList){
        if (!ImageSrcList || ImageSrcList.length < 1)
            return console.log('[Lure.ImageViewer] Images source is empty');
        this._Context.State.ImageSrcList = ImageSrcList;
        this._Context.State.ImageIndex = 0;
        this._Context.NextImage(0);
        this.Show();
    }
    Show(){
        this._Context.Show();
    }
    Hide(){
        this._Context.Hide();
    }
    /**
     * @param {string[]} ImageList
     * @param {HTMLElement | string} Target
     */
    constructor({
                    ImageList = [],
                    Target = 'body',
                }){

        let ImgNoImage = new Image();
        ImgNoImage.src = 'lure/img/no-image.svg';

        let ImageCache = {};
        /**
         * @class LureImageViewerContext
         * @mixes LureContent
         */
        const LureImageViewerContext = new Lure.Content({
            Target: Target,
            Dialog: {
                Wrapper: true,
                WrapperHandle: true,
            },
            //<div class="l-iv-pending {{#if (o.isPending) ? '':'none'}} none"></div>
            Content: `<div class="l-image-viewer">
                        <div class="l-close"></div>
                        <div class="i-iv-inner">
                            <div class="i-iv-slider">
                                <div class="l-iv-control l-iv-control-left"></div>
                                <div class="l-iv-body">
                                    <div class="l-iv-image-holder"></div>
                                </div> 
                                <div class="l-iv-control l-iv-control-right"></div>
                            </div> 
                            <div class="i-iv-paging">{{ImageIndex+1}} / {{ImageSrcList.length}}</div>
                        </div>
                      </div>`,
            Load: '.l-iv-body',
            State: {
                ImageSrcList: ImageList,
                //isPending: true,

                ImageIndex: 0,

                ImagePrevent: {
                    Src: '',
                    Promise: void 0,
                },
            },
            Props: function () {
                this.BlockPending = this.Select('.l-iv-pending');
                this.ImageCanvas = this.Select('.l-iv-body');
                this.ImageHolder = this.Select('.l-iv-image-holder');

                this.ButtonPrev = this.Select('.l-iv-control-left');
                this.ButtonNext = this.Select('.l-iv-control-right');
            },
            Methods: function () {
                this.ChangeIndex = function (direction) {
                    this.State.ImageIndex += direction;
                    if (this.State.ImageIndex >= this.State.ImageSrcList.length){
                        this.State.ImageIndex = 0;
                    }
                    if (this.State.ImageIndex < 0){
                        this.State.ImageIndex = this.State.ImageSrcList.length - 1;
                    }
                };
                this.PreventingImage = function (direction) {
                    let indexPrevent = this.State.ImageIndex + direction;
                    if (indexPrevent >= this.State.ImageSrcList.length){
                        indexPrevent = 0;
                    }
                    if (indexPrevent < 0){
                        indexPrevent = this.State.ImageSrcList.length - 1;
                    }
                    const src = this.State.ImageSrcList[indexPrevent];
                    if (ImageCache[src])
                        return this.State.ImagePrevent = {
                            Src: src,
                            Promise: Promise.resolve(ImageCache[src]),
                        };
                    this.State.ImagePrevent = {
                        Src: src,
                        Promise: new Promise((resolve) => {
                            let img = new Image();
                            img.onload = () => {
                                ImageCache[src] = img;
                                resolve(img);
                            };
                            img.onerror = ()=>{
                                ImageCache[src] = ImgNoImage;
                                resolve(ImgNoImage);
                            };
                            img.src = src;
                        })
                    };

                };
                this.GetImage = function (src) {
                    if (ImageCache[src])
                        return Promise.resolve(ImageCache[src]);
                    this.Load.Show();
                    if (this.State.ImagePrevent.Src === src)
                        return Lure.Call(this.State.ImagePrevent.Promise, {Then: ()=>this.Load.Hide()});
                    return new Promise((resolve, reject) => {
                        let img = new Image();
                        img.onload = () => {
                            ImageCache[src] = img;
                            resolve(img);
                            this.Load.Hide();
                        };
                        img.onerror = ()=>{
                            ImageCache[src] = ImgNoImage;
                            resolve(ImgNoImage);
                            this.Load.Hide();
                        };
                        img.src = src;
                    });
                };
                this.NextImage = function (direction) {
                    if (this.Load.isActive)
                        return;
                    this.ChangeIndex(direction);
                    this.GetImage(this.State.ImageSrcList[this.State.ImageIndex])
                        .then((Img)=>{
                            this.ImageHolder.innerHTML = '';
                            this.ImageHolder.appendChild(Img);
                            this.Proto.Refresh();
                    });
                    this.PreventingImage(direction);
                };
            },
            AfterBuild: function () {
                this.ButtonPrev.addEventListener('click', ()=>this.NextImage(-1));
                this.ButtonNext.addEventListener('click', ()=>this.NextImage(1));
                this.Select('.l-close').addEventListener('click', ()=>this.Hide());
            }

        });

        this._Context = LureImageViewerContext;
    }
}
Lure.ImageViewer = LureImageViewer;




/** @typedef {object} LureSmartTextbox_DataPrepared
 *  @property {*} Value
 *  @property {*} View
 *  @property {*} Original
 */

/** @callback LureSmartTextbox_DelegateSearch
 * @param {string} Text
 * @param {*} OriginalItem
 * @return {boolean}
 */
/** @callback LureSmartTextbox_DelegateOnSelect
 * @param {*} Value
 * @param {string} Text
 * @param {*} OriginalItem
 */

/** @callback LureSmartTextbox_DataGetter
 * @param {string} Text
 * @return {Promise<[]>}
 */

class LureSmartTextbox {
    static get Version(){
        return '0.2.1';
    }
    /**
     * @param {Array} Data
     * @return LureSmartTextbox_DataPrepared[]
     */
    _PrepareData(Data){
        let Prepared = [];
        for (let d of Data){
            Prepared.push({
                Original: d,
                Value: this.Config.DelegateValue(d),
                View:  this.Config.DelegateView(d),
            })
        }
        return Prepared;
    }
    /**
     * @param {LureSmartTextbox_DataPrepared} Item
     * @param {boolean} [isCallback]
     * */
    _OnChoose(Item, isCallback=true) {
        if (this._State.CurrentItem === Item)
            return this._Textbox.value = Item.View;
        this._State.Text = Item.View;
        this._State.CurrentItem = Item;
        this._Textbox.value = Item.View;
        this._DoFilter(Item.View);
        if (!isCallback)
            return;
        this._UpdateOwner();
    }
    /** @param {string} text
     *  @param {boolean} isShowListAnyway (true if click drop icon)
     * */
    _DoFilter(text, isShowListAnyway=false) {
        // if (this.Config.isReadOnly)
        //     return;
        if (!isShowListAnyway && text === '' && this.Config.isHideFullHintListOnEmpty){
            return this._Controller.Filter(()=>false);
        }
        text = text.toString().toLowerCase();
        const textAlt = Lure.String.KeyboardSwitch(text);
        if (this.Config.DelegateSearch !== null){
            return this._Controller.Filter(
                /** @param {LureSmartTextbox_DataPrepared} x */
                (x)=>this.Config.DelegateSearch(text, x.Original)
            );
        }
        this._Controller.Filter(
            /** @param {LureSmartTextbox_DataPrepared} x */
            (x) => x.View.toString().toLowerCase().indexOf(text) > -1 || x.View.toString().toLowerCase().indexOf(textAlt) > -1
        );
    }
    /** @param {boolean} isGetFirstIfMoreThanOne */
    _CheckValue(isGetFirstIfMoreThanOne) {
        if (this.Config.isNotFoundValueTracking){
            const Length = this._Controller.DataRender.length;
            const DataLast = this._Controller.DataRender.FirstOrDefault();
            //console.log('-check-', Length, DataLast);
            if (DataLast === null || (Length !== 1 && !isGetFirstIfMoreThanOne && (!this.Config.isShowFullHintListOnFocus && this._State.CurrentItem !== null))){
                if (!this.Config.isInput){
                    this._Textbox.value = '';
                    this._State.Text = '';
                }
                this._State.CurrentItem = null;
                this._UpdateOwner();
            }
            else if(DataLast !== null && (Length === 1 || (Length > 1 && isGetFirstIfMoreThanOne))){
                this._OnChoose(DataLast);
            }
            else if (this._State.CurrentItem !== null){
                this._Textbox.value = this._State.CurrentItem.View;
            }
        }
    }
    _UpdateOwner(){
        let PropertyValue = this.Config.NotFoundValue;
        let FactValue = this.Config.NotFoundValue;
        let View = this._State.Text;

        if (this._State.CurrentItem){
            FactValue = this._State.CurrentItem.Value;
        }
        if (!this.Config.isInput && this._State.CurrentItem){
            PropertyValue = this._State.CurrentItem.Value;

        }
        if (this.Config.isInput){
            PropertyValue = this._State.Text;
        }
        //console.log('_UpdateOwner()');
        if (this.Config.PropertyBind && this.Config.Owner){
            this.Config.Owner.Proto.SetProperty(this.Config.PropertyBind, PropertyValue);
        }
        this.Config.OnSelect(FactValue, View, this._State.CurrentItem ? this._State.CurrentItem.Original: null);
    }
    /** @param {Event} e */
    _TextboxListener(e) {
        const text = e.currentTarget.value;
        this._State.Text = text;
        this._DoFilter(text);
        if (this.Config.isInput){
            this._UpdateOwner();
        }
    }

    get Data(){
        return this.Config.Data.Select(x=>x.Original);
    }
    set Data(newData){
        this.Config.Data = this._PrepareData(newData);
        return this._Controller.Refresh(this.Config.Data);
    }
    Refresh(){
        return this._Controller.Refresh(this._PrepareData(this.Config.Data));
    }

    get Value(){
        if (!this._State.CurrentItem)
            return this.Config.NotFoundValue;
        return this.Config.DelegateValue(this._State.CurrentItem.Original);
    }

    set Value(val){
        if (this.Config.isInput){
            this._State.Text = val;
            this._Textbox.value = val;
            return;
        }
        const DataItem = this._Controller.GetDataItemByDelegate(x=>x.Value === val);
        if (DataItem !== null){
            this._OnChoose(DataItem.Data, false);
            this.Config.OnSetValue(val, DataItem.Data.View, DataItem.Data.Original);
            return;
        }
        this._State.Text = '';
        this._State.CurrentItem = null;
        this._Textbox.value = '';

        return val; //return console.log('[Lure.SmartTextbox] New values is not found', val);
    }

    get ValueOriginal(){
        if (!this._State.CurrentItem){
            return null;
        }
        return this._State.CurrentItem.Original;
    }
    set ValueOriginal(Item){
        if (Item === null || Item === void 0){
            this._State.Text = '';
            this._State.CurrentItem = null;
            this._Textbox.value = '';
            return Item;
        }
        this._State.CurrentItem = {
            Original: Item,
            Value: this.Config.DelegateValue(Item),
            View:  this.Config.DelegateView(Item),
        };
        this.Config.OnSetValue(this._State.CurrentItem.Value, this._State.CurrentItem.View, Item);
        this._State.Text = this.Config.DelegateView(Item);
        this._Textbox.value = this._State.Text;
        return Item;
    }

    get Text(){
        return this._State.Text;
    }

    async SetValueAsync(val){
        if (this.Config.isInput){
            this._State.Text = val;
            this._Textbox.value = val;
            return;
        }
        const DataItem = this._Controller.GetDataItemByDelegate(x=>this.Config.DelegateValue(x.Original) === val);
        if (DataItem !== null){
            this._OnChoose(DataItem.Data, false);
            await this.Config.OnSetValue(val, DataItem.Data.View, DataItem.Data.Original);
            return;
        }
        this._State.Text = '';
        this._State.CurrentItem = null;
        this._Textbox.value = '';

        return val; //return console.log('[Lure.SmartTextbox] New values is not found', val);
    }
    async SetValueOriginalAsync(Item){
        this._State.CurrentItem = {
            Original: Item,
            Value: this.Config.DelegateValue(Item),
            View:  this.Config.DelegateView(Item),
        };
        await this.Config.OnSetValue(this._State.CurrentItem.Value, this._State.CurrentItem.View, Item);
        this._State.Text = this.Config.DelegateView(Item);
        this._Textbox.value = this._State.Text;
        return Item;
    }
    get Disabled(){
        return this._State.Disabled;
    }
    set Disabled(isDisabled){
        this._State.Disabled = isDisabled;
        this._Textbox.disabled = isDisabled;
        if (isDisabled)
            this._DropIcon.classList.remove('l-pointer');
        else if (!isDisabled && !this._DropIcon.classList.contains('l-pointer'))
            this._DropIcon.classList.add('l-pointer');
    }

    /**
     * @param {HTMLElement} Target
     * @param {*[]} Data (offer list)
     * @param {string} [Type] (textbox type, default: text)
     * @param {string} [Placeholder]
     * @param {LureSmartTextbox_DataGetter} [DataGetter] ( returns Promise of offer list)
     * @param {LureSmartTextbox_DelegateSearch} [DelegateSearch] ()
     * @param {function} [DelegateValue] (select property what will be set. originalItem value as default)
     * @param {function} [DelegateView] (select property what will be shown in textbox. originalItem value as default)
     * @param {string} [PropertyBind] (what property of Owner.State will be set. nothing if not defined)
     * @param {LureSmartTextbox_DelegateOnSelect} [OnSelect] (callback function)
     * @param {LureSmartTextbox_DelegateOnSelect} [OnSetValue] (callback function when set .Value)
     * @param {boolean} [isNotFoundValueTracking] (if true set 'NotFoundValue' on textbox blur)
     * @param {*} [NotFoundValue] (what property will be set if value not found)
     * @param {LureContent} [Owner] (Lure.Content)
     *
     * @param {boolean} [isInput] (set true, if you want to get value anyway. Like it is just textbox with hint-list (if available))
     * @param {?string} [EmptyText] (will be shown when hint-list is empty. Set null if you want hide EmptyText by the way)
     * @param {boolean} [isShowFullHintListOnFocus] (reset hint list filter on focus)
     * @param {boolean} [isHideFullHintListOnEmpty=false] (reset hint list filter on focus)
     * @param {boolean} [isReadOnly] (if true, this component will be like <select>)
     */
    constructor({
                    Target = null,
                    Data = [],
                    Type = 'text',
                    Placeholder = '',

                    DataGetter = null,
                    DelegateSearch = null,
                    DelegateValue  = (x)=>x,
                    DelegateView   = (x)=>x,
                    OnSelect = (val, text, originalItem)=>{},
                    OnSetValue = (val, text, originalItem)=>{},


                    isInput = false,
                    isReadOnly = false,
                    EmptyText = '',
                    isNotFoundValueTracking = true,
                    NotFoundValue = null,

                    isShowFullHintListOnFocus = false,
                    isHideFullHintListOnEmpty = false,
                    PropertyBind = void 0,
                    Owner = null,
                }={}){
        if (Target === null || Target === void 0){
            return console.error('[Lure.SmartTextbox] Target is null or undefined');
        }


        /**
         *
         * @type {{Owner: LureContent, isInput: boolean, DelegateValue: Function, PropertyBind: string, isHideFullHintListOnEmpty: boolean, OnSetValue: LureSmartTextbox_DelegateOnSelect, Data: *[], DelegateView: Function, DelegateSearch: LureSmartTextbox_DelegateSearch, isReadOnly: boolean, EmptyText: *, OnSelect: LureSmartTextbox_DelegateOnSelect, isNotFoundValueTracking: boolean, DataGetter: LureSmartTextbox_DataGetter, NotFoundValue: *, isShowFullHintListOnFocus: boolean}}
         */
        this.Config = {
            DelegateSearch: DelegateSearch,
            DelegateValue: DelegateValue,
            DelegateView: DelegateView,
            PropertyBind: PropertyBind,
            isNotFoundValueTracking: isNotFoundValueTracking,
            isShowFullHintListOnFocus: isShowFullHintListOnFocus,
            isHideFullHintListOnEmpty: isHideFullHintListOnEmpty,
            NotFoundValue: NotFoundValue,
            OnSelect: OnSelect,
            OnSetValue: OnSetValue,
            Data: Data,
            DataGetter: DataGetter,
            isInput: isInput,
            isReadOnly: isReadOnly,
            EmptyText: EmptyText === '' ? Lure.Culture.Lang.ListEmpty : EmptyText,
            Owner: Owner,
        };
        this.Config.Data = this._PrepareData(Data);
        this._State = {
            Disabled: false,
            Text: '',
            /** @type ?LureSmartTextbox_DataPrepared */
            CurrentItem: null,

            isListOpen: false,
        };
        this._Content = Lure.CreateElementFromString(
            `<div class="l-textbox-smart">
                 <input class="l-textbox l-ts-textbox" type="${Type}" placeholder="${Placeholder}">
                 <div class="l-ts-drop-icon l-pointer"></div>
                 <div class="l-ts-offer-list"></div>
            </div>`);

        this._Textbox  = Lure.Select('.l-ts-textbox', this._Content);
        this._DropIcon = Lure.Select('.l-ts-drop-icon', this._Content);

        if (isReadOnly){
            this._Content.classList.add('l-ts-read-only');
            this._Textbox.disabled = true;
        }

        if (this.Config.DataGetter !== null){
            this._DataGetTimeout = null;
            this._Load = new Lure.Load({
                Target: '.l-ts-offer-list',
            })
        }

        this._Controller = new Lure.Controller.Templator({
            Target: Lure.Select('.l-ts-offer-list', this._Content),
            Data: this.Config.Data,
            ListElement: `<div class="l-ts-offer-item" data-value="{{Value}}">{{View}}</div>`,
            EmptyMessage: this.Config.EmptyText !== null ? `<div class="l-ts-offer-empty">${this.Config.EmptyText}</div>` : '',
            PropFormat: {
                View: (t)=>{
                    t = t.toString();
                    let textAlt = Lure.String.KeyboardSwitch(this._State.Text);
                    let text = this._State.Text.replace(/[\s\S]/g, (x)=>'\\'+x);
                    textAlt = textAlt.replace(/[\s\S]/g, (x)=>'\\'+x);
                    return t.replace(new RegExp(`${text}|${textAlt}`, 'i'), (foundPart)=>{

                        return `<span class="l-ts-found">${foundPart}</span>`;
                    })
                }
            },
        });
        Target.appendChild(this._Content);


        //** Events
        /** @param {Event} e */
        const TextboxListener = (e) => {
            const text = e.currentTarget.value;
            this._State.Text = text;
            this._DoFilter(text);
            if (this.Config.isInput){
                this._UpdateOwner();
            }
        };

        this._Textbox.addEventListener('keyup', (e)=>{
            if ( ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) > -1)
                return;
            if (e.which === 13 || e.key === 'Enter'){
                e.currentTarget.value = e.currentTarget.value.trim();
                return this._CheckValue(true);
            }
            const text = e.currentTarget.value;
            this._State.Text = text;

            if (this.Config.DataGetter !== null){
                clearTimeout(this._DataGetTimeout);
                this._DataGetTimeout = setTimeout(()=>{
                    this._Load.Show();
                    api.call(this.Config.DataGetter(text), {
                        Then: (data)=>{
                            this.Data = data;
                            if (this.Config.isInput){
                                this._UpdateOwner();
                            }
                        },
                        Finally: ()=>{
                            this._Load.Hide();
                        }
                    })
                }, 300);
                return;
                // this.Data = await this.Config.DataGetter(text);
                // return;
            }
            this._DoFilter(text);
            if (this.Config.isInput){
                this._UpdateOwner();
            }
        });
        this._Textbox.addEventListener('focus', (e)=>{
            if (this._State.CurrentItem)
                this._Textbox.select();
            if (this.Config.isInput){
                this._Textbox.select();
                //return;
            }
            if (this.Config.isShowFullHintListOnFocus){
                return this._DoFilter('');
            }
            // if (this.Config.DataGetter === null){
            //     return this._DoFilter(this._State.Text);
            // }
            const text = e.currentTarget.value;
            this._State.Text = text;
            this._DoFilter(text);
        });
        this._Textbox.addEventListener('blur', ()=>this._CheckValue(false));
        this._DropIcon.addEventListener('click', (e)=>{
            if (this._State.Disabled)
                return;
            Lure.DocumentSelectionClear();
            this._State.isListOpen = !this._State.isListOpen;
            if (this._State.isListOpen){
                this._DropIcon.classList.add('active');
                this._DoFilter('', true);
            }else{
                this._DropIcon.classList.remove('active');
                this._DoFilter(this._State.Text);
            }
        });


        Lure.AddEventListenerGlobal('click', '.l-ts-offer-item', (e, d)=>{
            if (this._State.Disabled)
                return;
            const Item = this._Controller.GetDataItemByLineID(d.LineID).Data;
            this._OnChoose(Item)
        }, this._Content, this);

        document.addEventListener('click', (e)=>{
            if (e.target !== this._DropIcon){
                this._DropIcon.classList.remove('active');
                this._State.isListOpen = false;
            }
        })
    }
}

Lure.SmartTextbox = LureSmartTextbox;





class LureSelectBox {
    static get Version(){
        return '0.1.0';
    }
    /**
     * @param {Array} Data
     * @return LureSmartTextbox_DataPrepared[]
     */
    _PrepareData(Data){
        let Prepared = [];
        for (let d of Data){
            Prepared.push({
                Original: d,
                Value: this.Config.DelegateValue(d),
                View:  this.Config.DelegateView(d),
            })
        }
        return Prepared;
    }
    /**
     * @param {LureSmartTextbox_DataPrepared} Item
     * @param {boolean} [isCallback]
     * */
    _OnChoose(Item, isCallback=true) {
        if (this._State.CurrentItem === Item)
            return;
        this._State.CurrentItem = Item;
        this._UpdateSelectScreen();

        if (!isCallback)
            return;
        this._UpdateOwner();
    }

    _UpdateSelectScreen(){
        if (this._State.CurrentItem === null){
            this._SelectScreenText.innerHTML = this.Config.EmptyView;
            return;
        }
        this._SelectScreenText.innerHTML = this._State.CurrentItem.View;
        this._Controller.Refresh();
    }
    _UpdateOwner(){
        let PropertyValue = this.Config.EmptyValue;
        let PropertyView = this.Config.EmptyView;

        if (this._State.CurrentItem !== null){
            PropertyValue = this._State.CurrentItem.Value;
            PropertyView = this._State.CurrentItem.View;
        }

        if (this.Config.PropertyBind && this.Config.Owner){
            this.Config.Owner.Proto.SetProperty(this.Config.PropertyBind, PropertyValue);
        }
        this.Config.OnSelect(PropertyValue, PropertyView, this._State.CurrentItem ? this._State.CurrentItem.Original: null);
    }

    get Data(){
        return this.Config.Data.Select(x=>x.Original);
    }
    set Data(newData){
        this.Config.Data = this._PrepareData(newData);
        return this._Controller.Refresh(this.Config.Data);
    }
    Refresh(){
        return this._Controller.Refresh(this._PrepareData(this.Config.Data));
    }

    get Value(){
        if (!this._State.CurrentItem)
            return this.Config.NotFoundValue;
        return this.Config.DelegateValue(this._State.CurrentItem.Original);
    }


    set Value(val){
        const DataItem = this._Controller.GetDataItemByDelegate(x=>x.Value === val);
        if (DataItem !== null){
            this._State.CurrentItem = DataItem.Data;
        }else{
            this._State.CurrentItem = null;
        }
        this._UpdateSelectScreen();
        return val; //return console.log('[Lure.SmartTextbox] New values is not found', val);
    }

    get ValueOriginal(){
        if (!this._State.CurrentItem){
            return null;
        }
        return this._State.CurrentItem.Original;
    }
    // set ValueOriginal(Item){
    //     this._State.CurrentItem = {
    //         Original: Item,
    //         Value: this.Config.DelegateValue(Item),
    //         View:  this.Config.DelegateView(Item),
    //     };
    //     this._UpdateSelectScreen();
    //     return Item;
    // }
    set ValueOriginal(Item){
        this._State.CurrentItem = {
            Original: Item,
            Value: this.Config.DelegateValue(Item),
            View:  this.Config.DelegateView(Item),
        };
        this.Config.OnSetValue(this._State.CurrentItem.Value, Item);
        this._UpdateSelectScreen();
        return Item;
    }

    get Disabled(){
        return this._State.Disabled;
    }
    set Disabled(isDisabled){
        this._State.Disabled = isDisabled;
        //this._Textbox.disabled = isDisabled;
        if (isDisabled)
        {
            this._SelectScreen.classList.remove('l-pointer');
            this._SelectScreen.classList.add('l-sb-disabled');
        }
        else
        {
            this._SelectScreen.classList.add('l-pointer');
            this._SelectScreen.classList.remove('l-sb-disabled');
        }

    }


    /**
     * @param {HTMLElement} Target
     * @param {*[]} Data (offer list)
     * @param {string} [Type] (textbox type, default: text)
     * @param {function} [DelegateValue] (select property what will be set. originalItem value as default)
     * @param {function} [DelegateView] (select property what will be shown in textbox. originalItem value as default)
     * @param {string} [PropertyBind] (what property of Owner.State will be set. nothing if not defined)
     * @param {LureSmartTextbox_DelegateOnSelect} [OnSelect] (callback function)
     * @param {LureSmartTextbox_DelegateOnSelect} [OnSetValue] (callback function when set .Value)
     * @param {LureContent} [Owner] (Lure.Content)
     * @param {?string} [EmptyView] (will be set to view)
     * @param {?string} [EmptyText] (will be shown when hint-list is empty. Set null if you want hide EmptyText by the way)
     * @param {*} [EmptyValue]
     */
    constructor({
                    Target = null,
                    Data = [],

                    DelegateValue  = (x)=>x,
                    DelegateView   = (x)=>x,
                    OnSelect = (val, originalItem)=>{},
                    OnSetValue = (val, originalItem)=>{},

                    EmptyValue = null,
                    EmptyView = Lure.Culture.Lang.SelectEmpty,
                    EmptyText = Lure.Culture.Lang.ListEmpty,

                    PropertyBind = void 0,
                    Owner = null,
                }={}){
        if (Target === null || Target === void 0){
            return console.warn('[Lure.SelectBox] Target is null or undefined');
        }

        this.Config = {
            Data: Data,
            DelegateValue: DelegateValue,
            DelegateView: DelegateView,
            PropertyBind: PropertyBind,
            OnSelect: OnSelect,
            OnSetValue: OnSetValue,

            EmptyValue: EmptyValue,
            EmptyView: EmptyView,
            EmptyText: EmptyText,
            Owner: Owner,
        };

        this.Config.Data = this._PrepareData(Data);
        this._State = {
            Disabled: false,
            Text: '',
            /** @type ?LureSmartTextbox_DataPrepared */
            CurrentItem: null,

            isListOpen: false,
        };
        this._Content = Lure.CreateElementFromString(
            `<div class="l-select-box">
                 <div class="l-sb-screen l-pointer"><span class="l-pp-screen-text"></span></div>
                 <div class="l-sb-offer-list"></div>
            </div>`);

        this._SelectScreen      = Lure.Select('.l-sb-screen', this._Content);
        this._SelectScreenText  = Lure.Select('.l-pp-screen-text', this._Content);


        this._Controller = new Lure.Controller.Templator({
            Target: Lure.Select('.l-sb-offer-list', this._Content),
            Data: this.Config.Data,
            ListElement: `<div class="l-sb-offer-item {{#if (this._State.CurrentItem !== null && o.Value == this._State.CurrentItem.Value) ? 'l-sb-chosen':''}}" data-value="{{Value}}">{{View}}</div>`,
            EmptyMessage: this.Config.EmptyText !== null ? `<div class="l-sb-offer-empty">${this.Config.EmptyText}</div>` : '',
            // {{#if (this._State.CurrentItem !== null && o.Value == this._State.CurrentItem.Value) ? 'l-pp-chosen':''}}
            Owner: this
        });
        Target.appendChild(this._Content);


        //** Events
        this._SelectScreen.addEventListener('click', (e)=>{
            if (this._State.Disabled)
                return;
            Lure.DocumentSelectionClear();
            this._State.isListOpen = !this._State.isListOpen;
            if (this._State.isListOpen){
                this._SelectScreen.classList.add('active');
            }else{
                this._SelectScreen.classList.remove('active');
            }
        });


        Lure.AddEventListenerGlobal('click', '.l-sb-offer-item', (e, d)=>{
            const Item = this._Controller.GetDataItemByLineID(d.LineID).Data;
            this._OnChoose(Item)
        }, this._Content, this);

        document.addEventListener('click', (e)=>{
            if (e.target !== this._SelectScreen && e.target !== this._SelectScreenText){
                this._SelectScreen.classList.remove('active');
                this._State.isListOpen = false;
            }
        })
    }
}

Lure.SelectBox = LureSelectBox;
/** @callback LurePeriodPicker_OnConfirm
 *  @param {Date} DateStart
 *  @param {Date} DateFinish
 */
/** @callback LurePeriodPicker_OnDateShift
 *  @param {LureDate} DateTarget
 *  @param {int} Delta
 */
/** @callback LurePeriodPicker_TargetRender
 *  @param {LureDate} DateStart
 *  @param {LureDate} DateFinish
 *  @param {LurePeriodPicker} PP
 */

/** @typedef {object} LurePeriodPicker_MonthWeek
 *  @property {string} WeekSelectorVisible ( 'none' or '')
 *  @property {string} DateValue ( format: DD.MM.YYYY )
 *  @property {string} WeekType ( 'l-pp-deny' or '') - when all week is deny
 *  @property {LurePeriodPicker_MonthDay[]} Days
 */

/** @typedef {object} LurePeriodPicker_MonthDay
 *  @property {string} DateValue ( format: DD.MM.YYYY )
 *  @property {string} DayValue ( format: DD )
 *  @property {string} DayType ( 'l-pp-dayoff', 'l-pp-deny', 'l-pp-selected', 'l-pp-selected-active' )
 *  @property {string} DayOff ( 'l-pp-dayoff', '')
 */

/** @typedef {object} LurePeriodPicker_MonthBlock
 *  @property {string} MonthName
 *  @property {string} DateValue ( format: DD.MM.YYYY )
 *  @property {string} MonthType ( 'l-pp-deny' or '') - when all month is deny
 *  @property {LurePeriodPicker_MonthWeek[]} MonthWeeks
 */

/** @typedef {object} LurePeriodPicker_MonthRow
 *  @property {LurePeriodPicker_MonthBlock[]} MonthBlocks
 */

/** @typedef {object} LurePeriodPicker_DateNavigation
 *  @property {boolean} isMonthSelect (show/hide month <select>)
 *  @property {int[]} YearRange  (+- 10 years by default)
 * */

class LurePeriodPicker {
    /** @return {string} */
    static get Version(){
        return 'v0.2.1'
    }
    Reset(){
        this.Date = [null, null];
    }
    Refresh(){
        this._ctx.Refresh();
    }
    /** @return {Date | Date[]} */
    get Date(){
        if (this.Settings.isOneDaySelection)
            return this._ctx.State.Dates.DateStart !== null ?this._ctx.State.Dates.DateStart.Date: null;
        return [this._ctx.State.Dates.DateStart !== null ? this._ctx.State.Dates.DateStart.Date:null,
                this._ctx.State.Dates.DateFinish!== null ? this._ctx.State.Dates.DateFinish.Date:null];
    }
    /** @param {Date|Date[]|LureDate|LureDate[]}  val */
    set Date(val){
        if (!val || val.length < 2){
            return this.Reset();
        }
        if (this.Settings.isOneDaySelection){
            val = Array.isArray(val) ? val[0] : val;
            this._ctx.State.CurrentSelection = {
                DateStart:  val ? Lure.Date(val) : null,
                DateFinish: val ? Lure.Date(val) : null,
            };
        }else{
            this._ctx.State.CurrentSelection = {
                DateStart:  val[0] !== null ? Lure.Date(val[0]) : null,
                DateFinish: val[0] !== null ? Lure.Date(val[1]) : null,
            };
        }
        this._ctx.CheckSelection();
        if (this._ctx.State.CurrentSelection.DateStart !== null)
            this.DateTarget = this._ctx.State.CurrentSelection.DateStart.Clone();
        this.Refresh();
        this._ctx.State.Dates = {
            DateStart:  this._ctx.State.CurrentSelection.DateStart  ? this._ctx.State.CurrentSelection.DateStart.Clone()  : null,
            DateFinish: this._ctx.State.CurrentSelection.DateFinish ? this._ctx.State.CurrentSelection.DateFinish.Clone() : null,
        };
        this._ctx.UpdateTargetControl();
    }
    Hide(){
        this._ctx.Hide();
    }
    Show(){
        this._ctx.Show();
    }
    Toggle(){
        this._ctx.Toggle()
    }
    get Max(){
        return this._Max;
    }
    set Max(Max){
        this._Max = Max ? Lure.Date(Max) : null;
        this._ctx.CheckSelectionConfirm();
    }
    get Min(){
        return this._Max;
    }
    set Min(Min){
        this._Min = Min ? Lure.Date(Min) : null;
        this._ctx.CheckSelectionConfirm();
    }
    /**
     * @param {HTMLElement|string} Target (Target where to render picker control (ex. '.date-picker')  )
     * @param {Date} [DateTarget] ()
     * @param {?Date[] | ?LureDate[]} [DateRange]   (preselected dates)
     * @param {boolean} [TargetImmutable] (if true target control won't be changed. default: false)
     * @param {boolean} [NoSelect]  (if true selected data will be empty on start. default: false)
     * @param {boolean} [NoRange]  (Set 'true' for one day only selection. default: false)
     * @param {boolean} [NoWeekDays] (if true weekdays names will be hidden. default: false)
     * @param {boolean} [WeekSelection] (show/hide week selection control. default: true)
     * @param {LurePeriodPicker_DateNavigation} [DateNavigation] (show/hide week selection control. default: true)
     * @param {int[]} [Cells] (month matrix, [rows, columns]. default: [1, 3])
     * @param {boolean} [isBuildIn] (if true, PeriodPicker will be rendered in Target)
     * @param {Date} [Min] (left date limit, min pickable value)
     * @param {Date} [Max] (right date limit, max pickable value)
     * @param {Date[]} [ForbiddenDates] ( unselectable dates)
     * @param {string} [Format] (default: Lure.Culture.Format)
     * @param {?objectContentAnimation} [Animation]
     * @param {string} [BeforeShow]
     * @param {LurePeriodPicker_OnConfirm} [OnConfirm]
     * @param {LurePeriodPicker_OnDateShift} [OnDateShift]
     * @param {boolean} [DirectConfirm] (if true, selecting dates will call OnConfirm. default: false)
     * @param {boolean} [ButtonConfirm] (show/hide ButtonConfirm. default: true)
     * @param {boolean} [AutoConfirm]  (like DirectConfirm, but closes DatePicker on select)
     * @param {string} [Locale]
     * @param {boolean} [Fullscreen] (is fullscreen mode on startup)
     * @param {boolean} [ButtonFullscreen] (show/hide button fullscreen)
     *
     * @param {boolean} [isMonthPicker] (do not render day select, month and tear only)
     * @param {boolean} [isNavigationArrows]
     * \
     * @param {boolean} [isTimePicker]
     * @param {int} [TimePickerResolution] (0-'hour', 1-'minute', 2-'second', 3-'millisecond'. default: 1-'minute')
     * @param {int} [TimePickerMinuteStep] (default: 1)
     * @param {int[]} [WeekEndIndexes] (1-mon, 2-tue, ... 6-sunday, 7-saturday. default: [6, 7])
     * @param {Date[]} [DayOffs] (list of day-offs)
     * @param {LurePeriodPicker_TargetRender} [TargetRender] (custom target control render)
     */
    constructor({
        Target              = null,
        DateTarget          = new Date(),
        DateRange           = [],
        TargetImmutable     = false,
        NoSelect            = false,
        NoRange             = false,
        NoWeekDays          = false,
        WeekSelection       = true,

        DateNavigation      = null,

        Cells               = [1, 3],
        isBuildIn           = false,

        Min = null,
        Max = null,
        ForbiddenDates = [],

        Format              = void 0,
        Animation           = null,
        BeforeShow          = () => {},
        OnConfirm           = () => {},
        OnDateShift         = () => {},
        DirectConfirm       = false,
        ButtonConfirm       = true,

        AutoConfirm         = false,

        Locale = Lure.Settings.Locale,

        Fullscreen = false,
        ButtonFullscreen = true,

        isMonthPicker = false,
        isNavigationArrows = true,

        isTimePicker = false,
        TimePickerResolution = LurePeriodPicker.TimePickerResolution.Minute,
        TimePickerMinuteStep = 1,
        WeekEndIndexes = [6, 7], //from 1 to 7
        DayOffs = [],
        TargetRender = (DateStart, DateFinish, PP)=>{
            if (DateStart === null){
                return PP.Settings.Lang.ChoosePeriod;
            }
            if (PP.Settings.isOneDaySelection){
                return DateStart.Format(PP.Settings.isTimePicker ? PP.Settings.Format + ' HH:mm' : PP.Settings.Format);

            } else{
                return `${DateStart.Format(PP.Settings.isTimePicker ? PP.Settings.Format + ' HH:mm' : PP.Settings.Format)} — ${DateFinish.Format(PP.Settings.isTimePicker ? PP.Settings.Format + ' HH:mm' : PP.Settings.Format)}`
            }
        },
                })
    {
        const PP = this;
        this.isActive = false;

        const Minutes = ((step)=>{let s=[];for(let i=0;i<60;i=i+step) s.push(i>9?i.toString():'0'+i);return s;})(TimePickerMinuteStep);

        /* Init Settings */
        /**
         * @typedef {object} LurePeriodPicker_Settings
         * @property {objectContentAnimation} Animation
         * @property {boolean} ButtonFullscreen
         * @property {string} Format

         * @property {boolean} isOneDaySelection
         * @property {boolean} isAutoConfirm
         * @property {boolean} isDirectConfirm
         * @property {boolean} isWeekSelection
         * @property {boolean} isTargetImmutable
         * @property {boolean} isTimePicker
         * @property {int} TimePickerResolution
         * @property {int} TimePickerMinuteStep
         * @property {object} Lang
         * @property {int[]} Cells
         * @property {int[]} WeekEndIndexes
         * @property {Date[]} DayOffs
         * @property {LurePeriodPicker_TargetRender} TargetRender
         * @property {?LurePeriodPicker_DateNavigation} DateNavigation
         */

        /** @type {LurePeriodPicker_Settings} */
        this.Settings = Lure.Object.Clone(Lure.Settings.PeriodPicker.DefaultSettings);
        this.Settings.ButtonFullscreen  = ButtonFullscreen;
        this.Settings.Format            = Format ? Format : Lure.Culture.DateFormat;

        this.Settings.isOneDaySelection = NoRange;
        this.Settings.isAutoConfirm     = AutoConfirm;
        this.Settings.isDirectConfirm   = DirectConfirm;
        this.Settings.isWeekSelection   = WeekSelection && !this.Settings.isOneDaySelection;
        this.Settings.isTargetImmutable = TargetImmutable;
        this.Settings.Lang              = Lure.Settings.PeriodPicker.CultureInfo[Locale];
        this.Settings.Cells             = Lure.Object.Clone(Cells);
        this.Settings.WeekEndIndexes    = WeekEndIndexes;
        this.Settings.DayOffs           = DayOffs;
        this.Settings.isTimePicker      = isTimePicker;
        this.Settings.TimePickerResolution = TimePickerResolution;
        this.Settings.TimePickerMinuteStep = TimePickerMinuteStep;
        this.Settings.TargetRender      = TargetRender;

        this.Settings.DateNavigation    = DateNavigation;

        if (this.Settings.DateNavigation !== null && this.Settings.DateNavigation.isMonthSelect === void 0)
            this.Settings.DateNavigation.isMonthSelect = true;
        if (this.Settings.DateNavigation !== null && this.Settings.DateNavigation.YearRange === void 0)
            this.Settings.DateNavigation.YearRange = [Lure.Date().Year - 5, Lure.Date().Year + 5];

        if (this.Settings.DateNavigation){
            let YearRangeReal = [];
            for (let y = this.Settings.DateNavigation.YearRange[0]; y <= this.Settings.DateNavigation.YearRange[1]; y++){
                YearRangeReal.push(y);
            }
            this.Settings.DateNavigation.YearRange = YearRangeReal;
        }


        /** @type LureDate */
        this._Min = Min ? Lure.Date(Min) : null;
        /** @type LureDate */
        this._Max = Max ? Lure.Date(Max) : null;


        /* Init */
        this._TargetControl = Lure.Select(Target);
        /** @type {?LureDate} */
        this.DateTarget =  DateTarget? Lure.Date(DateTarget): Lure.Date();


        /* Init DOM */
        this.Target = Lure.Select(Target);
        if (!isBuildIn)
            this.Target.classList.add('l-pp-target');
        
        //######
        const GetStaticWeekDaysRow = () => {
            if (NoWeekDays){
                return '';
            }
            let week = '';
            for (let i = 0; i < Lure.Culture.WeekDaysShort.length; i++){
                let DayOff = this.Settings.WeekEndIndexes.indexOf(i+1) > -1 ? 'l-pp-dayoff':'';
                let w = Lure.Culture.WeekDaysShort[i];
                week += `<div class="l-pp-weekdays-cell l-pp-cell ${DayOff}">${w}</div>`
            }
            return week;
        };

        //render type setup
        const CtxTarget = isBuildIn ? this.Target : 'body';
        const CtxDialog = isBuildIn ? null : {
            Wrapper: false,
            Animation: {
                Show: this.Settings.Animation.Show,
                Hide: this.Settings.Animation.Hide,
            },
            isHideOnOutsideClick: true,
        };
        const CtxHead = isBuildIn ? '' : `<div class="l-pp-head">
                                            <div class="l-pp-caption">{{Settings.Lang.ChoosePeriod}}</div>
                                            <div class="l-pp-controls">
                                                <div class="l-pp-control l-pp-control-fullscreen {{#if (o.Settings.ButtonFullscreen) ? '':'none'}}"></div>
                                                <div class="l-pp-control l-pp-control-close"></div>
                                            </div>
                                          </div>`;
        const CtxDateNav = DateNavigation === null ? '': `<div class="l-pp-date-navigator l-row l-flex-center l-flexa-center">
                                                             <div class="l-pp-nav-month"></div>
                                                             <div class="l-pp-nav-year"></div>
                                                          </div>`;
        const CtxBottom = isMonthPicker ? '': `<div class="l-pp-bottom">
                                <div class="l-pp-result">
                                    <div class="l-pp-date-values l-pp-date-date">
                                        <div class="l-pp-textbox-holder"> 
                                            <input class="l-textbox tb-date-start" value="{{DateStart}}" placeholder="{{Settings.Format}}">
                                        </div>
                                        <div class="l-pp-date-additional {{#if (o.Settings.isOneDaySelection) ? 'none':''}}">
                                            <div class="l-pp-textbox-gap">
                                                <div> — </div>
                                            </div>
                                            <div class="l-pp-textbox-holder">
                                                <input class="l-textbox tb-date-end" value="{{DateFinish}}"  placeholder="{{Settings.Format}}">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="l-pp-date-values l-pp-date-time {{#if (o.Settings.isTimePicker && o.CurrentSelection.DateStart !== null && o.CurrentSelection.DateFinish !== null) ? '':'none'}}">
                                        <div class="l-pp-time-face l-pp-time-face-start">
                                            <div class="l-pp-time-part l-pp-tp-start-hour"></div>
                                            <div class="l-pp-time-part l-pp-tp-start-minute"></div>
                                            <div class="l-pp-time-part l-pp-tp-start-second"></div>
                                        </div>
                                        <div class="l-pp-date-additional {{#if (o.Settings.isOneDaySelection) ? 'none':''}}">
                                            <div class="l-pp-textbox-gap">
                                                <div> — </div>
                                            </div>
                                            <div class="l-pp-time-face l-pp-time-face-end">
                                                <div class="l-pp-time-part l-pp-tp-end-hour"></div>
                                                <div class="l-pp-time-part l-pp-tp-end-minute"></div>
                                                <div class="l-pp-time-part l-pp-tp-end-second"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="button-holder row flex-end">
                                    <button class="l-button btn-l-pp-ok">{{Settings.Lang.Ok}}</button>
                                </div>
                            </div>`;

        /**
         * @class LurePeriodPickerContext
         * @mixes LureContent
         */
        const ctx = new Lure.Content({
            Target: CtxTarget,
            Dialog: CtxDialog,
            State: {
                Dates: [null, null],
                CurrentSelection: {
                    /** @type ?LureDate */
                    DateStart: null,
                    /** @type ?LureDate */
                    DateFinish: null,
                },

                Lang: {},
                Settings: this.Settings,
            },
            Content: `<div class="l-period_picker ${Fullscreen? 'l-pp-fullscreen':''} ${isBuildIn ? 'l-pp-build-in':''}" style="display: none">
                        ${CtxHead}
                        ${!isMonthPicker ? CtxDateNav: ''}
                        <div class="l-pp-inner">
                            <div class="l-pp-work-area">
                                <div class="l-pp-work-date">
                                    <div class="l-pp-arrow l-pp-arrow-left pointer ${isNavigationArrows? '':'none'}"></div>
                                    <div class="l-pp-content">${isMonthPicker ? CtxDateNav: ''}</div>
                                    <div class="l-pp-arrow l-pp-arrow-right pointer ${isNavigationArrows? '':'none'}"></div>
                                </div>
                                
                            </div>
                            ${CtxBottom}
                        </div>
                      </div>`,
            ControllerConfig: {
                Target: '.l-pp-content',
                ListElement: `<div class="l-pp-month-row">
                                    {{#each MonthBlocks}}
                                    <div class="l-pp-month-block">
                                        <div class="l-pp-weekdays-row">${GetStaticWeekDaysRow()}</div>
                                        <div class="l-pp-month-name l-pp-month-select {{MonthType}}" data-value="{{DateValue}}">{{MonthName}}</div>
                                        <div class="l-pp-month-grid">
                                            {{#each MonthWeeks}}
                                            <div class="l-pp-month-week l-row">
                                                <div class="l-pp-week-select {{WeekType}} {{WeekSelectorVisible}}" data-value="{{DateValue}}">|</div>
                                                {{#each Days}}
                                                <div class="l-pp-month-cell l-pp-cell {{DayOff}} {{DayType}}" data-value="{{DateValue}}">{{DayValue}}</div>
                                                {{#endeach}}
                                            </div>
                                            {{#endeach}}
                                        </div>
                                    </div>
                                    {{#endeach}}
                              </div>`
            },
            PropFormat: {
                DateStart:  (d, o)=>o.CurrentSelection.DateStart  !== null ? o.CurrentSelection.DateStart.Format(PP.Settings.Format) : '',
                DateFinish: (d, o)=>o.CurrentSelection.DateFinish !== null ? o.CurrentSelection.DateFinish.Format(PP.Settings.Format) : '',
            },
            Props: function () {

                this._Draggable = isBuildIn ? null: Lure.Draggable(this.Select('.l-pp-head'), this.Content);

                this.InputDateStart =  this.Select('.tb-date-start');
                this.InputDateFinish =  this.Select('.tb-date-end');


                this.TargetControl = isBuildIn ? null : PP._TargetControl;

                this.ButtonConfirm = this.Select('.btn-l-pp-ok');
                this.ButtonFullscreen = this.Select('.l-pp-control-fullscreen');

                this._TargetDateMonthInput = null;
                this._TargetDateYearInput = null;
                if (PP.Settings.DateNavigation){
                    this._TargetDateYearInput = new Lure.SelectBox({
                        Target: this.Select('.l-pp-nav-year'),
                        Data: PP.Settings.DateNavigation.YearRange,
                        OnSelect: (val)=>{
                            PP.DateTarget.SetYear(val);
                            OnDateShift(PP.DateTarget, 0);
                            this.Refresh();
                            if (isMonthPicker){
                                this.State.CurrentSelection.DateStart = PP.DateTarget.Clone().SetMonthStart();
                                this.State.CurrentSelection.DateFinish = PP.DateTarget.Clone().SetMonthEnd();
                                this.Confirm(false);
                            }
                        }
                    });
                    if (PP.Settings.DateNavigation.isMonthSelect){
                        this._TargetDateMonthInput = new Lure.SelectBox({
                            Target: this.Select('.l-pp-nav-month'),
                            Data: Lure.Culture.MonthNames.Select((m, i)=>{return {Number: i, Name: m}}),
                            //isShowFullHintListOnFocus: true,
                            //isReadOnly: true,
                            //NotFoundValue: '',
                            //EmptyText: null,
                            DelegateValue: (x)=>x.Number,
                            DelegateView: (x)=>x.Name,
                            OnSelect: (val)=>{
                                PP.DateTarget.SetMonth(val);
                                OnDateShift(PP.DateTarget, 0);
                                this.Refresh();
                                if (isMonthPicker){
                                    this.State.CurrentSelection.DateStart = PP.DateTarget.Clone().SetMonthStart();
                                    this.State.CurrentSelection.DateFinish = PP.DateTarget.Clone().SetMonthEnd();
                                    this.Confirm(false);
                                }
                            }
                        });
                    }
                }




                if (PP.Settings.isTimePicker){
                    this._TimeStartHour = new Lure.SmartTextbox({
                        Target: this.Select('.l-pp-tp-start-hour'),
                        Data: LurePeriodPicker.HourList,
                        isShowFullHintListOnFocus: true,
                        NotFoundValue: '00',
                        EmptyText: null,
                        OnSelect: (val)=>{
                            this.State.CurrentSelection.DateStart.SetHours(val);
                            this.CheckSelectionConfirm();
                        }
                    });
                    this._TimeEndHour = new Lure.SmartTextbox({
                        Target: this.Select('.l-pp-tp-end-hour'),
                        Data: LurePeriodPicker.HourList,
                        isShowFullHintListOnFocus: true,
                        NotFoundValue: '00',
                        EmptyText: null,
                        OnSelect: (val)=>{
                            this.State.CurrentSelection.DateFinish.SetHours(val);
                            this.CheckSelectionConfirm();
                        }
                    });
                    if (PP.Settings.TimePickerResolution >= LurePeriodPicker.TimePickerResolution.Minute){
                        this._TimeStartMinute = new Lure.SmartTextbox({
                            Target: this.Select('.l-pp-tp-start-minute'),
                            Data: Minutes,
                            NotFoundValue: '00',
                            isShowFullHintListOnFocus: true,
                            EmptyText: null,
                            OnSelect: (val)=>{
                                this.State.CurrentSelection.DateStart.SetMinutes(val);
                                this.CheckSelectionConfirm();
                            }
                        });
                        this._TimeEndMinute = new Lure.SmartTextbox({
                            Target: this.Select('.l-pp-tp-end-minute'),
                            Data: Minutes,
                            NotFoundValue: '00',
                            isShowFullHintListOnFocus: true,
                            EmptyText: null,
                            OnSelect: (val)=>{
                                this.State.CurrentSelection.DateFinish.SetMinutes(val);
                                this.CheckSelectionConfirm();
                            }
                        });
                    }
                    if (PP.Settings.TimePickerResolution >= LurePeriodPicker.TimePickerResolution.Second){
                        this._TimeStartSecond = new Lure.SmartTextbox({
                            Target: this.Select('.l-pp-tp-start-second'),
                            Data: LurePeriodPicker.MinuteList,
                            NotFoundValue: '00',
                            OnSelect: (val)=>{
                                this.State.CurrentSelection.DateStart.SetSeconds(val);
                                this.CheckSelectionConfirm();
                            }
                        });
                        this._TimeEndSecond = new Lure.SmartTextbox({
                            Target: this.Select('.l-pp-tp-end-second'),
                            Data: LurePeriodPicker.MinuteList,
                            NotFoundValue: '00',
                            OnSelect: (val)=>{
                                this.State.CurrentSelection.DateFinish.SetSeconds(val);
                                this.CheckSelectionConfirm();
                            }
                        });
                    }
                }
            },
            Methods: function(){
                /** @param {LureDate} Date */
                this.GenerateMonth = function (Date) {
                    /** @type LurePeriodPicker_MonthBlock */
                    let MonthBlock = {
                        MonthName: Date.Format('MMMM YYYY'),
                        DateValue: Date.Format('DD.MM.YYYY'),
                        MonthWeeks: [],
                        MonthType: '',
                    };
                    let Cursor = Lure.Date('01.'+Date.Format('MM.YYYY'));
                    /** @type LurePeriodPicker_MonthWeek */
                    let CurrentWeek = {
                        WeekSelectorVisible: PP.Settings.isWeekSelection ?  '':'none',
                        DateValue: Cursor.Format('DD.MM.YYYY'),
                        Days: [],
                        WeekType: '',
                    };
                    while (Cursor.Month === Date.Month){
                        const WeekDay = Cursor.DayOfWeek;
                        let isDeny = false;
                        let DayType = '';
                        //check for deny
                        if ( (PP._Min && Cursor.Date < PP._Min.DayStart ) || (PP._Max && Cursor.Date > PP._Max.DayEnd ) ){
                            DayType = 'l-pp-deny';
                            isDeny = true;
                        }
                        //check for select
                        if (!isDeny
                            && this.State.CurrentSelection.DateStart && this.State.CurrentSelection.DateFinish
                            && Cursor.Date >= this.State.CurrentSelection.DateStart.DayStart  && Cursor.Date <= this.State.CurrentSelection.DateFinish.DayEnd
                            /*&& (PP.Settings.isDirectConfirm || PP.Settings.isOneDaySelection )*/){
                            DayType =  'l-pp-selected';
                        }
                        if (!isDeny
                            && !PP.Settings.isOneDaySelection
                            && this.State.CurrentSelection.DateStart && this.State.CurrentSelection.DateFinish === null
                            && Cursor.Date >= this.State.CurrentSelection.DateStart.DayStart && Cursor.Date <= this.State.CurrentSelection.DateStart.DayEnd){
                            DayType =  'l-pp-selection-active';
                        }
                        /** @type LurePeriodPicker_MonthDay */
                        let Day = {
                            DateValue: Cursor.Date.Format('DD.MM.YYYY'),
                            DayValue: Cursor.Date.Format('DD'),
                            DayType: DayType,
                            DayOff: (PP.Settings.WeekEndIndexes.indexOf(WeekDay) > -1 || PP.Settings.DayOffs.indexOf(Cursor.Date) > -1)? 'l-pp-dayoff':''
                        };
                        CurrentWeek.Days.push(Day);
                        if (WeekDay === 7){
                            CurrentWeek.WeekType = CurrentWeek.Days.Where(x=>x.DayType === 'l-pp-deny').length === CurrentWeek.Days.length ? 'l-pp-deny': '';
                            MonthBlock.MonthWeeks.push(CurrentWeek);
                            CurrentWeek = {
                                WeekSelectorVisible: PP.Settings.isWeekSelection ?  '':'none',
                                DateValue: Cursor.Clone().AddDays(1).Format('DD.MM.YYYY'),
                                Days: [],
                                WeekType: '',
                            };
                        }
                        if (Cursor.Day === Cursor.CountDays && CurrentWeek.Days.length > 0){
                            CurrentWeek.WeekType = CurrentWeek.Days.Where(x=>x.DayType === 'l-pp-deny').length === CurrentWeek.Days.length ? 'l-pp-deny': '';
                            MonthBlock.MonthWeeks.push(CurrentWeek);
                        }
                        Cursor.AddDays(1);
                    }
                    MonthBlock.MonthType = MonthBlock.MonthWeeks.Where(x=>x.WeekType !== '').length === MonthBlock.MonthWeeks.length ? 'l-pp-deny': '';
                    return MonthBlock;
                };
                this.GenerateData = function () {
                    /** @type LurePeriodPicker_MonthRow[] */
                    let MonthRows = [];

                    let Cursor = PP.DateTarget.Clone();

                    if (this._TargetDateMonthInput)
                        this._TargetDateMonthInput.Value = Cursor.Month;
                    if (this._TargetDateYearInput)
                        this._TargetDateYearInput.Value = Cursor.Year;



                    if (isMonthPicker)
                        return MonthRows;

                    for (let row = 0; row < PP.Settings.Cells[0]; row++){
                        /** @type LurePeriodPicker_MonthBlock[] */
                        let MonthBlocks = [];
                        for (let col = 0; col < PP.Settings.Cells[1]; col++){
                            MonthBlocks.push( this.GenerateMonth(Cursor));
                            Cursor.AddMonths(1);
                        }
                        MonthRows.push({MonthBlocks: MonthBlocks});
                    }

                    return MonthRows;
                };
                this.CheckSelection = function () {
                    if (this.State.CurrentSelection.DateFinish === null)
                        return;
                    let Start = this.State.CurrentSelection.DateStart;
                    let End   = this.State.CurrentSelection.DateFinish;
                    if (Start.Date > End.Date){
                        let dt = Start;
                        Start = End;
                        End = dt;
                    }

                    if (PP._Min && End.Date < PP._Min.DayStart || PP._Max && Start.Date > PP._Max.DayEnd){
                        this.State.CurrentSelection.DateStart = null;
                        this.State.CurrentSelection.DateFinish = null;
                        return;
                    }
                    if (PP._Min && Start.Date < PP._Min.Date){
                        Start = PP._Min.Clone();
                    }
                    if (PP._Max && End > PP._Max.Date){
                        End = PP._Max.Clone();
                    }
                    if (!PP.Settings.isTimePicker){
                        Start.SetDayStart();
                        End.SetDayEnd();
                    }
                    if (PP.Settings.isTimePicker && PP._Min && Start.isSameDate(PP._Min) && Start.Date < PP._Min.Date){
                        Start.CopyTime(PP._Min);
                    }
                    if (PP.Settings.isTimePicker && PP._Max && End.isSameDate(PP._Max) && Start.Date > PP._Max.Date){
                        End.CopyTime(PP._Max);
                    }
                    if (PP.Settings.TimePickerMinuteStep > 1){
                        Start.SetMinutes(Lure.RoundBy(Start.Minutes, PP.Settings.TimePickerMinuteStep, 'floor'));
                        Start.SetSeconds(0);
                        Start.SetMilliseconds(0);
                        End.SetMinutes(Lure.RoundBy(End.Minutes, PP.Settings.TimePickerMinuteStep, 'floor'));
                        End.SetSeconds(0);
                        End.SetMilliseconds(0);
                    }
                    this.State.CurrentSelection.DateStart  = Start;
                    this.State.CurrentSelection.DateFinish = End;
                };

                /** @param {int} delta */
                this.ShiftViewRange = function (delta) {
                    PP.DateTarget.AddMonths(delta);
                    OnDateShift(PP.DateTarget, delta);
                    this.Refresh();
                };
                this.SetDateByInput = (e, OneOrTwo)=>{
                    const TextValue = e.currentTarget.value.trim();
                    if (!TextValue){
                        return;
                    }
                    let DateValue = Lure.Date(TextValue, PP.Settings.Format);
                    if (PP.Settings.isOneDaySelection){
                        this.State.CurrentSelection.DateStart  = DateValue;
                        this.State.CurrentSelection.DateFinish = DateValue;
                    }else{
                        let DateCurrent = OneOrTwo === 0 ? this.State.CurrentSelection.DateStart : this.State.CurrentSelection.DateFinish;
                        if (DateCurrent !== null){
                            DateCurrent.SetYear(DateValue.Year);
                            DateCurrent.SetMonth(DateValue.Month);
                            DateCurrent.SetDay(DateValue.Day);
                        } else if (DateCurrent === null && OneOrTwo === 0){
                            this.State.CurrentSelection.DateStart = DateValue;
                        } else if (DateCurrent === null && OneOrTwo === 1){
                            this.State.CurrentSelection.DateFinish = DateValue;
                        }
                    }

                    this.CheckSelectionConfirm();
                };
                this.UpdateTargetControl = function () {
                    if (isBuildIn)
                        return;
                    if (PP.Settings.isTargetImmutable)
                        return;
                    this.TargetControl.innerHTML = PP.Settings.TargetRender(this.State.Dates.DateStart, this.State.Dates.DateFinish, PP);
                };
                this.CheckSelectionConfirm = function () {
                    this.CheckSelection();
                    if (PP.Settings.isDirectConfirm){
                        this.State.Dates = this.State.CurrentSelection;
                        this.Confirm(false);
                    }
                    if (PP.Settings.isAutoConfirm && this.State.CurrentSelection.DateFinish !== null){
                        this.Confirm();
                    }
                    this.Refresh();
                };
                this.Confirm = function (isClose=true) {
                    if (this.State.CurrentSelection.DateStart === null || this.State.CurrentSelection.DateFinish === null){
                        return Lure.Pop.Warn(this.State.Settings.isOneDaySelection ? PP.Settings.Lang.NoSelectionOnce:PP.Settings.Lang.NoSelection);
                    }
                    this.State.Dates = {
                        DateStart:  this.State.CurrentSelection.DateStart  ? this.State.CurrentSelection.DateStart.Clone()  : null,
                        DateFinish: this.State.CurrentSelection.DateFinish ? this.State.CurrentSelection.DateFinish.Clone() : null,
                    };
                    OnConfirm(this.State.Dates.DateStart.Date, this.State.Dates.DateFinish.Date);
                    this.UpdateTargetControl();
                    if (isClose)
                        this.Hide();
                };
                this.RefreshTimeTextboxes = function () {
                    if (PP.Settings.isTimePicker){
                        if (this.State.CurrentSelection.DateStart !== null){
                            if (this._TimeStartHour)
                                this._TimeStartHour.Value = this.State.CurrentSelection.DateStart.Format('HH');
                            if (this._TimeStartMinute)
                                this._TimeStartMinute.Value = this.State.CurrentSelection.DateStart.Format('mm');
                            if (this._TimeStartSecond)
                                this._TimeStartSecond.Value = this.State.CurrentSelection.DateStart.Format('ss');
                        }
                        if (this.State.CurrentSelection.DateFinish !== null){
                            if (this._TimeEndHour)
                                this._TimeEndHour.Value = this.State.CurrentSelection.DateFinish.Format('HH');
                            if (this._TimeEndMinute)
                                this._TimeEndMinute.Value = this.State.CurrentSelection.DateFinish.Format('mm');
                            if (this._TimeEndSecond)
                                this._TimeEndSecond.Value = this.State.CurrentSelection.DateFinish.Format('ss');
                        }
                    }
                };

                this.SwitchFullscreen = function () {
                    if (isBuildIn)
                        return;
                    if (this.Content.classList.contains('l-pp-fullscreen')){
                        this.Content.classList.remove('l-pp-fullscreen');
                        PP.Settings.Cells = [Cells[0], Cells[1]];
                        this._Draggable.Position = this.State.DragPositions;
                        this._Draggable.Run();
                        return this.Refresh();
                    }
                    this.State.DragPositions = this._Draggable.Position;
                    this._Draggable.Position = [0, 0];
                    this._Draggable.Stop();
                    this.Content.classList.add('l-pp-fullscreen');
                    const MonthBlock = Lure.Select('.l-pp-month-block', this.Content);
                    let w = MonthBlock.offsetWidth;
                    let h = MonthBlock.offsetHeight;
                    let dw = document.body.offsetWidth;
                    let dh = document.body.offsetHeight;

                    PP.Settings.Cells = [Math.floor((dh-70)/h), Math.floor((dw-50)/w)];
                    this.Refresh();
                }
            },
            Refresh: function(){
                this.RefreshTimeTextboxes();
                const Data = this.GenerateData();
                if (!isMonthPicker)
                    this.Controller.Refresh(Data);
                this.Proto.Refresh();
            },
            BeforeShow: function(){
                this.State.CurrentSelection = {
                    DateStart:  this.State.Dates.DateStart  ? this.State.Dates.DateStart.Clone()  : null,
                    DateFinish: this.State.Dates.DateFinish ? this.State.Dates.DateFinish.Clone() : null,
                };
                this.Refresh();
            },
            AfterBuild: function () {
                if (!isBuildIn){
                    this.TargetControl.addEventListener('click', ()=>this.Toggle());
                    this.Select('.l-pp-control-close').addEventListener('click', ()=>this.Hide());
                    //fullscreen
                    this.ButtonFullscreen.addEventListener('click', ()=>this.SwitchFullscreen());
                    this.Select('.l-pp-head').addEventListener('dblclick', ()=>this.SwitchFullscreen());

                    //confirm
                    this.ButtonConfirm.addEventListener('click', ()=>this.Confirm());
                }


                //Selection
                this.AddEventListener('click', '.l-pp-month-cell:not(.l-pp-deny)', (e)=>{
                    const DateValue = Lure.Date(e.currentTarget.dataset['value'], 'DD.MM.YYYY');
                    if (PP.Settings.isOneDaySelection){
                        this.State.CurrentSelection.DateStart = DateValue.SetDayStart();
                        this.State.CurrentSelection.DateFinish = DateValue.SetDayEnd();
                        return this.CheckSelectionConfirm();
                    }
                    if (this.State.CurrentSelection.DateStart === null || this.State.CurrentSelection.DateFinish !== null){
                        this.State.CurrentSelection.DateStart = DateValue.SetDayStart();
                        this.State.CurrentSelection.DateFinish = null;
                    }
                    else if (this.State.CurrentSelection.DateStart !== null && this.State.CurrentSelection.DateFinish === null){
                        this.State.CurrentSelection.DateFinish = DateValue.SetDayEnd();
                    }
                    this.CheckSelectionConfirm();
                });
                this.AddEventListener('click', '.l-pp-week-select:not(.l-pp-deny)', (e)=>{
                    if (PP.Settings.isOneDaySelection)
                        return;
                    const DateValue =  Lure.Date(e.currentTarget.dataset['value'], 'DD.MM.YYYY');
                    this.State.CurrentSelection.DateStart =  DateValue.Clone().SetWeekStart();
                    this.State.CurrentSelection.DateFinish = DateValue.Clone().SetWeekEnd();
                    this.CheckSelectionConfirm();
                });
                this.AddEventListener('click', '.l-pp-month-name:not(.l-pp-deny)', (e)=>{
                    if (PP.Settings.isOneDaySelection)
                        return;
                    const DateValue =  Lure.Date(e.currentTarget.dataset['value'], 'DD.MM.YYYY');
                    this.State.CurrentSelection.DateStart =  DateValue.Clone().SetMonthStart();
                    this.State.CurrentSelection.DateFinish = DateValue.Clone().SetMonthEnd();
                    this.CheckSelectionConfirm();
                });

                //Navigation
                this.Select('.l-pp-arrow-left').addEventListener('click', ()=>this.ShiftViewRange(-1));
                this.Select('.l-pp-arrow-right').addEventListener('click', ()=>this.ShiftViewRange(1));
                if (!isMonthPicker){
                    this.Select('.l-pp-work-area').addEventListener('wheel', (e)=>{
                        e.preventDefault();
                        this.ShiftViewRange(e.deltaY > 0 ? 1: -1);
                    });
                }


                //Editing
                if (!isMonthPicker){
                    this.InputDateStart.addEventListener('blur', (e)=>this.SetDateByInput(e, 0));
                    this.InputDateFinish.addEventListener('blur', (e)=>this.SetDateByInput(e, 1));
                    this.InputDateStart.addEventListener('keyup', (e)=>{
                        if (e.keyCode === 13 || e.key === 'Enter'){
                            this.SetDateByInput(e, 0)
                        }
                    });
                    this.InputDateFinish.addEventListener('keyup', (e)=>{
                        if (e.keyCode === 13 || e.key === 'Enter'){
                            this.SetDateByInput(e, 1)
                        }
                    });
                }




                //render target control
                if (!NoSelect){
                    PP.Date = DateRange;
                }
                this.UpdateTargetControl();
                // if (this._TargetDateMonthInput)
                //     this._TargetDateMonthInput.Value = PP.DateTarget.Month;
                // if (this._TargetDateYearInput)
                //     this._TargetDateYearInput.Value = PP.DateTarget.Year;
            }
        });
        this._ctx = ctx;
    }
}

Lure.PeriodPicker = LurePeriodPicker;
LurePeriodPicker.TimePickerResolution = {
    Hour: 0,
    Minute: 1,
    Second: 2,
    Millisecond: 3,
};
LurePeriodPicker.HourList = (()=>{let hs=[];for(let i=0;i<24;i++) hs.push(i>9?i.toString():'0'+i);return hs;})();
LurePeriodPicker.MinuteList = (()=>{let s=[];for(let i=0;i<60;i++) s.push(i>9?i.toString():'0'+i);return s;})();

Lure.Settings.PeriodPicker ={
    DefaultSettings: {
        Animation: {
            Show: 'l-animation_periodpicker-show',
            Hide: 'l-animation_periodpicker-hide'
        },
    },
    CultureInfo: {
        en: {
            ChoosePeriod: 'Select period',
            ChooseDay: 'Select day',
            Ok: 'Ok',
            NoSelection: 'No dates selected',
            NoSelectionOnce: 'No date selected',
        },
        ru: {
            ChoosePeriod: 'Выберите период',
            ChooseDay: 'Выберите день',
            Ok: 'Ок',
            NoSelection: 'Не выбраны даты',
            NoSelectionOnce: 'Не выбрана дата',
        },
    }
};
//sets = {
//  SubContent: [
//      {sets},                             -same object to create subs
// ],
//  SubContent: function{
//      this.SubN = new Lure.Content({set});-same object to create subs
// },
//
// Controller:{                                   - if needs some Template master
//    Type: Templator,                                    - class link [optional] Templator by default (Templator|Treebuilder)
//    Target: {string|HTMLElement}                        -[optional] if Controller.Target is undefined, Controller.Target = sets.Target
//    Data: [array],                                      - data array [optional] Data === [] by default
//    ListElement: {string|HTMLElement},                  - repeated element
//    EmptyMessage: "<div class="emty">no items</div>",   - render if Data.length === 0;
//    AfterBuild: ()=>{}
//    BeforeBuild: ()=>{}

//  Control: {
//    Target: {string, jQuery, HTMLElement},
//    Global: {bool}                               - set global event listener. Set true if control renders after init or it renders dynamicly
//    OnClick: {function}                          - here this === current Lure.Content
//    OnChange: {function}                         - here this === current Lure.Content
// },}
//

//#Permission
//  let Roles = {Admin: 1, User: 2, OrderID: 3}       - sample roles
//  let UserRoles = [2]       - sample user's roles
//  let UserSubRoles: {3: [12,41,52,63,73]}   - sample user's subroles
//
// Permission: {
//   Attribute: ''             - onElement permission check attribute (<div class="name" data-permission="rule1">{{Name}}</div>) ['data-permission'by default]
//   Roles: [
//      Roles.Admin,           -- if UserRoles doesn't contain 'UserRoles.Admin' or -1 -> access denied
//      {'ID': Roles.OrderID}  -- will check Proto.Data.ID exits in UserSubRoles[UserRoles.OrderID] - if exists or has -1 permission granted
//   ]
//   Write: []                   - same behavior for editable only
//   Rules: {                    -rules for onElement permission
//       Rule1: {                -ex. <div class="name editable" data-permission="rule1">{{Name}}</div>
//          Roles: [2],          - our sample user can see it
//          Write: [1],          - but cant edit
//       }
//   }
// }

if (typeof Lure === 'undefined'){
    console.error('[Lure] Lure core is not defined');
}

/**
 * @typedef {object} LureContentConstructorObject
 * @property {string|HTMLElement} [Target]
 * @property {string} [Content]
 * @property {string} [CSS]
 * @property {string} [Name]
 * @property {function|boolean} [Route]
 * @property {boolean} [Global]
 * @property {string} [Type]
 * @property {boolean} [Visible]
 * @property {function} [SubContent]
 * @property {object} [Dialog]
 * @property {string} [Load]
 * @property {function} [BeforeHide]
 * @property {function} [BeforeShow]
 * @property {function} [Show]
 * @property {function} [Hide]
 * @property {objectContentAnimation} [Animation]
 * @property {function} [Shower]
 * @property {function} [Hider]
 * @property {function} [Refresh]
 * @property {object} [Sort]
 * @property {object} [Filter]
 * @property {function} [OnClick]
 * @property {object} [Proto]
 * @property {object} [State]
 * @property {function} [OnChange]
 * @property {object} [PropTypes]
 * @property {object} [PropFormat]
 * @property {ControllerConfigType} [Controller]
 * @property {ControllerConfigType} [ControllerConfig]
 * @property {objectContentControl| objectContentControl[]} [Control]
 * @property {objectContentPermission} [Permission]
 * @property {function} [Pre]
 * @property {function} [Props]
 * @property {function} [Methods]
 * @property {object} [GetSet]
 * @property {function} [BeforeBuild]
 * @property {function} [AfterBuild]
 * @property {boolean} [Disabled]
 * @property {LureContent} [Parent]
 */

/**
 * @typedef {object} objectContentAnimation
 * @property {string} [Show]
 * @property {string} [Hide]
 */

/**
 * @typedef {object} objectContentPermissionRule
 * @property {number[]|object[]} Roles
 * @property {number[]|object[]} [Write]
 */

/**
 * @typedef {object} objectContentPermission
 * @property {number[]|object[]} Roles
 * @property {number[]|object[]} [Write]
 * @property {Object.<string, objectContentPermissionRule>} [Rules]
 */

/**
 * @typedef {object} objectContentControl
 * @property {string|HTMLElement} Target
 * @property {boolean} [Global]  default: false
 * @property {function} [OnClick] default: this.Show()
 * @property {function} [OnChange] default: no
 */
/**
 * @typedef {object} objectContentDialog
 * @property {string} [Wrapper]
 * @property {string} [Blur] query select blurable element
 * @property {boolean} [WrapperHandle] default: true
 * @property {boolean} [isHideOnOutsideClick] default: false
 * @property {?function} [OnOutsideClick] default: null
 * @property {objectContentAnimation} [Animation]
 */

/**
 * @typedef {object} ControllerConfigType
 @property {Element} Target
 @property {array} [Data]

 @property {T} DataType

 @property {string} ListElement
 @property {string} [ListElementEmpty]
 @property {boolean} [DataClone]
 @property {object} [PropTypes]
 @property {object} [PropFormat]
 @property {string} [EmptyMessage]
 @property {boolean} [EmptyVisible]
 @property {object} [Pagination]

 @property {function} [LineSave]
 @property {function} [LineAdd]
 @property {function} [LineRemove]

 @property {boolean} [NoBuild]

 @property {void} [BeforeBuild]
 @property {void} [AfterBuild]
 @property {void} [AfterAdd]
 @property {Promise} [OnChange]
 @property {LureContent} [Owner]
 @property {boolean} [Debug]
 @template T
 */


class LureContent {
    /** @namespace this.Controller */
    /** @namespace this.Proto */
    static get Version(){
        return '0.3.1'
    }

    get FullName(){
        let p = this.Parent;
        let Name = this.Name;
        while (p){
            Name = p.Name +'.'+Name;
            p = p.Parent;
        }
        return Name;
    }

    /** @private */
    Props(){}
    /** @private */
    Methods(){}
    /** @private */
    AfterBuild(){}
    /** @private */
    BeforeBuild(){}

    Show(e){
        this._Show(e);
    }
    Hide(e){
        if (this._Hide)
            this._Hide(e);
    }
    Toggle(e){
        if (this._isActive)
            return this._Hide(e);
        this._Show(e);
    }
    get isVisible(){
        return Lure.isVisible(this.Content);
    }
    get isActive(){
        return this._isActive && !this._isPending;
    }


    get Data(){
        if (this.Controller)
            return this.Controller.Data;
        if (this.Proto)
            return this.Proto.Data;
        return null;
    }
    set Data(data){
        if (this.Controller) {
            this.Controller.Data = data;
            return;
        }
        if (this.Proto) {
            this.Proto.Data = data;
        }
    }
    get State(){
        return this.Proto.Data;
    }
    set State(NewData){
        return this.Proto.Data = NewData;
    }
    /*get Items(){
        if (this.Controller)
            return this.Controller.Items;
        return null;
    }*/
    RefreshOne(i){
        if (this.Controller)
            this.Controller.RefreshOne(i);
    }
    Add(Item, isPrepend){
        if (this.Controller)
            return this.Controller._Add(Item, isPrepend);
    }
    Edit(Line, Prop, Val){
        if (this.Controller)
            return this.Controller._Edit(Line, Prop, Val);
    }

    /**
     *
     * @param {int|object} Thing   index or Item
     * @returns {Promise}
     */
    Remove(Thing){
        if (this.Controller)
            return this.Controller._Remove(Thing);
    }

    Refresh(Data){
        return this._Refresh(Data);
    }
    GetIndex(HTMLElement) {
        HTMLElement = this.Select(HTMLElement);
        return Array.prototype.slice.call( HTMLElement.parentElement.children ).indexOf(HTMLElement);
    }
    AddEventListener(eventName, selector, func) {
        Lure.AddEventListenerGlobal(eventName,selector,func, this.Content, this);
    }
    AddTutor(buttonTutorStarter) {
        this.MonsieurTutor = new MonsieurTutor(this.Select(buttonTutorStarter), this.Content);
    }
    Dispose(){
        this.Content.remove();
        this.Control.Disactivate();
        this.Content = null;
        this.Control = null;
        //TODO dispose all
        //delete this.Controller;
        //delete this.Control;
    }
    get Title(){
        return this.TitleContent.innerHTML;
    }
    set Title(t){
        this.TitleContent.innerHTML = t;
    }
    Select(query){
        return Lure.Select(query, this.Content);
    }
    SelectAll(query){
        return Lure.SelectAll(query, this.Content)
    }

    /**
     *
     * @param Name
     * @returns {LureContent}
     */
    GetParent(Name = 'root'){
        let content = this;
        while (content.Parent !== null && content.Name !== Name)
            content = content.Parent;
        return content;
    }

    /**
     *
     * @param Name
     * @returns {LureContent}
     */
    GetContent(Name = 'root') {
        let parent = this.GetParent(Name);
        if (parent.Name === Name || Name === 'root')
            return parent;
        let found = null;
        if (Name === 'root')
            return found;
        function searcher(content) {
            //let f = null;
            for(let key in content){
                if (content.hasOwnProperty(key) && key !== "Parent" && !!content[key] && content[key].isContent){
                    if (content[key].Name === Name)
                        return content[key];
                    found = searcher(content[key]);
                }
            }
            return found;
        }
        return searcher(parent);

    };

    isAncestor(LureContent){
        if (!LureContent)
            return false;
        let p = LureContent.Parent;
        while (p){
            if (p === this){
                return true;
            }
            p = p.Parent;
        }
        return false;
    }
    isDescendant(LureContent){
        if (!LureContent)
            return false;
        let p = this.Parent;
        while (p){
            if (p === LureContent){
                return true;
            }
            p = p.Parent;
        }
        return false;
    }
    /**
     * @return {LureContent[]}
     */
    GetSubContentList(){
        return this._SubContentList.Where(x=>x.HasPermission);
    }

    /**
     * @return {LureContent}
     */
    GetSubContentCurrent(Type=null){
        return this._SubContentList.Where(x=>x.HasPermission)
            .Where(x=>x.HasPermission && x._isActive && (Type === null || (Type !== null && x.Type === Type) ) )
            .FirstOrDefault();
    }
    ShowSubContent(SubContentName=''){
        //calls for show first allowed subcontent with any type
        //as a rule it calls if this.Content has no own content to show
        if (SubContentName === ''){
            const SubContentList = this._SubContentList.Where(x=>x.HasPermission && x.Type!=='Untyped');
            const SubContent = SubContentList.FirstOrDefault();

            if (SubContentList.Where(x=>x._isActive).length < 1 && SubContent && !SubContent._isActive)
                SubContent.Show();
        }
        else{
            this._SubContent[SubContentName].Show();
        }
    }

    /**
     *  returns stolen content to target
     */
    ContentBack(){
        this.Target.appendChild(this.Content);
    }
    ChildrenBack(){
        let Subs = this.GetSubContentList();
        for (let i = 0; i < Subs.length; i++){
            Subs[i].Target.appendChild(Subs[i].Content);
        }
    }
    ChildrenRefresh(){
        let Subs = this.GetSubContentList();
        for  (let i = 0 ; i < Subs.length; i++){
            if (Subs[i]._isActive){{
                Subs[i].Refresh();
            }}
        }
    }

    HasElementPermission(Element, Data){
        let P = this._PermissionRules;
        if (!P)
            return true;
        return P.HasPermissionElement(Element, Data);
    }
    HasElementWritePermission(Element, Data){
        let P = this._PermissionRules;
        if (!P)
            return true;
        return P.HasPermissionWriteElement(Element, Data);
        /*if (!Element.attributes[this.Settings.Permission.Attribute]){
            Element = Element.closest(`[${this.Settings.Permission.Attribute}]`)
        }
        if (Element === null)
            return true;
        let Rule = Element.attributes[this.Settings.Permission.Attribute].value.toLowerCase();
        if (this.Settings.Permission.Rules[Rule]) {
            return this._Permission.CheckRoles(this.Settings.Permission.Rules[Rule].Write, Data);
        }
        return true;*/
    }
    get HasPermission(){
        let P = this._PermissionRules;
        if (!P)
            return true;
        return P.isAllow;
    }
    get HasPermissionWrite(){
        let P = this._PermissionRules;
        if (!P)
            return true;
        return P.isAllowWrite;
    }


    get _PermissionRules(){
        let p = this;
        while (p){
            if (p._Permission)
                return p._Permission;
            p = p.Parent;
        }
        return null;
    }

    Route(p){
        this._RouteParam = p;
        this._OnRoute(p);
    }

    /**
     * @param {string|HTMLElement} [Target]
     * @param {string} [Content]
     * @param {string} [CSS]
     * @param {string} [Name]
     * @param {function|boolean} [Route]
     * @param {boolean} [Global]
     * @param {string} [Type]
     * @param {boolean} [Visible]
     * @param {function} [SubContent]
     * @param {objectContentDialog} [Dialog]
     * @param {string} [Load]
     * @param {string} [LoadTarget]
     * @param {function} [BeforeHide]
     * @param {function} [BeforeShow]
     * @param {function} [Show]
     * @param {function} [Hide]
     * @param {objectContentAnimation} [Animation]
     * @param {function} [Shower]
     * @param {function} [Hider]
     * @param {function} [Refresh]
     * @param {object} [Sort]
     * @param {object} [Filter]
     * @param {function} [OnClick]
     * @param {object} [Proto]
     * @param {object} [State]
     * @param {function} [OnChange]
     * @param {object} [PropTypes]
     * @param {object} [PropFormat]
     * @param {ControllerConfigType} [Controller]
     * @param {ControllerConfigType} [ControllerConfig]
     * @param {objectContentControl} [Control]  (objectContentControl[])
     * @param {objectContentPermission} [Permission]
     * @param {function} [Pre]
     * @param {function} [Props]
     * @param {function} [Methods]
     * @param {object} [GetSet]
     * @param {function} [BeforeBuild]
     * @param {function} [AfterBuild]
     * @param {boolean} [Disabled]
     * @param {LureContent} [Parent]
     */
    constructor(
        {                                   //--Lure.Content Settings--
                    Target     = null,              //{string, HTMLElement} - where to render       [by default this.Parent.Content];
                    Content    = null,              //{string}  - html content string,              [by default this.Target.innerHTML]
                    //TODO Override   = Lure.Settings.Content.Override,    //{bool} override Target.innerHTML by Content (for Root-content only)
                    CSS        = '',                //{string}  - css classes string
                    Name       = null,              //{string}  - Lure.Content's name. Need for search content by .GetContent(contentName)
                    Route      = (p)=>{return this.Show(p)},
                    Global     = false,             //{bool}    - actual for SubContent. Set true, if SubContent is outside of Parent
                    Type       = "Untyped",         //{string}  - if has - this.Content will be invisible by default, if need be visible set next property:
                    Visible    = undefined,         //{bool}    - make visible by default (if has no Type - visible by default)
                    SubContent = [],                //{Array|function} of Lure.Content Settings
                    Dialog     = false,             //{bool} - make dialog absolute window with dialog wrapper
                    Load       = null,              //{string} - css selector where render Lure.Load
                    LoadTarget = null,              //{string} - css selector where render Lure.Load
                    BeforeHide = function(){},      //{function} - calls before .Hider and .Hide
                    BeforeShow = function(){},      //{function} - calls before .Shower and .Show
                    Show       = ()=>{},            //{function} - (after)show action
                    Hide       = ()=>{},            //{function} - (after)hide action
                    Animation  = null,
                    Shower     = function(){this.Content.style.display = '';},       //custom show handler [calls before .Show]
                    Hider      = function(){this.Content.style.display = 'none';},   //custom hide handler [calls before .Hide]

                    Refresh    = function(data){
                        if (this.Proto)
                            this.Proto.Refresh();
                        if (this.Controller)
                            this.Controller.Refresh(data)
                    },                              //{function} - refresh content, may be call on page resize for example
                    Sort    = false,                //{object}   - sort controls by field like 'field' -> '{css|HTMLElement}'  ex.: { count: '.head .count'}
                    Filter  = false,                //{object} - {"PropertyToFilter": ".QueryInputFilterElement"}
                    //Filtering  = false,           //{object}   - like sorting, but fast filter textbox would be
                    OnClick    = null,              //{function} - [deprecated] this.Content.onclick event
                    Proto      = {},                //{object}   - Refresh Templator Data Proto ex.: {Name: 'Hugo', Count: 42}
                    State      = null,              //{object}   - Refresh Templator Data Proto ex.: {Name: 'Hugo', Count: 42}
                    OnChange   = undefined,         //{promise}  - onchange fn (must return promise)
                    PropTypes  = {},                //{object}   - types of Data or Proto properties. ex.: {Name: Lure.PropTypes.String, Count: Lure.PropTypes.Int}
                    PropFormat = {},                //{object}   - delegates of Data.properties format. ex.:  DateProperty: (d)=>Lure.Date(d).Format('DD MMMM YYYY'),
                    Controller = null,              //{object} controller settings(Templator or TreeBuilder)
                    ControllerConfig = null,        //{object} controller settings(Templator or TreeBuilder)
                    Control    = null,              //{object} (help upper)


                    Permission = null,              //{object}  (help upper)
                    Pre        = function(){},      //{function}  - recommended for extra fields  for Lure.Content (this.Field1 =...)
                    Props      = function(){},      //{function}  - recommended for extra fields  for Lure.Content (this.Field1 =...)
                    Methods    = function(){},      //{function}  - recommended for extra methods for Lure.Content (this.Method1 = function(){...} )
                    GetSet     = {},                //{function}  - recommended for extra getters and setters for Lure.Content
                    BeforeBuild = function(){},     //{function} - calls before Content init (before Proto init)
            /** @private */
                    AfterBuild = function(){},      //{function} - calls after Lure.Content init
                    Disabled   = false,             //debugging,
                    Parent     = null               //link to parent Lure.Content
                }) {
        if (Disabled)
            return;
        this.ID = Lure.GetID();
        this.isContent = true;
        this._isActive   = false;
        this._isPending  = true;
        this.isRoot    = true;
        this.isGlobal  = Global;
        this.isRouteable = Route !== null && Route !== false && Route !== void 0;


        this._Name = Name;
        this._RouteParam = null;
        this._OnRoute = ()=>{};
        if (!this.isRouteable){
            this.Route = null;
        }
        if (this.isRouteable){
            this._RouteParam = '';
            this._OnRoute = Route.bind(this);
            // this.Route = (p)=>{
            //     this._RouteParam = p;
            //     this._OnRoute(p);
            // };
        }
        // this._RouteParam = null;
        // if (Route){
        //     this._RouteParam = '';
        // }
        /* Get default settings */
        this.Settings = Lure.Clone(Lure.Settings.Content.Defaults.Settings);
        /*Check For Permissions*/
        if (Permission){
            if (Permission.Attribute)
                this.Settings.Permission.Attribute = Permission.Attribute;
            this.Settings.Permission.Actions = Lure.Settings.Content.Defaults.Settings.Permission.Actions;
            if (Permission.Actions){
                for (let Act in Permission.Actions)
                    if (Permission.Actions.hasOwnProperty(Act)){
                        this.Settings.Permission.Actions[Act.toLowerCase()] = Permission.Actions[Act].bind(this);
                    }
            }
            if (Permission.Action && typeof Permission.Action === 'string'){
                if (this.Settings.Permission.Actions[Permission.Action]){
                    this.Settings.Permission.Action = this.Settings.Permission.Actions[Permission.Action].bind(this);
                }
            }
            else if (Permission.Action && typeof Permission.Action === 'function'){
                this.Settings.Permission.Action = Permission.Action.bind(this);
            }
            else {
                this.Settings.Permission.Action = Lure.Settings.Content.Defaults.Settings.Permission.Action;
            }
            if (Permission.Users)
                this.Settings.Permission.Users = Permission.Users;
            if (Permission.Roles)
                this.Settings.Permission.Roles = Permission.Roles;
            if (Permission.Write)
                this.Settings.Permission.Write = Permission.Write;
            if (Permission.Rules)
                this.Settings.Permission.Rules = Permission.Rules;

            if (Permission.Rules){
                for (let R in Permission.Rules)
                    if (Permission.Rules.hasOwnProperty(R)){
                        this.Settings.Permission.Rules[R.toLowerCase()] = Permission.Rules[R];
                    }
            }
            this._Permission = {
                isAllow: true,
                isAllowWrite: true,

                CheckRole: (Role, Data)=>{
                    if (Lure.GetType(Role) === 'number'){
                        return  (Lure.User.Roles.indexOf(Role) > -1 || (Lure.User.SubRoles[Role] && Lure.User.SubRoles[Role].length > 0));
                        //return  (Lure.User.Roles.indexOf(Role) > -1 || (Lure.User.SubRoles[Role] && Lure.User.SubRoles[Role].indexOf(-1) > -1));
                    }
                    else{
                        for (let SubRoleProperty in Role){              //ex. Role = {'ID':1488} for proto, or {'.ID':228} for Controller item
                            if (Role.hasOwnProperty(SubRoleProperty)){  //'ID'
                                let RoleValue = Role[SubRoleProperty];  //1488
                                if (Lure.User.SubRoles[RoleValue]){     //ex. Lure.User.SubRoles = {1488:[12,13,15], 228:[5,10,13],...}
                                    let Obj;
                                    let Property = SubRoleProperty;
                                    if (SubRoleProperty.substring(0,1) === '.'){  // '.ID' - Controller.Data[i].ID
                                        Obj = Data;
                                        Property = SubRoleProperty.substring(1);
                                    }
                                    else {                                        //  'ID'  - Proto.Data.ID
                                        Obj = this.Proto.Data;
                                    }
                                    let SubRoleValue = Lure.Object.GetProperty(Obj, Property);
                                    let isOk = Lure.User.SubRoles[Role[SubRoleProperty]].indexOf(SubRoleValue) > -1 ||
                                        Lure.User.SubRoles[Role[SubRoleProperty]].indexOf(-1) > -1 ;
                                    if (isOk)
                                        return isOk;
                                }
                            }
                        }
                    }
                },
                CheckRoles: (RolesRequired, Data)=>{
                    let isAllow = false;
                    if (!RolesRequired || RolesRequired.length < 1 || RolesRequired.indexOf(-1) > -1){
                        return true;
                    }
                    for (let i = 0; i < RolesRequired.length; i++){
                        let Role = RolesRequired[i];
                        if (this._Permission.CheckRole(Role, Data)){
                            isAllow = true;
                            break;
                        }
                    }
                    return isAllow;
                },
                CheckTheContent: ()=>{
                    let RolesRequired = this.Settings.Permission.Roles;
                    let isAllow = false;
                    if (RolesRequired.length < 1 || RolesRequired.indexOf(-1) > -1){
                        return true;
                    }
                    for (let i = 0; i < RolesRequired.length; i++){
                        let Role = RolesRequired[i];
                        if (this._Permission.CheckRole(Role)){
                            isAllow = true;
                            break;
                        }
                    }
                    if (!isAllow && this.Settings.Permission.Action)
                        this.Settings.Permission.Action.call(this);
                    return isAllow;
                },
                CheckTheContentWrite: ()=>{
                    let RolesRequired = this.Settings.Permission.Write;
                    let isAllow = false;
                    if (RolesRequired.length < 1 || RolesRequired.indexOf(-1) > -1){
                        return true;
                    }
                    for (let i = 0; i < RolesRequired.length; i++){
                        let Role = RolesRequired[i];
                        if (this._Permission.CheckRole(Role)){
                            isAllow = true;
                            break;
                        }
                    }
                    return isAllow;
                },

                HideEdits: (Element)=>{
                    let x = Lure.SelectAll('.l-edit-btn-edit, .l-edit-btn-remove', Element);
                    for (let i = 0; i < x.length; i++){
                        this.Settings.Permission.Actions.hide(x[i]);
                    }
                },
                CheckRules: ()=>{
                    let Rules = this.Settings.Permission.Rules;
                    let Ruled = this.SelectAll(`[${this.Settings.Permission.Attribute}]`);
                    for (let i = 0; i < Ruled.length; i++){
                        this._Permission.CheckElement(Ruled[i]);
                    }

                },

                Check: ()=>{
                    if (this._isInit)
                        ;//return;
                    /* checking permission to lure content at all */
                    let isAllow      = this._Permission.CheckTheContent();
                    let isAllowWrite = isAllow && this._Permission.CheckTheContentWrite();

                    if (isAllow /*&& !this._Permission.isAllow*/){
                        if (this.Control._ControlList){
                            for (let i = 0; i < this.Control._ControlList.length; i++){
                                for (let j = 0; j < this.Control._ControlList[i].Control.length; j++){
                                    this.Settings.Permission.Actions.show(this.Control._ControlList[i].Control[j]);
                                }
                            }
                        }
                    }
                    else if (!isAllow && this._Permission.isAllow){
                        this.Settings.Permission.Actions.hide(this.Content);
                        if (this.Control._ControlList){
                            for (let i = 0; i < this.Control._ControlList.length; i++){
                                for (let j = 0; j < this.Control._ControlList[i].Control.length; j++){
                                    this.Settings.Permission.Actions.hide(this.Control._ControlList[i].Control[j]);
                                }
                            }
                        }
                    }
                    if (isAllowWrite /*&& !this._Permission.isAllowWrite*/){
                        let x = this.SelectAll('.l-edit-btn-edit, .l-edit-btn-remove');
                        for (let i = 0; i < x.length; i++){
                            this.Settings.Permission.Actions.show(x[i]);
                        }

                    }
                    else if (!isAllowWrite){
                        let x = this.SelectAll('.l-edit-btn-edit, .l-edit-btn-remove');
                        for (let i = 0; i < x.length; i++){
                            this.Settings.Permission.Actions.hide(x[i]);
                        }
                    }
                    this._Permission.isAllow      = isAllow;
                    this._Permission.isAllowWrite = isAllowWrite;

                    /* check in proto elements */
                    let PermissionElements = this.SelectAll(`[${this.Settings.Permission.Attribute}]`);
                    for (let i = 0; i < PermissionElements.length; i++){
                        this._Permission.CheckElement(PermissionElements[i]);
                    }
                },

                HasPermissionElement: (Element, Data) => {
                    let Rule = Element.attributes[this.Settings.Permission.Attribute];
                    if (!Rule)
                        return true;
                    Rule = Rule.value.toLowerCase();
                    if (this.Settings.Permission.Rules[Rule]){
                        return this._Permission.CheckRoles(this.Settings.Permission.Rules[Rule].Roles, Data);
                    }
                },
                HasPermissionWriteElement: (Element, Data) => {
                    let Rule = Element.attributes[this.Settings.Permission.Attribute];
                    if (!Rule)
                        return true;
                    Rule = Rule.value.toLowerCase();
                    if (this.Settings.Permission.Rules[Rule]){
                        return this._Permission.CheckRoles(this.Settings.Permission.Rules[Rule].Write, Data);
                    }
                },
                CheckElement: (Element, Data)=>{
                    let Allow      = false;
                    let AllowWrite = false;
                    let Rule = Element.attributes[this.Settings.Permission.Attribute].value.toLowerCase();
                    if (this.Settings.Permission.Rules[Rule]){
                        Allow      = this._Permission.CheckRoles(this.Settings.Permission.Rules[Rule].Roles, Data);
                        AllowWrite = this._Permission.CheckRoles(this.Settings.Permission.Rules[Rule].Write, Data);
                        if (!AllowWrite){
                            this._Permission.HideEdits(Element);
                            if (this.Settings.Permission.Rules[Rule].ActionWrite){
                                this.Settings.Permission.Rules[Rule].ActionWrite.call(this, Element);
                            }
                        }
                        if (!Allow){
                            let Act = this.Settings.Permission.Rules[Rule].Action ? this.Settings.Permission.Rules[Rule].Action : this.Settings.Permission.DefaultAction;
                            if (typeof Act === 'string'){
                                this.Settings.Permission.Actions[Act](Element);
                            }
                            else if (typeof Act === 'function'){
                                Act.call(this, Element);
                            }
                        }else{
                            this.Settings.Permission.Actions.show(Element);
                        }
                    }
                },
                CheckLine: (DOMLine, Data)=>{
                    if (DOMLine.attributes[this.Settings.Permission.Attribute] /*&& !this._Permission.isAllow*/){
                        this._Permission.CheckElement(DOMLine, Data);
                    }
                    let Elements = Lure.SelectAll(`[${this.Settings.Permission.Attribute}]`, DOMLine);
                    for (let i = 0; i < Elements.length; i++){
                        this._Permission.CheckElement(Elements[i], Data);
                    }
                    if (!this._Permission.isAllowWrite){
                        let x = Lure.SelectAll('.l-edit-btn-edit, .l-edit-btn-remove', DOMLine);
                        for (let i = 0; i < x.length; i++){
                            //let ClosestPerm = x[i].closest(`[${this.Settings.Permission.Attribute}]`);
                            //if (!ClosestPerm || !this._Permission.HasPermissionWriteElement(ClosestPerm))
                            this.Settings.Permission.Actions.hide(x[i]);
                        }
                    }else{
                        // let x = Lure.SelectAll('.l-edit-btn-edit, .l-edit-btn-remove', DOMLine);
                        // for (let i = 0; i < x.length; i++){
                        //     this.Settings.Permission.Actions.show(x[i]);
                        // }
                    }
                    return DOMLine;
                }
            }
        }


        /**
         *
         * @param [initParent]
         * @param [initTarget]
         * @param [initName]
         * @return {Promise}
         * @private
         */
        function _Init(initParent = Parent, initTarget = Target, initName = Name) {
            let ConstructDone;
            this.Name   = this.Name   ? this.Name   : initName;
            this.Parent = this.Parent ? this.Parent : initParent;
            this.Type = Type;


            if (this.isRoot){
                Lure.ContentList._Root.push(this);
            }

            this.Control = new Lure._Content.Control(Control, this);
            if (Lure.Settings.Content.Permission.Strict && this._Permission){
                //this.Content = document.createElement('div');
                this._Permission.Check();
            }
            if (Lure.Settings.Content.Permission.Strict && this._Permission && !this._Permission.isAllow){
                this._isActive = false;
                return Promise.reject('no permission');
            }
            if (Lure.Settings.Content.Permission.Strict && this.Parent && this.Parent._Permission && !this.Parent._Permission.isAllow){
                this._isActive = false;
                return Promise.reject('no permission');
            }
            /* Check Parent */
            if (this.Parent) {
                /*if (this.Name) {
                    if (this.Parent[this.Name]) {
                        Lure.System.ShowWarn(`[Lure.Content] Content's child name (${this.Name}) is already used!`);
                        console.warn(`[Lure.Content] Content's child name (${this.Name}) is already used!`)
                    }
                    this.Parent[this.Name] = this;
                }*/
                this.Target = Global ? Lure.Select(Target) : Lure.Select(Target, this.Parent.Content);
                this.Target = this.Target ? this.Target : this.Parent.Content
            }
            this.Target = this.Target ? this.Target : Lure.Select(Target);
            if (!this.Target){
                //Lure.System.ShowError('[Lure.Content] Target is not defined');
                console.error( new Error('[Lure.Content] Target is not defined'), '\n', 'Content:', Content, 'Target:',Target, 'Parent:', Parent);
                return Promise.reject('no target');
            }


            /* Check Content */
            try{
                if (!Content) {                          //null or empty
                    this.Content = this.Target;
                    ConstructDone = construct.call(this);
                }
                else if (Content.match(/<[^>]+>/) === null) {    //not DOM string (file path)
                    Lure.GetFileText(Content)
                        .then(x => {
                            ContentPrepare.call(this, x);
                            ConstructDone = construct.call(this);
                        })
                        .catch(() => {
                            Lure.System.Error(`[Lure.Content] Error. Can not get file`);
                        });
                }
                else {
                    if (!ContentPrepare.call(this, Content)){
                        return Promise.resolve('ContentPrepare error'); //TODO check this for sure
                    }
                    ConstructDone = construct.call(this);
                }
            }
            catch (e){
                console.error(e, this.ID, this);
            }


            /* Check SubContents */
            for (let prop in this){
                /*if (this[prop] === null)
                    debugger;*/
                if (this.hasOwnProperty(prop) && !GetSet.hasOwnProperty(prop) && prop !== 'Parent'  && this[prop] && this[prop].isContent){
                    if (this[prop]._Init)
                        this[prop]._Init();
                }
            }
            this._Init = null;
            return ConstructDone;
        }
        this._SubContent = {};
        this._SubContentList = [];
        this._isInit = true;

        /**
         *
         * @type {Promise}
         */
        this.InitDone = new Promise((resolve)=>{
            this._Init = ()=>{
                _Init.call(this)
                    .then(resolve)
                    .catch(resolve) //TODO check this for sure
            };
        });
        //debugger;
        if ((Lure.Settings.Content.AutoInit && !Disabled) || (Lure.Application.isRun && !Disabled) ) {
            //console.log('instant init', Content);
            this._Init();
        }else{
            if (Parent && Name){
                Parent[Name] = this;
                this.Parent = Parent;
                this.Parent._SubContent[Name] = this;
                this.Parent._SubContentList.push(this);
            }
            if (SubContent && Lure.GetType(SubContent) === 'function'){
                SubContent.call(this);
                SubContent = null;
                //this._SubContentNames = [];
                for (let prop in this){
                    if (this.hasOwnProperty(prop) && prop && prop !== 'Parent' && this[prop] && this[prop].isContent){
                        this[prop].isRoot = false;
                        this[prop].Name   = this[prop].Name   ? this[prop].Name   : prop;
                        this[prop].Parent = (this[prop].Parent && !this[prop].Parent.isRoot) ? this[prop].Parent : this;
                        this._SubContent[this[prop].Name] = this[prop];
                        this._SubContentList.push(this[prop]);
                        //this._SubContentNames.push(this[prop].Name)
                    }
                }

            }

        }


        /* Initializing functions */
        /**
         *
         * @param Content
         * @returns {boolean}
         */
        function ContentPrepare(Content) {
            /* Init pre-build Properties */
            BeforeBuild.call(this);
            Pre.call(this);


            this.Controller = {
                Data: [],
                Refresh: ()=>{}
            };


            /* Shell PropFormat if undefined*/
            for (let k in PropFormat){
                if (PropFormat.hasOwnProperty(k)){
                    let fn = PropFormat[k];
                    PropFormat[k] = function (a,b) {
                        if (typeof a === 'undefined' && (!b || Object.keys(b).length < 1)){
                            return Lure.Settings.Controller.Common.Undefined
                        }
                        return fn.call(this, a,b);
                    }
                    /*
                    TODO support async PropFormat
                    let fn = PropFormat[k];
                    if (PropFormat[k].constructor !== 'AsyncFunction'){
                        PropFormat[k] = function (a,b) {
                            if (typeof a === 'undefined' && (!b || Object.keys(b).length < 1)){
                                return Lure.Settings.Controller.Common.Undefined
                            }
                            return fn.call(this, a,b);
                        }
                    }
                    else{
                        PropFormat[k] = async function (a,b) {
                            if (typeof a === 'undefined' && (!b || Object.keys(b).length < 1)){
                                return Lure.Settings.Controller.Common.Undefined
                            }
                            return await fn.call(this, a,b);
                        }

                    }
                    */

                }
            }






            /* Check for Refresh Proto */
            if (Proto) {
                if (State)
                    Proto = State;
                this.Proto = new Lure.Controller.TemplatorProto({
                    Target: this.Target,
                    Content: Content,
                    Data: Proto,
                    OnChange: OnChange,
                    PropTypes: PropTypes,
                    PropFormat: PropFormat,
                    Owner: this
                });
                this.Content       = this.Proto._SmartRender.GenElement(Proto, {RenderAnyway: true, Controller: this.Proto});
                this.Proto.Context = this.Proto._SmartRender.GetContext(this, this.Content);
                this.Proto.Content = this.Content;
            }
            if (!this.Content) {
                Lure._Content.ContentGet(Content, this);
            }
            try{
                this.Target.appendChild(this.Content);
            }
            catch (e){
                //let err = new Error(`Content target "${Target}" not found in Content "${this.Name}"`,);
                Lure.System.Error(`[Lure.Content] Error: Content target "${Target}" not found in Content "${this.Name}"`, '\n', this);
                return false;
                //throw err;
            }

            /////
            if (this.Content === null || this.Target === null) {
                this.isContent = false;
                Lure.System.Error(`[Lure.Content] Target or Content of Content.Name = "${this.Name}" is null!`);
                return false;
            }
            return true;
        }
        function construct() {


            /* Check included CSS (experimental) */
            if (CSS !== '') {
                let node = document.createElement('style');
                node.innerHTML = CSS;
                document.body.appendChild(node);
            }


            /* Check content for Dialog type */
            if (Dialog) {
                this.Content.classList.add(Lure.Settings.Content.CSSDialog);
                if (!Visible){
                    this._isActive = false;
                    Hider.call(this);
                }
                // if (Name === 'RequestSender' )
                //     debugger;

                /* check default settings */
                if (Dialog.Wrapper !== void 0)
                    this.Settings.Dialog.Wrapper = Dialog.Wrapper;
                if (Dialog.WrapperHandle !== void 0)
                    this.Settings.Dialog.WrapperHandle = Dialog.WrapperHandle;
                if (Dialog.Blur !== void 0)
                    this.Settings.Dialog.Blur = Dialog.Blur;
                if (Dialog.Animation !== void 0) {
                    if (Dialog.Animation.Show !== void 0)
                        this.Settings.Dialog.Animation.Show = Dialog.Animation.Show;
                    if (Dialog.Animation.Hide !== void 0)
                        this.Settings.Dialog.Animation.Hide = Dialog.Animation.Hide;
                }
                else {
                    //this.Settings.Dialog.Animation.Show = '';
                    //this.Settings.Dialog.Animation.Hide = '';
                }
                if (Dialog.OnOutsideClick){
                    Dialog.OnOutsideClick = Dialog.OnOutsideClick.bind(this);
                    Dialog.isHideOnOutsideClick = true;
                }
                if (Dialog.isHideOnOutsideClick){
                    let OutsiderCheck = (EventTarget)=>{
                        if (this._isActive && !this._isPending && (EventTarget !== this.Content && EventTarget.isConnected && !Lure.DOM.isDescendant(EventTarget, this.Content)))
                        {
                            if (Dialog.OnOutsideClick)
                                Dialog.OnOutsideClick(EventTarget);
                            this.Hide();
                        }
                    };
                    Lure._Content.OutsiderCheck.push(OutsiderCheck);

                }
            } else { this.Settings.Dialog = null;}

            /* Check Loader*/
            if (Load !== null){
                if (Load === ''){
                    this.Load = new Lure.Load({Target: this.Content});
                }
                else{
                    this.Load = new Lure.Load({Target: this.Select(Load)});
                }
            }else{
                this.Load = {Show:()=>{}, Hide: ()=>{}}
            }

            if (LoadTarget !== null){
                if (LoadTarget === ''){
                    this.Load = new Lure.Load({Target: this.Content});
                }
                else{
                    this.Load = new Lure.Load({Target: this.Select(LoadTarget)});
                }
            }else{
                this.Load = {Show:()=>{}, Hide: ()=>{}}
            }


            /* Check Animation */
            if (Animation) {
                if (typeof Animation.Show !== 'undefined')
                    this.Settings.Animation.Show = Animation.Show;
                if (typeof Animation.Hide !== 'undefined')
                    this.Settings.Animation.Hide = Animation.Hide;
            }
            else if (!Animation && Dialog) {
                this.Settings.Animation = this.Settings.Dialog.Animation;
            }
            //fixme to core fn
            //this.Settings.Animation._DurationShow = Lure.Plugin.Content.Core.GetDurationAnimation(this, 0);
            //this.Settings.Animation._DurationHide = Lure.Plugin.Content.Core.GetDurationAnimation(this, 1);
            this.Settings.Animation._DurationShow = Lure.GetDurationAnimation(this.Settings.Animation.Show, this.Content);
            this.Settings.Animation._DurationHide = Lure.GetDurationAnimation(this.Settings.Animation.Hide, this.Content);




            /* Init Extra Properties */
            Props.call(this);

            /* Init Extra Methods */
            Methods.call(this);

            /* Init Extra Getters and Getters*/
            let GetSetNames = [];
            for (let k in GetSet) {
                if (!GetSet.hasOwnProperty(k))
                    continue;
                GetSetNames.push(k);
                Object.defineProperty(this, k, Object.getOwnPropertyDescriptor(GetSet, k));
            }

            /* Sort */
            if (Sort){
                this.Sort = {
                    /** @this LureContent */
                    _Reset: ()=>{

                        let SorterIcons = this.SelectAll('.l-sorter-up, .l-sorter-down');
                        for (let i = 0; i < SorterIcons.length; i++){
                            SorterIcons[i].classList.remove('l-sorter-up');
                            SorterIcons[i].classList.remove('l-sorter-down');
                        }
                    }
                };
                for (let SortProp in Sort){
                    if (!Sort.hasOwnProperty(SortProp)){
                        continue;
                    }
                    this.Sort[SortProp] = {
                        Target: this.Select(Sort[SortProp]),
                        Delegate: (a,b)=>{
                            // if (this.Controller.PropTypes[SortProp]){
                            //     Lure.PropTypes.CheckProp(a, this.Controller.PropTypes[SortProp], SortProp);
                            //     Lure.PropTypes.CheckProp(a, this.Controller.PropTypes[SortProp], SortProp);
                            // }
                            // let ValueA = Lure.Object.GetProperty(a, SortProp);
                            // let ValueB = Lure.Object.GetProperty(b, SortProp);

                            let ValueA = Lure.Object.GetProperty(a, SortProp);
                            let ValueB = Lure.Object.GetProperty(b, SortProp);
                            if (this.Controller.PropTypes[SortProp]){
                                ValueA = Lure.PropTypes.TryParse(this.Controller.PropTypes[SortProp], Lure.Object.GetProperty(a, SortProp), SortProp);
                                ValueB = Lure.PropTypes.TryParse(this.Controller.PropTypes[SortProp], Lure.Object.GetProperty(b, SortProp), SortProp);
                            }
                            else if (ValueA.localeCompare) { //if string
                                return ValueA.localeCompare(ValueB, Lure.Settings.LocaleSort);
                            }

                            if (ValueA > ValueB)
                                return 1;
                            if (ValueA < ValueB)
                                return -1;
                            return 0;
                        },
                    };
                    this.Sort[SortProp].Target.classList.add('l-pointer');
                    this.Sort[SortProp].Target.classList.add('l-rel');
                    this.Sort[SortProp].Target.innerHTML = this.Sort[SortProp].Target.innerHTML  + `<div class="l-abs l-sorter"></div>`;
                    this.Sort[SortProp].Target.addEventListener('click', (e)=>{
                        let SorterIcon = Lure.Select('.l-sorter', e.currentTarget);
                        let isSortReverse = SorterIcon.classList.contains('l-sorter-down');
                        this.Sort._Reset();
                        this.Controller._Sort(isSortReverse ? null: this.Sort[SortProp].Delegate)
                            .then(Invert=>{
                                if (isSortReverse)
                                    return;
                                if (Invert > 0)
                                    SorterIcon.classList.add('l-sorter-up');
                                else
                                    SorterIcon.classList.add('l-sorter-down');
                            })
                    });

                }
            }

            /* Init private methods */
            this._Refresh = Refresh.bind(this);


            /* Init Show function */
            let ToggleTimer = null;
            this._BeforeShow = BeforeShow.bind(this);
            this._BeforeHide = BeforeHide.bind(this);
            this._Shower = Shower.bind(this);
            this._Hider =  Hider.bind(this);
            this._Show = (event, CalledByChild=false) => {
                if (this._Permission && !this._Permission.isAllow) {
                    return;
                }
                //NOTE:
                //when show called by control and there is eventListener to anywhere like ()=> {if (!this.isActive) this.Hide(); }, there is some issue.
                //In case 'Show' is called by control, it calls 'async toggle', and while 'asyncToggle' is pending, control click bubbling calls 'this.Hide()' from that listener.
                // _isPending somehow helps, but this is not very good solution yet



                //TODO: (!) check for bugging because of next line is commented:
                //if commented: bug with getting current content (subcontent):
                this._isActive = true;
                this._isPending = true;
                if (this.Control)
                    this.Control.Activate();

                /* Hide same contents */
                if (this.Type !== "Untyped" /*&& !this.isVisible*/) {
                    Lure.ContentList[this.Type].forEach((item) => {
                        if (item !== this && item._isActive)
                            item.Hide();
                    });
                }
                if (!this.isGlobal && this.Parent && !this.Parent.isVisible && (!this.Parent._Permission || this.Parent._Permission.isAllow) ){
                    Lure.Route.LockParent = true;
                    this.Parent._Show(null, true);
                    Lure.Route.LockParent = false;
                }
                //this timeout doesn't start until another contents would be hidden;
                window.setTimeout(()=>{
                    /* Route*/
                    if (Lure.Route.Enabled && this.isRouteable && !Lure.Route.Lock && this.Name){
                        Lure.Route.Lock = true;
                        if (!Lure.Route.LockParent){
                            Lure.Route.Push(this);
                            Lure._Content.Current = this;
                        }
                        Lure.Route.Lock = false;
                    }

                    /* Check content for Dialog type */
                    if (this.Settings.Dialog) {
                        let zIndex = Lure._Dialog.zIndex;
                        Lure._DialogCount++;
                        this.Content.style.zIndex = zIndex + 2;
                        if (this.Settings.Dialog.Wrapper) {
                            if (!this._DialogWrapper)
                                this._DialogWrapper = Lure.CreateElementFromString(`<div class="${Lure.Settings.Content.CSSDialogWrapper}">`);
                            if (this.Settings.Dialog.WrapperHandle)
                                this._DialogWrapper.addEventListener('click', this._Hide);

                            // let WrapperTarget = document.body;
                            // if (this.Settings.Dialog.Wrapper.Target)
                            //     WrapperTarget = Lure.Select(this.Settings.Dialog.Wrapper.Target);
                            this.Target.appendChild(this._DialogWrapper);
                            this._DialogWrapper.style.zIndex = zIndex + 1;

                            /*let zIndexWrapper = parseInt(window.getComputedStyle(this._DialogWrapper).zIndex);
                             let zIndexContent = parseInt(window.getComputedStyle(this.Content).zIndex);
                             if (Number.isNaN(zIndexContent) || zIndexContent < zIndexWrapper)
                             this.Content.style.zIndex = zIndexWrapper + 1;
                             */
                        }
                        if (this.Settings.Dialog.Blur) {
                            this._DialogWrapper.style.background = 'none';
                            Lure.Select(this.Settings.Dialog.Blur).classList.add(Lure.Settings.Content.CSSBlur);
                        }
                        Lure._Dialog.Add(this.Content)
                    }
                    ToggleTimer = Lure.AsyncToggle(
                        this,
                        event,
                        this.Content,
                        ()=>{
                            if (!CalledByChild){
                                this._BeforeShow.call(this, event);
                            }
                            this._Shower.call(this);
                        },
                        CalledByChild ? ()=>{this._isPending=false; this._isActive=true;} : (e)=>{this._isPending=false; this._isActive=true; Show.call(this, e)},
                        this.Settings.Animation.Hide,
                        this.Settings.Animation.Show,
                        this.Settings.Animation._DurationShow,
                        ToggleTimer
                    );
                }, 0);



            };
            this._Hide = (event) => {
                this._isActive = false;
                if (this.Control)
                    this.Control.Disactivate();

                /* Route*/
                //Lure.Route.Back();
                /*if (Lure.Route.Enabled && this.Name){
                    Lure.Route.Lock = true;
                    let h = '';
                    let p = this.Parent;
                    while(p){
                        h = p.Name + '/' + h;
                        p = p.Parent;
                    }
                    
                    window.location.hash = h;
                    Lure.Route.Lock = false;
                }*/

                if (Dialog) {
                    Lure._Dialog.Remove(this.Content);
                    Lure._DialogCount--;
                    if (this.Settings.Dialog.Wrapper && this._DialogWrapper) {
                        if (this.Settings.Dialog.WrapperHandle)
                            this._DialogWrapper.removeEventListener('click', this._Hide);
                        this._DialogWrapper.remove();
                    }
                    if (this.Settings.Dialog.Blur && Lure._DialogCount < 1)
                        Lure.Select(this.Settings.Dialog.Blur).classList.remove(Lure.Settings.Content.CSSBlur);
                }

                ToggleTimer = Lure.AsyncToggle(
                    this,
                    event,
                    this.Content,
                    this._BeforeHide,
                    function () {
                        this._Hider.call(this);
                        Hide.call(this, event);
                    },
                    this.Settings.Animation.Show,
                    this.Settings.Animation.Hide,
                    this.Settings.Animation._DurationHide,
                    ToggleTimer
                );
            };



            this.__private = {};

            this.Content.onclick = OnClick ? OnClick.bind(this) : this.Content.onclick;
            /* SubContent */
            if (Array.isArray(SubContent)) {
                for (let i = 0; i < SubContent.length; i++) {
                    {
                        if (!SubContent[i].Parent)
                            SubContent[i].Parent = this;
                        //  this.__private.ContentNames.push(SubContent[i].Name);
                        this[SubContent[i].Name] = new Lure.Content(SubContent[i]);
                        this._SubContent[SubContent[i].Name] = this[SubContent[i].Name];
                        this._SubContentList.push(this[SubContent[i].Name]);

                    }
                }
            }
            else if (SubContent instanceof Function){
                SubContent.call(this);
            }
            else {
                for (let cname in SubContent) {
                    SubContent[cname].Parent = this;
                    SubContent[cname].Name = cname;
                    //       this.__private.ContentNames.push(cname);
                    this[cname] = new Lure.Content(SubContent[cname]);
                    this._SubContent[cname] = this[cname];
                    this._SubContentList.push(this[cname]);
                }
            }
            //title




            if ((Type === "Untyped" && Visible !== false) && !Dialog)
                Visible = true;
            else if ((Type !== "Untyped" && Visible !== true) || ( Dialog && Visible !== true))
                Visible = false;

            //if (Typed) Content is Visible
            if (Visible) {
                this._Shower.call(this);
                this._isActive = true;
                if (this.Control)
                    this.Control.Activate();
            }
            else { //not undefined
                this._isActive = false;
                this._Hider.call(this);
            }
            if (Controller || ControllerConfig) {
                Controller = !!Controller ? Controller : ControllerConfig;

                if (Controller.isController) {
                    this.Controller = Controller;
                    this.Controller.Owner = this;
                    this.Controller.PropTypes  = PropTypes;
                    this.Controller.PropFormat = PropFormat;
                }
                else {
                    if (!Controller.Target)
                        Controller.Target = this.Content;
                    if (!Controller.Type)
                        Controller.Type = 'Templator';
                    Controller.Owner = this;
                    Controller.PropTypes  = {
                        ...PropTypes,
                        ...Controller.PropTypes,
                    };
                    Controller.PropFormat = {
                        ...PropFormat,
                        ...Controller.PropFormat,
                    };
                    this.Controller = new Lure.Controller[Controller.Type](Controller);
                }

            }

            /* Init Ending */

            /* Register Content */
            if (!Lure.ContentList[this.Type]) //create new list of this type if haven't exist yet
                Lure.ContentList[this.Type] = [];
            Lure.ContentList[this.Type].push(this);
            Lure._Content.List.push(this);
            // By ID
            Lure._Content.ByID[this.ID] = this;
            // By Name
            if (this.Name)
                Lure._Content.ByName[this.Name] = this;
            // By Type
            if (!Lure._Content.ByType[this.Type])
                Lure._Content.ByType[this.Type] = [];
            Lure._Content.ByType[this.Type].push(this);
            /* Init Close button */
            let ButtonClose = this.Content.children
                .Where(x=>x.classList.contains('close'))
                .FirstOrDefault();
            if (ButtonClose){
                ButtonClose.addEventListener('click', this._Hide)
            }
            /*Array.from(this.Content.children).forEach(function (item) {
                if (item.classList.contains("close"))
                    item.onclick = function (e) {
                        this.Hide(e);
                    }
            });*/
            //binding this
            for (let key in this) {
                if (!this.hasOwnProperty(key) || GetSetNames.indexOf(key) > -1 ) //for won't call getter below
                    continue;
                if (key !== '_Init' && this[key] instanceof Function) {
                    this[key] = this[key].bind(this);
                }
                else if (key && key !== 'Parent' && this[key] instanceof Lure.Content) {
                    this[key].Parent = this[key].Parent ? this[key].Parent : this;
                    this[key].Name   = this[key].Name ? this[key].Name : key;
                }
            }
            //if (this.Name === 'Details') debugger;


            if (this.Proto)
                this.Proto.Refresh();
            if (this.Controller && !this.Controller._NoBuild)
                this.Controller.Refresh();
            let InitDone = new Promise( (resolve)=>{
                setTimeout(function () {
                    this._isInit = false;
                    AfterBuild.call(this);
                    resolve(this);
                }.bind(this), 1);
            });
            return InitDone;

        }




        if (Parent === null)
            Lure.Application.Content.push(this);
    }



};
Lure.Content = LureContent;
Lure._Content = {
    Control: class LureControl{
        Activate(type){
            if (type){
                return this[type].Activate();
            }
            if (this._ControlList)
                for (let i = 0; i < this._ControlList.length; i++){
                    this._ControlList[i].Activate();
                }
        }
        Disactivate(type){
            if (type){
                return this[type].Disactivate();
            }
            if (this._ControlList)
                for (let i = 0; i < this._ControlList.length; i++){
                    this._ControlList[i].Disactivate();
                }

            /*for (let k in this)
                if (this[k].Type === type)
                {
                    this[k].Content.forEach(function (item) {
                        item.classList.remove('active');
                    });
                    if (this[k].isGlobal)
                        Lure.SelectAll(this[k]._Content).forEach(function(item){
                            item.classList.remove('active');
                        })
                }*/
        }
        constructor(controls, owner){
            if (!controls || (controls.length  < 1 && !controls.Target))
                return;
            const BuildControl = (c)=>{
                let con = {
                    Control: Lure.SelectAll(c.Target),
                    Type: c.Type ? c.Type : "Untyped",
                    isGlobal: !!c.Global,
                    OnClick: c.OnClick ? c.OnClick.bind(owner) : owner.Show,
                    OnChange: c.OnChange,
                    Activate(){
                        let cs = this.Control;
                        if (this.isGlobal){
                            cs = Lure.SelectAll(this._query, owner.Content);
                        }
                        for (let j = 0; j < cs.length; j++){
                            cs[j].classList.add('active');
                        }
                    },
                    Disactivate(){
                        let cs = this.Control;
                        if (this.isGlobal){
                            cs = Lure.SelectAll(this._query, owner.Content);
                        }
                        for (let j = 0; j < cs.length; j++){
                            cs[j].classList.remove('active');
                        }
                    },
                    _query: c.Target
                };

                if (con.isGlobal){
                    Lure.AddEventListenerGlobal('click', c.Target, con.OnClick, document, owner);
                    if (con.OnChange)
                        Lure.AddEventListenerGlobal('change', c.Target, con.OnChange, document, owner);
                }
                else {
                    let Clicks = Lure.SelectAll(c.Target);
                    for (let j = 0; j < Clicks.length; j++){

                        Clicks[j].classList.add('l-control');
                        Clicks[j].addEventListener('click', con.OnClick.bind(owner));
                        if (con.OnChange)
                            Clicks[j].addEventListener('click', con.OnChange.bind(owner));
                    }
                }

                this._ControlList.push(con);
                if (con.Type !== 'Untyped')
                    this[con.Type] = con;
            };
            this._ControlList = [];
            for (let i = 0; i < controls.length; i++){

                let c = controls[i];
                //console.log(owner.Name, c.Target);
                BuildControl(c);
            }
            if (controls.Target){
                BuildControl(controls);
            }


            //return;
            /*
            if (control.length > 0) //if control list not empty
            {
                let controls = this;
                for (let i = 0; i < control.length; i++)
                {
                    if (!control[i].Name)
                        control[i].Name = "unnamed_" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
                    controls[control[i].Name] = {
                        Content: Lure.SelectAll(control[i].Target),
                        _Content: control[i].Target,
                        Type: control[i].Type ? control[i].Type : "Untyped",
                        isGlobal: control[i].Global,
                        OnClick: control[i].OnClick ? control[i].OnClick : owner.Show,
                        OnChange: control[i].OnChange,
                        Active: function(){
                            //let Clickers = Lure.SelectAll(control[i].Target);
                            Lure.SelectAll(control[i].Target).forEach(function (item) {
                                item.classList.add('active');
                            })
                        },
                        Disactive: function(){
                            Lure.SelectAll(control[i].Target).forEach(function (item) {
                                item.classList.remove('active');
                            });
                        }

                    };
                    //onclick
                    controls[control[i].Name].Content.forEach(function (item) {
                        item.classList.add('pointer');
                    });
                    if (control[i].Global){

                        Lure.AddEventListenerGlobal('click', control[i].Target, function (e) {
                            Lure.SelectAll(control[i].Target).forEach(function (item) {
                                item.classList.remove('active');
                            });
                            e.target.classList.add('active');
                            if (controls[control[i].Name].OnClick)
                                controls[control[i].Name].OnClick.call(owner, e);
                        });
                    }
                    else{
                        controls[control[i].Name].Content.forEach(function (item) {
                            item.onclick = function (e) {
                                Lure.ContentList[owner.Type].forEach((item) =>
                                {
                                    if ((item) !== owner)
                                    {
                                        if (item.Control)
                                            item.Control.Disactive();
                                    }
                                });
                                //console.log('remover', e);
                                controls[control[i].Name].Content.forEach(function (item) {
                                    item.classList.remove('active');
                                });
                                e.currentTarget.classList.add('active');
                                controls[control[i].Name].OnClick.call(owner, e);
                            };

                        })
                    }

                    if (control[i].OnChange)
                    {
                        if (control[i].Global){
                            Lure.AddEventListenerGlobal('change', control[i].Target, function (e) {
                                control[i].OnChange.call(owner, e);
                            } )
                        }
                        else{
                            controls[control[i].Name].Content.forEach(function (item) {
                                item.onchange = function (e) {
                                    control[i].OnChange.call(owner, e);
                                };
                            })
                        }
                    }
                }
            }*/
        }
    },
    ContentGet: function (DOMString, self) {
        try{
            const Contentos = Lure.CreateElementsFromString(DOMString);
            if (Contentos.length > 1){
                self.Content = self.Target;
                for (let i = 0; i < Contentos.length; i++){
                    self.Content.appendChild(Contentos[i]);
                }
            }
            else{
                self.Content = Contentos[0];
            }
        }
        catch(e) {
            Lure.System.Error(`[Lure.Content] ContentGet Error. ${self.Name} ` + e);
        }

    },


    Permission: {

    },

    Current: null,
    List: [],
    ByID: {},
    ByName: {},
    ByType: {},

    // list of delegates checking for hide contents which have to be hidden on somewhere click.
    // (HTMLElement)=>hide ot not hide so
    OutsiderCheck: []

};
Lure.Settings.Content = {
    AutoInit: false,
    CSSBlur: 'l-blur',
    CSSDialog: 'l-dialog',
    CSSDialogWrapper: 'l-dialog-wrapper',
    Override: false,

    Permission: {
        Strict: false, //if true: drop content if has no permission (don't render or init at all)
    },
    Defaults: {
        Settings:{
            Animation: {
                Show: '',
                Hide: '',
            },
            Dialog: {
                Animation: {
                    Show: 'l-animation_dialog-show',
                    Hide: 'l-animation_dialog-hide'
                },
                Blur: false,
                Wrapper: true,
                WrapperHandle: true,
                isHideOnOutsideClick: false,

                OnOutsideClick: null,
            },
            Permission: {
                Attribute: 'data-permission',
                DefaultAction: 'hide',
                Users: [],
                Roles: [],
                Write: [],
                Action: ()=>{}, //()=>{Lure.System.ShowWarn(Lure.Culture.Lang.YouHaveNoPermission)},

                Rules: {
                    DefaultSample: {
                        Users: [],
                        Roles: [],
                        Write: [],
                        ActionWrite: null,
                        Action: 'hide', //DefaultAction
                    }
                },
                Actions: {
                    hide: (element)=>{
                        if (element)
                            element.style.display = 'none'
                    },
                    show: (element)=>{
                        if (element)
                            element.style.display = ''
                    },
                    remove: (element)=>{
                        if (element)
                            element.remove();
                    }
                },
            },
        },
    }
};

// outsiders ckecker
document.addEventListener('click', function(e){
    for (let OutsideCheck of Lure._Content.OutsiderCheck){
        OutsideCheck(e.target);
    }
});




//Tutorial
//TargetButton = {string, HTMLElement} - button who start the tutor
//TargetContent = {string, HTMLElement} - select/element where search tutors
// Lure.Plugin.Tutor = class LureTutor{
//     /**
//      *
//      * @param {HTMLElement} TargetButton
//      * @param {HTMLElement} TargetContent
//      */
//     constructor(TargetButton = null, TargetContent = null){
//         //### DEFINES
//         let $this = this;
//         this.TargetButton = Lure.Select(TargetButton);
//         this.TargetContent = Lure.Select(TargetContent);
//         const MT = `<div class="lure-tutor">
//                         <div class="cd-caption">
//                             <span>Шаг </span>
//                             <span class="lure-tutor_step"></span>
//                         </div>
//                         <div class="lure-tutor_desc"></div>
//                         <div class="lure-tutor_btns">
//                             <button class="button btn-tutor btn-tutor-stop">Прервать обучение</button>
//                             <button class="button btn-tutor btn-tutor-next">Далeе →</button></div>
//                    </div>`;
//         this.Content = Lure.CreateElementFromString(MT);
//         this.ContentBG = Lure.CreateElementFromString('<div class="lure-tutor-bg dialog-wrapper"></div>');
//         this.Content.style.display = 'none';
//         this.ContentBG.style.display = 'none';
//         this._Description = this.Content.querySelector('.lure-tutor_desc');
//         this._Step = this.Content.querySelector('.lure-tutor_step');
//         this._ButtonNext = this.Content.querySelector('.btn-tutor-next');
//         this._ButtonStop = this.Content.querySelector('.btn-tutor-stop');
//
//         $this.Data = [];
//         const ButtonNextText = this._ButtonNext.innerHTML;
//         let TutorPosition = 0;
//         /*get transparent*/
//         let temp = document.createElement('div');
//         temp.style.display = 'none';
//         document.body.appendChild(temp);
//         const ColorTransparent = window.getComputedStyle(temp).backgroundColor;
//         temp.remove();
//         //---
//         const ElemCssRestore = function () {
//             let Element = $this.Data[TutorPosition-1].obj;
//             if (Element.tagName.toLowerCase() !== 'tr')
//             {
//                 Element.style.zIndex = '';
//                 Element.style.position = '';
//                 Element.style.outline = '';
//                 Element.style.display = '';
//                 Element.style.backgroundColor = '';
//                 return;
//             }
//             let nElements = Element.querySelectorAll('th, td');
//             nElements.forEach(function (elem) {
//                 elem.style.position = '';
//                 elem.style.zIndex = '';
//             });
//         };
//         const ElemCssSet = function (Element) {
//             if (Element.tagName.toLowerCase() !== 'tr')
//             {
//                 Element.style.zIndex = '11';
//                 Element.style.position = 'relative';
//                 Element.style.outline = '5px #bee0ff solid';
//                 let style = window.getComputedStyle(Element);
//                 if (style.backgroundColor === ColorTransparent)
//                     Element.style.backgroundColor = "#fff";
//                 if (!Lure.isVisible(Element) )
//                 {
//                     if (Element.tagName.toLowerCase() !== "table" )
//                         Element.style.display = 'block';
//                     else
//                         Element.style.display = 'table';
//                 }
//                 /* if (Element.length > 1)
//                  Element.eq(1).css({zIndex: '', outline: ''});*/
//                 return;
//             }
//             let nElements = Lure.SelectAll('th, td', Element);// Element.querySelectorAll('th, td');
//             for (let i = 0; i < nElements.length; i++){
//                 nElements[i].style.zIndex = "11";
//                 nElements[i].style.position = "relative";
//                 let style = window.getComputedStyle(nElements[i]);
//                 if (style.backgroundColor === ColorTransparent){
//                     nElements[i].style.backgroundColor = "#fff";
//                 }
//             }
//         };
//         const Run = function () {
//             console.log("tutor run");
//             if ($this.TargetContent === null)
//                 return;
//             let Items = $this.TargetContent.querySelectorAll('*[data-tutor]:not([data-line]), *[data-tutor][data-line="0"]');
//             if (Items.length < 1){
//                 Lure.Confirm("Сообщение", "На этом экране нет подсказок");
//                 return;
//             }
//             // document.body.style.position = 'relative';
//
//             Items.forEach(function (item) {
//                 $this.Data.push({
//                     obj: item,
//                     desc: item.dataset['tutor']
//                 })
//             });
//             $this.Content.style.display = '';
//             $this.ContentBG.style.display = '';
//             GoStep();
//         };
//         const GoStep = function () {
//             //restore prev element's css
//             if (TutorPosition > 0)
//                 ElemCssRestore();
//             if (TutorPosition === $this.Data.length)
//             {
//                 Stop();
//                 return;
//             }
//             //select next elem
//             let Element = $this.Data[TutorPosition].obj;
//             let ElementDesc = $this.Data[TutorPosition].desc;
//             // check for invisible parent
//             let ElemParent = ElementDesc.match(/{([\s\S]+)}/);
//             if (ElemParent !== null)
//             {
//                 ElemParent = ElemParent[1];
//                 ElementDesc = ElementDesc.replace(/{([\s\S]+)}/, '');
//                 Element = Element.closest(ElemParent);
//                 $this.Data[TutorPosition].obj = Element;
//                 //Element.push( );
//             }
//             //set element visible
//             ElemCssSet(Element);
//             //write new element title and desc
//             $this._Step.innerHTML = (TutorPosition+1) + "/"+$this.Data.length;
//             $this._Description.innerHTML = ElementDesc;
//             //caption next button
//             if ((TutorPosition+1) === $this.Data.length)
//             {
//                 $this._ButtonNext.innerHTML = 'Завершить';
//                 $this._ButtonStop.style.opacity = '0';
//             }
//
//             //move tutor desc box
//             let posX = Element.offsetLeft + Element.clientWidth + 10;
//             let posY = Element.offsetTop - $this.Content.clientHeight - 10;
//             if (posY < 10)
//                 posY = 10;
//             if ( (posX + $this.Content.clientWidth) > window.innerWidth )
//             {
//                 posX = Element.offsetLeft - $this.Content.clientWidth - 10;
//                 if (window.innerWidth < $this.Content.clientWidth + Element.clientWidth)
//                 {
//                     posX = Element.offsetLeft + Element.clientWidth - $this.Content.clientWidth - 20;
//                 }
//
//             }
//             if (document.documentElement.scrollTop  > posY || document.documentElement.scrollTop + window.innerHeight < Element.offsetTop + Element.offsetHeight)
//             {
//                 //$('html, body').animate({scrollTop: posY - 10}, 300);
//                 document.documentElement.scrollTop =  (posY - 10);//  +'px';
//             }
//             if (posX < 10)
//                 posX = 10;
//             $this.Content.style.left = posX +'px';
//             $this.Content.style.top = posY +'px';
//
//             TutorPosition++;
//         };
//         const Stop = function () {
//             //     document.body.style.position = '';
//             ElemCssRestore();
//             $this.Content.style.display = 'none';
//             $this.ContentBG.style.display = 'none';
//             $this._ButtonNext.innerHTML = ButtonNextText;
//             $this._ButtonStop.style.opacity = '';
//             TutorPosition = 0;
//             $this.Data = [];
//         };
//         //### CONSTRUCT
//
//         this.TargetButton.onclick = Run;
//         this._ButtonNext.onclick = GoStep;
//         this._ButtonStop.onclick = Stop;
//
//         document.body.appendChild(this.Content);
//         document.body.appendChild(this.ContentBG);
//
//         //### METHODS
//         this.Run = Run;
//
//     }
// };
//





Lure.Plugin.Tooltip = class LureTooltip{
    constructor({
                    Target    = document,           //Target-listener (global document by default)
                    Attribute = "data-tooltip",     // data-tooltip="Help text here"
                    Delay     = 400,                //delay before tooltip show
                    Time      = 1100,               //showing time
                    //Cursor    = "help",             //item:hover cursor
                    Custom    = `<div class="lure-tooltip">`,               //custom html of tooltip
                    AfterBuild = function(){}

                })
    {
        let $this = this;
        this.ToolTip = Lure.CreateElementFromString(Custom);
        let Timer = null;
        let TimerDestroy = null;
        this.Target = Lure.Select(Target);
        const Show = function (text){
            this.ToolTip.innerHTML = text;
            $this.Target.appendChild(this.ToolTip);

        }.bind(this);
        Lure.AddEventListenerGlobal('mouseover', `[${Attribute}]`, function (e) {
            let text = e.currentTarget.dataset[Attribute.replace('data-', '')];
            clearTimeout(TimerDestroy);
            Timer = setTimeout(function(){
                Show(text);
            }, Delay);
        }, this.Target);
        Lure.AddEventListenerGlobal('mouseout', `[${Attribute}]`, function () {
            clearTimeout(Timer);
            TimerDestroy = setTimeout(function () {
                //$this.ToolTip.remove();
            }, Time)
        }, this.Target);
        setTimeout(function () {
            AfterBuild.bind($this);
        }, 0)
    }

};



Lure.Tutor   = Lure.Plugin.Tutor;
Lure.Tooltip = Lure.Plugin.Tooltip;




Lure.RunTutor = (function () {
    let tt = new Lure.Content({
        Target: 'body',
        Name: 'LureTT',
        Visible: false,
        Content: `<div class="l-tutor">
                    <div class="cd-caption">Шаг {{Step}}/{{StepCount}}</div>
                    <div class="inner-content">
                      <div class="tutor-description">{{Description}}</div>
                      <div class="l-row">
                        <button class="l-button button btn-tutor btn-tutor-stop">{{ButtonStopCaption}}</button>
                        <button class="l-button button btn-tutor btn-tutor-next">{{ButtonNextCaption}}</button>
                      </div>
                    </div>
                    
                  </div>`,
        State: {
            Step: 1,
            StepCount: 1,
            Description: '',

            ButtonNextCaption: "Далeе →",
            ButtonStopCaption: "Прервать обучение",
        },
        Props: function () {
            this._TutorBG = Lure.CreateElementFromString('<div class="l-tutor-bg dialog-wrapper" style="display: none"></div>');

            this._ButtonNext = this.Select('.btn-tutor-next');
            this._ButtonStop = this.Select('.btn-tutor-stop');
            this._ButtonNextTextDefault = "Далeе →";

            this.Options = null;
        },
        Methods: function () {
            this.ElemCssRestore = function () {
                let Element = this._DataTutor[this.TutorPosition-1].obj;
                if (Element.tagName.toLowerCase() !== 'tr')
                {
                    Element.style.zIndex = '';
                    Element.style.position = '';
                    Element.style.outline = '';
                    Element.style.display = '';
                    Element.style.backgroundColor = '';
                    return;
                }
                let nElements = Element.querySelectorAll('th, td');
                nElements.forEach(function (elem) {
                    elem.style.position = '';
                    elem.style.zIndex = '';
                });
            };
            this.ElemCssSet = function (Element) {
                if (Element.tagName.toLowerCase() !== 'tr')
                {
                    //Element.style.zIndex = '11';
                    //Element.style.outline = '5px #bee0ff solid';
                    for (let o in this.Options.Frame){
                        if (this.Options.Frame.hasOwnProperty(o) && o !== 'backgroundColor'){
                            Element.style[o] = this.Options.Frame[o];
                        }
                    }
                    let style = window.getComputedStyle(Element);
                    if (style.position !== 'absolute' && style.position !== 'relative' && style.position !== 'fixed')
                        Element.style.position = 'relative';
                    if (style.backgroundColor === this._ColorTransparent)
                        Element.style.backgroundColor = this.Options.Frame.backgroundColor;
                    if (!Lure.isVisible(Element) )
                    {
                        if (Element.tagName.toLowerCase() !== "table" )
                            Element.style.display = 'block';
                        else
                            Element.style.display = 'table';
                    }
                    /* if (Element.length > 1)
                     Element.eq(1).css({zIndex: '', outline: ''});*/
                    return;
                }
                let nElements = Lure.SelectAll('th, td', Element);// Element.querySelectorAll('th, td');
                for (let i = 0; i < nElements.length; i++){
                    nElements[i].style.zIndex = this.Options.Frame.zIndex;
                    nElements[i].style.position = "relative";
                    let style = window.getComputedStyle(nElements[i]);
                    if (style.backgroundColor === this._ColorTransparent){
                        nElements[i].style.backgroundColor = this.Options.Frame.backgroundColor;
                    }
                }
            };
            this.SetOptions = function (Options) {
                this.Options = Lure.Clone(Lure.Settings.Tutor.Options);
                if (!Options)
                    return;
                if (Options.Frame){
                    for (let o in Options.Frame){
                        if (Options.Frame.hasOwnProperty(o)){
                            this.Options.Frame[o] = Options.Frame[o];
                        }
                    }
                }
            };
            this.Run = function (DOMElement, Options) {
                this.SetOptions(Options);
                this.TargetContent = Lure.Select(DOMElement);
                this.TutorPosition = 0;
                //this._ButtonStop.style.opacity = '';
                this._ButtonStop.style.display = '';
                this.State.ButtonNextCaption = this._ButtonNextTextDefault;
                console.log("tutor run");
                if (this.TargetContent === null)
                    return;
                let Items = this.TargetContent.querySelectorAll('*[data-tutor]:not([data-line]), *[data-tutor][data-line="0"]');
                //let Items = this.TargetContent.querySelectorAll('*[data-tutor]:not(.l-t-line), *.l-t-line[data-tutor][data-line="0"]');
                if (Items.length < 1){
                    Lure.Confirm("Сообщение", "На этом экране нет подсказок");
                    return;
                }
                this._DataTutor = [];
                for (let i = 0; i < Items.length; i++){
                    let item = Items[i];
                    this._DataTutor.push({
                        obj: item,
                        desc: item.dataset['tutor']
                    })
                }
                this.Proto.Data.Step = 1;
                this.Proto.Data.StepCount = this._DataTutor.length;
                //this.Content.style.display = '';

                //this._TutorBG.style.display = '';
                this.GoStep();
                this._TutorBG.style.display = '';
                this.Show();
            };
            this.GoStep = function () {
                //restore prev element's css
                if (this.TutorPosition > 0)
                    this.ElemCssRestore();
                if (this.TutorPosition === this._DataTutor.length)
                {
                    this.Stop();
                    return;
                }
                //select next elem
                let Element = this._DataTutor[this.TutorPosition].obj;
                let ElementDesc = this._DataTutor[this.TutorPosition].desc;
                // check for invisible parent
                let ElemParent = ElementDesc.match(/{([\s\S]+)}/);
                if (ElemParent !== null)
                {
                    ElemParent = ElemParent[1];
                    ElementDesc = ElementDesc.replace(/{([\s\S]+)}/, '');
                    Element = Element.closest(ElemParent);
                    this._DataTutor[this.TutorPosition].obj = Element;
                    //Element.push( );
                }
                //set element visible
                this.ElemCssSet(Element);

                //caption next button
                if ((this.TutorPosition+1) === this._DataTutor.length)
                {
                    this.State.ButtonNextCaption = 'Завершить';
                    //this._ButtonNext.innerHTML = 'Завершить';
                    this._ButtonStop.style.display = 'none';
                }

                //move tutor desc box
                let TutorWidth = this.Content.clientWidth > 0 ? this.Content.clientWidth: 340;  //css
                let TutorHeight = this.Content.clientHeight > 0 ? this.Content.clientHeight : 150; //min-height
                let posX = Element.offsetLeft + Element.clientWidth + 10;
                let posY = Element.offsetTop - TutorHeight - 10;
                if (posY < 10)
                    posY = 10;
                if ( (posX + TutorWidth) > window.innerWidth )
                {
                    posX = Element.offsetLeft - TutorWidth - 10;
                    if (window.innerWidth < TutorWidth + Element.clientWidth)
                    {
                        posX = Element.offsetLeft + Element.clientWidth - TutorWidth - 20;
                    }

                }
                if (document.documentElement.scrollTop  > posY || document.documentElement.scrollTop + window.innerHeight < Element.offsetTop + Element.offsetHeight)
                {
                    //$('html, body').animate({scrollTop: posY - 10}, 300);
                    document.documentElement.scrollTop =  (posY - 10);//  +'px';
                }
                if (posX < 10)
                    posX = 10;
                this.Content.style.left = posX +'px';
                this.Content.style.top = posY +'px';

                if (this.TargetContent !== document.body)
                    this.TargetContent.parentElement.appendChild(this._TutorBG);
                else
                    this.Content.appendChild(this._TutorBG);
                this.TutorPosition++;
                this.Proto.Data.Step = this.TutorPosition;
                this.Proto.Data.Description = ElementDesc;
                this.Proto.Refresh();
            };
            this.Stop = function () {
                this._Hider();
                this._TutorBG.style.display = 'none';
                this.ElemCssRestore();
            };
            this._GetTransparentColor = function () {
                let temp = document.createElement('div');
                temp.style.display = 'none';
                document.body.appendChild(temp);
                this._ColorTransparent = window.getComputedStyle(temp).backgroundColor;
                temp.remove();
            };
        },
        AfterBuild: function () {
            this._GetTransparentColor();
            //this._TutorBG.style.display = 'none';
            this._ButtonNext.onclick = this.GoStep;
            this._ButtonStop.onclick = this.Stop;
        }
    });
    return function (DOMElement, Options) {
        tt.Run(DOMElement, Options);
    }
})();

Lure.Settings.Tutor = {
    Options: {
        Frame: {
            zIndex: '11',
            outline:  '5px #bee0ff solid',
            backgroundColor: "#fff",
        },
    }
};
Lure.Route = {
    Lock: false,       // _
    LockParent: false, //lock hash changing if Shows target's content's parents
    _Enabled: false,
    /**
     * @returns {boolean}
     */
    get Enabled(){
        return this._Enabled;
    },
    set Enabled(val){
        this._Enabled = val;
        if (val)
            window.addEventListener('popstate', Lure.Route.Run);
        else
            window.removeEventListener('popstate', Lure.Route.Run);

    },

    _PopState: false,

    Init(){
        /*for (let i = 0; i < Lure._Content.List.length; i++){
            let SubContents = Lure._Content.List[i].GetSubContentList();
            if (SubContents.length < 1){
                history.pushState({ContentID: this.ID, Param: ''}, Lure._Content.List[i].Name, `?${Lure._Content.List[i].Name}`);
            }
        }*/
    },
    Push(LureContent){
        if (Lure.Route._PopState){
            Lure.Route._PopState = false;
            return;
        }
        Lure.Route.CurrentContent = LureContent;
        let Route = Lure.Route._GetRoute(LureContent);
        let Param = LureContent._RouteParam !== null ? LureContent._RouteParam : '';
        history.pushState({ContentID: LureContent.ID, Param: Param}, LureContent.Name, `#${Route}/${Param !== '' ? `${Param}`:''}`);

    },
    _GetRoute(LureContent){
        let Route = LureContent.Name;
        let Parent = LureContent.Parent;
        while(Parent){
            Route = Parent.Name + '/' + Route;
            Parent = Parent.Parent;
        }
        return Route;
    },
    Back(){
        if (Lure.Route.Enabled){
            history.back();
        }
    }
};



Lure.Route.Run = (e)=>{
    Lure.Route._PopState = true;
    //onback
    //let PrevContent = history.state ? Lure._Content.List.Where(x=>x.ID===history.state.ContentID).FirstOrDefault() : null;
    //let RouteString = window.location.hash.split('#')[1];
    let RouteString = location.href.replace(location.origin+location.pathname, '').substring(1);
    return Lure.Route.GoTo(RouteString);
};
Lure.Route.GoTo = (routeString)=>{
    //return
    if (!routeString || Lure.Route.Lock || !Lure.Application.isRun)
        return 0;
    console.log(`%c[Route]  ${routeString}`, "color: green;");
    //let RgxParam = new RegExp(`\\/([\\d\\w]*)$`);
    //let hash = window.location.hash.split('#')[1];

    //let Route = hash.split('/');
    let Route = routeString.split('/');
    let pp = Route.Last();
    Route.splice(Route.length-1, 1);
    let f = new Function(`return ${Route.join('.')}`);
    let Content = f();
    if (Content) {
        // if (Lure.Route.CurrentContent && Lure.Route.CurrentContent !== Content && !Lure.Route.CurrentContent.isAncestor(Content))
        //     Lure.Route.CurrentContent.Hide();
        Content.Route(pp);
        Lure.Route.CurrentContent = Content;
    }
    return 1;
};
/*
document.addEventListener("DOMContentLoaded", function() {
    if (Lure.Route.Enabled)
        Lure.Route.Run();
});*/
/*
window.onpopstate = function(event) {
    Lure.Route.GoTo(event.state);
    console.log("location: " + location.href + ", state: " + JSON.stringify(event.state));
};*/
//history.pushState({page: 1}, "title 1", "?page=1");
//history.pushState({page: 2}, "title 2", "?page=2");
Lure.Settings.Route = {
    Auto: true,        //if true: any Lure.Content will be mapped, except which got Route=false/null/undefined parameter
};
if (!Lure._Core)
    Lure._Core = {};

Lure._Core.Chart = {};
Lure._Core.Chart.Intitializer = {
    isGraph: function(Type){
        return Lure._Core.Chart.Intitializer.Type.Graph.indexOf(Type.toLowerCase()) > -1
    },
    isDraw: function(Type){
        return Lure._Core.Chart.Intitializer.Type.Draw.indexOf(Type.toLowerCase()) > -1
    },
    Type: {
        Graph: ['line', 'bar'],
        Draw: ['pie', 'ring'],
    },
    Default:{
        Color: ['red', 'green', 'cornflowerblue', 'purple', 'palevioletred', 'orange', 'tomato', 'darkblue', 'cadetblue', 'crimson'],
        R: {
            Target: '',
            Type: 'line',
            Title: '',
            Animation: {
                Bar: 'l-animate-svg-bar', //'' or false for disable
                Line: 'l-animate-svg-line',
                Marker: 'l-animate-svg-mark',
                Pie: 'l-animate-svg-pie',
                Ring: 'l-animate-svg-ring',
            },
            Legend: {
                Position: 'top',
                Visible: true,
            },
            Grid: {
                Visible: true,
            },
            AxisX:{
                Data: [],
                Format: null,
                Rotation: 'auto',
                Skip: 'auto',
                Step: 'auto',

                Position: 'bottom',
                Visible: true,

            },
            AxisY: {
                Position: 'left',
                Min:  'auto', //0
                Max:  'auto', //max-value
                Step: 'auto',
                Visible: true,
            },
            Tooltip: {
                Format: null, /*(Tip)=>{return `<div>Name: ${Tip.Episode.Name}</div><div>Value: ${p.Value}</div>`},*/ // p {Name,Value,x,y,Episode}
                FormatGraph: function (Tip) {
                    return `<div class="tip">
                              <div class="tip-bg"></div>
                              <div class="tip-value">
                                <div class="l-row">
                                  <div class="tip-icon" style="background-color: ${Tip.Episode.Color}"></div>
                                  <div class="tip-label">${Tip.ValueX}</div>
                                </div>
                                <div class="l-row">${Tip.Episode.Name}: ${Tip.Value}</div>
                              </div>
                            </div>`
                },
                FormatDraws: function (Tip) {
                    let Percent = Tip.Value/Tip.Episode.Sum*100;
                    if (isNaN(Percent)){
                        Percent = 0;
                    }
                    if (Percent > 1)
                        Percent = Math.round(Percent);
                    else
                        Percent = Math.round(Percent*100)/100;
                    return `<div class="tip">
                              <div class="tip-bg"></div>
                              <div class="tip-value">
                                <div class="l-row l-flexa-center">
                                  <div class="tip-icon" style="background-color: ${Tip.Color}"></div>
                                  <div class="tip-label">${Tip.Name}: ${Tip.Value} (${Percent}%)</div>
                                </div>
                              </div>
                            </div>`
                },
                Template: '<div>Name: {{Name}}</div><div>Value: {{Value}}</div>',
                Visible: true,
                Duration: 200,
                Timeout: 700,


                Tip: {
                    Left:0,
                    Top:0,
                    Color: '#000',
                },//private
                //MultiValues: false
            },
            SeriesSample:{
                Type: 'line',
                Data: [],
                Name: '',      //ex.: Speed limit
                Title: '',     //ex.: km/h
                Visible: true,
                //Enabled: true,

                Format: null,

                AxisX: {
                    Start: 'auto',
                    End: 'auto',
                    Step: 'auto',
                    Skip: null,
                    //Skip: 30,
                    //Skip: (value)=>{return value},
                    Linear: true, // false if Skip is a function

                },
                AxisY:{
                    Position: 'left',
                    Min:  'auto',
                    Max:  'auto',
                    Step: 'auto',
                    Visible: false,
                },

                Marker: {
                    Radius: 'auto',
                    Shape: 'circle',
                    Visible: true,
                },

                Width: 2,
                /* Draw */
                Labels: {
                    Data: [],
                    Format: null, // Format(Name, Value, Episode, j)
                    Visible: true,
                },

            },
            SeriesOptions: {
                Colors: ['red', 'green', 'cornflowerblue', 'purple', 'palevioletred', 'orange', 'tomato', 'darkblue', 'cadetblue', 'crimson'],
                _Bar:{
                    Stack: false,
                    Gradient: true,

                    _Count: 0,
                },
                BarStack:    false,
                BarGradient: true,

                PieStack:  false,
                PieType:   'pie',
                StartAngle: 0,
                Width: 2,
                Marker: {
                    Radius: 'auto',
                    Shape: 'circle',
                    Visible: true,
                }
            },
            Height: 400,
            Width: 600,
            Responsible: true,
        }
    },
    RAnimation: function(R){
        if (R.Animation){
            R.Animation.Bar    = R.Animation.Bar    !== void 0 ? R.Animation.Bar    : Lure._Core.Chart.Intitializer.Default.R.Animation.Bar;
            R.Animation.Line   = R.Animation.Line   !== void 0 ? R.Animation.Line   : Lure._Core.Chart.Intitializer.Default.R.Animation.Line;
            R.Animation.Marker = R.Animation.Marker !== void 0 ? R.Animation.Marker : Lure._Core.Chart.Intitializer.Default.R.Animation.Marker;
            R.Animation.Pie    = R.Animation.Pie    !== void 0 ? R.Animation.Pie    : Lure._Core.Chart.Intitializer.Default.R.Animation.Pie;
            R.Animation.Ring   = R.Animation.Ring   !== void 0 ? R.Animation.Ring   : Lure._Core.Chart.Intitializer.Default.R.Animation.Ring;
        } else{
            if (R.Animation === void 0)
                R.Animation = Lure.Object.Clone(Lure._Core.Chart.Intitializer.Default.R.Animation);
            else
                R.Animation = {
                    Bar: '',
                    Line: '',
                    Marker: '',
                    Pie: '',
                    Ring: '',
                };
        }
    },
    RLegend: function(R){
        if (R.Legend){
            R.Legend.Position = R.Legend.Position !== void 0 ? R.Legend.Position : Lure._Core.Chart.Intitializer.Default.R.Legend.Position;
            R.Legend.Visible  = R.Legend.Visible  !== void 0 ? R.Legend.Visible :  Lure._Core.Chart.Intitializer.Default.R.Legend.Visible;
        }
        else {
            R.Legend = Lure.Object.Clone(Lure._Core.Chart.Intitializer.Default.R.Legend);
        }
    },
    RLabels: function(R){
        if (R.Labels){
            R.Labels.Rotation = R.Labels.Rotation !== void 0 ? R.Labels.Rotation : Lure._Core.Chart.Intitializer.Default.R.Labels.Rotation;
            R.Labels.Visible  = R.Labels.Visible  !== void 0 ? R.Labels.Data     : Lure._Core.Chart.Intitializer.Default.R.Labels.Visible;
            R.Labels.Data     = R.Labels.Data     !== void 0 ? R.Labels.Data     : Lure._Core.Chart.Intitializer.Default.R.Labels.Data;
            R.Labels.Format   = R.Labels.Format     !== void 0 ? R.Labels.Format : Lure._Core.Chart.Intitializer.Default.R.Labels.Format;
        }
        else {
            R.Labels = Lure.Object.Clone(Lure._Core.Chart.Intitializer.Default.R.Labels);
        }
    },
    RGrid: function(R){
        if (R.Grid){
            R.Grid.Visible  = R.Grid.Visible  !== void 0 ? R.Grid.Visible : Lure._Core.Chart.Intitializer.Default.R.Grid.Visible;
            R.Grid.Html = '';
        }
        else {
            R.Grid = Lure.Object.Clone(Lure._Core.Chart.Intitializer.Default.R.Grid);
        }
    },
    RAxisX: function(R){
        if (R.AxisX){
            R.AxisX.Visible  = R.AxisX.Visible  !== void 0 ? R.AxisX.Visible  : Lure._Core.Chart.Intitializer.Default.R.AxisX.Visible;
            R.AxisX.Position = R.AxisX.Position !== void 0 ? R.AxisX.Position : Lure._Core.Chart.Intitializer.Default.R.AxisX.Position;
            R.AxisX.Rotation = R.AxisX.Rotation !== void 0 ? R.AxisX.Rotation : Lure._Core.Chart.Intitializer.Default.R.AxisX.Rotation;
            R.AxisX.Data     = R.AxisX.Data     !== void 0 ? R.AxisX.Data     : Lure._Core.Chart.Intitializer.Default.R.AxisX.Data;
            R.AxisX.Format   = R.AxisX.Format   !== void 0 ? R.AxisX.Format   : Lure._Core.Chart.Intitializer.Default.R.AxisX.Format;
            R.AxisX.Skip     = R.AxisX.Skip     !== void 0 ? R.AxisX.Skip     : Lure._Core.Chart.Intitializer.Default.R.AxisX.Skip;
            R.AxisX.Step     = R.AxisX.Step     !== void 0 ? R.AxisX.Step     : Lure._Core.Chart.Intitializer.Default.R.AxisX.Step;

            R.AxisX.Linear   = typeof R.AxisX.Skip !== 'function';
        }
        else {
            R.AxisX = Lure.Object.Clone(Lure._Core.Chart.Intitializer.Default.R.AxisX);
        }
    },
    RAxisY: function(R){
        if (R.AxisY){
            R.AxisY.Visible  = R.AxisY.Visible  !== void 0 ? R.AxisY.Visible  : Lure._Core.Chart.Intitializer.Default.R.AxisY.Visible;
            R.AxisY.Position = R.AxisY.Position !== void 0 ? R.AxisY.Position : Lure._Core.Chart.Intitializer.Default.R.AxisY.Position;

            R.AxisY.Min  = R.AxisY.Min  !== void 0 ? R.AxisY.Min  : Lure._Core.Chart.Intitializer.Default.R.AxisY.Min;
            R.AxisY.Max  = R.AxisY.Max  !== void 0 ? R.AxisY.Max  : Lure._Core.Chart.Intitializer.Default.R.AxisY.Max;
            R.AxisY.Step = R.AxisY.Step !== void 0 ? R.AxisY.Step : Lure._Core.Chart.Intitializer.Default.R.AxisY.Step;

            // set font by css instead
            // R.AxisY.Font        = R.AxisY.Font        !== void 0 ? R.AxisY.Font        : Lure._Core.Chart.Intitializer.Default.R.AxisY.Font;
            // R.AxisY.Font.Family = R.AxisY.Font.Family !== void 0 ? R.AxisY.Font.Family : Lure._Core.Chart.Intitializer.Default.R.AxisY.Font.Family;
            // R.AxisY.Font.Size   = R.AxisY.Font.Size   !== void 0 ? R.AxisY.Font.Size   : Lure._Core.Chart.Intitializer.Default.R.AxisY.Font.Size;
        }
        else {

            R.AxisY = Lure.Object.Clone(Lure._Core.Chart.Intitializer.Default.R.AxisY);
        }
    },

    RTooltip: function(R){
        if (R.Tooltip){
            R.Tooltip.Visible  = R.Tooltip.Visible   !== void 0 ? R.Tooltip.Visible  : Lure._Core.Chart.Intitializer.Default.R.Tooltip.Visible;
            R.Tooltip.Template = R.Tooltip.Template  !== void 0 ? R.Tooltip.Template : Lure._Core.Chart.Intitializer.Default.R.Tooltip.Template;
            R.Tooltip.Format   = R.Tooltip.Format    !== void 0 ? R.Tooltip.Format   : Lure._Core.Chart.Intitializer.Default.R.Tooltip.Format;
            R.Tooltip.Timeout  = R.Tooltip.Timeout   !== void 0 ? R.Tooltip.Timeout  : Lure._Core.Chart.Intitializer.Default.R.Tooltip.Timeout;
            R.Tooltip.Duration = R.Tooltip.Duration  !== void 0 ? R.Tooltip.Duration : Lure._Core.Chart.Intitializer.Default.R.Tooltip.Duration;
            R.Tooltip.Tip = {};
        }
        else {
            R.Tooltip = Lure.Object.Clone(Lure._Core.Chart.Intitializer.Default.R.Tooltip);
        }
    },
    RSeries: function(R){},
    RSeriesOptions: function(R){
        if (R.SeriesOptions){
            R.SeriesOptions.Colors    = R.SeriesOptions.Colors    !== void 0 ? R.SeriesOptions.Colors    : Lure._Core.Chart.Intitializer.Default.R.SeriesOptions.Colors;

            R.SeriesOptions.BarStack    = R.SeriesOptions.BarStack    !== void 0 ? R.SeriesOptions.BarStack    : Lure._Core.Chart.Intitializer.Default.R.SeriesOptions.BarStack;
            R.SeriesOptions.BarGradient = R.SeriesOptions.BarGradient !== void 0 ? R.SeriesOptions.BarGradient : Lure._Core.Chart.Intitializer.Default.R.SeriesOptions.BarGradient;
            R.SeriesOptions.PieStack    = R.SeriesOptions.PieStack    !== void 0 ? R.SeriesOptions.PieStack    : Lure._Core.Chart.Intitializer.Default.R.SeriesOptions.PieStack;
            R.SeriesOptions.PieType     = R.SeriesOptions.PieType     !== void 0 ? R.SeriesOptions.PieType     : Lure._Core.Chart.Intitializer.Default.R.SeriesOptions.PieType;
            R.SeriesOptions.StartAngle  = R.SeriesOptions.StartAngle  !== void 0 ? R.SeriesOptions.StartAngle  : Lure._Core.Chart.Intitializer.Default.R.SeriesOptions.StartAngle;

            R.SeriesOptions.Width          = R.SeriesOptions.Width         !== void 0 ? R.SeriesOptions.Width         : Lure._Core.Chart.Intitializer.Default.R.SeriesOptions.Width;
            R.SeriesOptions.Marker         = R.SeriesOptions.Marker         !== void 0 ? R.SeriesOptions.Marker         : Lure._Core.Chart.Intitializer.Default.R.SeriesOptions.Marker;
            R.SeriesOptions.Marker.Visible = R.SeriesOptions.Marker.Visible !== void 0 ? R.SeriesOptions.Marker.Visible : Lure._Core.Chart.Intitializer.Default.R.SeriesOptions.Marker.Visible;
            R.SeriesOptions.Marker.Radius  = R.SeriesOptions.Marker.Radius  !== void 0 ? R.SeriesOptions.Marker.Radius  : Lure._Core.Chart.Intitializer.Default.R.SeriesOptions.Marker.Radius;
            R.SeriesOptions.Marker.Shape   = R.SeriesOptions.Marker.Shape   !== void 0 ? R.SeriesOptions.Marker.Shape   : Lure._Core.Chart.Intitializer.Default.R.SeriesOptions.Marker.Shape;


        }else{
            R.SeriesOptions = Lure.Object.Clone(Lure._Core.Chart.Intitializer.Default.R.SeriesOptions);
        }
    },



    /*###*/
    GetSeries(R){
        let Series = R.Series;
        let SeriesList = [];

        for (let i = 0; i < Series.length; i++){
            //let Episode = Series[i];
            let Ep = Series[i];
            //let Ep = Lure.Clone(Series[i]);

            Ep.Line = i;
            //Ep.Data = Lure.Clone(Episode.Data);

            Ep.Type  = Ep.Type  !== void 0 ? Ep.Type.toLowerCase() : R.Type;
            Ep.Name  = Ep.Name  !== void 0 ? Ep.Name               : '';
            Ep.Title = Ep.Title !== void 0 ? Ep.Title              : '';

            Ep.Color = Ep.Color !== void 0 ? Ep.Color : R.SeriesOptions.Colors[i];
            Ep.Color = Ep.Color      !== void 0 ? Ep.Color : '#000';

            Ep.Width = Ep.Width !== void 0 ? Ep.Width : R.SeriesOptions.Width;

            Ep.Visible = Ep.Visible !== void 0 ? Ep.Visible : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.Visible;

            Ep.Format = Ep.Format !== void 0 ? Ep.Format : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.Format;

            Ep.AxisX          = Ep.AxisX          !== void 0 ? Ep.AxisX       : Lure.Object.Clone(Lure._Core.Chart.Intitializer.Default.R.SeriesSample.AxisX);
            Ep.AxisX.Data     = Ep.AxisX.Data     !== void 0 ? Ep.AxisX.Data  : R.AxisX.Data;
            Ep.AxisX.Start    = Ep.AxisX.Start    !== void 0 ? Ep.AxisX.Start : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.AxisX.Start;
            Ep.AxisX.End      = Ep.AxisX.End      !== void 0 ? Ep.AxisX.End   : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.AxisX.End;




            Ep.AxisY          = Ep.AxisY          !== void 0 ? Ep.AxisY          : Lure.Object.Clone(Lure._Core.Chart.Intitializer.Default.R.SeriesSample.AxisY);
            //if Ep.AxisY is exists - visible by default
            Ep.AxisY.Visible  = Ep.AxisY.Visible  !== void 0 ? Ep.AxisY.Visible  :
                Ep.AxisY  !== void 0 ? true : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.AxisY.Visible;
            Ep.AxisY.Position = Ep.AxisY.Position !== void 0 ? Ep.AxisY.Position : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.AxisY.Position;

            Ep.AxisY.Min  = Ep.AxisY.Min  !== void 0 ? Ep.AxisY.Min  : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.AxisY.Min;
            Ep.AxisY.Max  = Ep.AxisY.Max  !== void 0 ? Ep.AxisY.Max  : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.AxisY.Max;
            Ep.AxisY.Step = Ep.AxisY.Step !== void 0 ? Ep.AxisY.Step : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.AxisY.Step;


            Ep.Marker         = Ep.Marker         !== void 0 ? Ep.Marker         : Lure.Object.Clone(R.SeriesOptions.Marker);
            Ep.Marker.Visible = Ep.Marker.Visible !== void 0 ? Ep.Marker.Visible : R.SeriesOptions.Marker.Visible;
            Ep.Marker.Shape   = Ep.Marker.Shape   !== void 0 ? Ep.Marker.Shape   : R.SeriesOptions.Marker.Shape;
            Ep.Marker.Radius  = Ep.Marker.Radius  !== void 0 ? Ep.Marker.Radius  : R.SeriesOptions.Marker.Radius;
            Ep.Marker.Radius  = Ep.Marker.Radius       !== 'auto' ? Ep.Marker.Radius       : (4 + Ep.Width/4);





            if (Lure._Core.Chart.Intitializer.Type.Draw.indexOf(Ep.Type) > -1){
                Ep.Colors     = Ep.Colors     ? Ep.Colors     : Lure._Core.Chart.Intitializer.Default.Color;
                Ep.Width      = Ep.Width      ? Ep.Width      : 30;
                Ep.AngleStart = Ep.AngleStart ? Ep.AngleStart : 0;
                Ep.Margin     = Ep.Margin     ? Ep.Margin     : 0;

                Ep.Labels         = Ep.Labels         !== void 0 ? Ep.Labels         : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.Labels;
                Ep.Labels.Visible = Ep.Labels.Visible !== void 0 ? Ep.Labels.Visible : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.Labels.Visible;
                Ep.Labels.Data    = Ep.Labels.Data    !== void 0 ? Ep.Labels.Data    : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.Labels.Data;
                Ep.Labels.Format  = Ep.Labels.Format  !== void 0 ? Ep.Labels.Format  : Lure._Core.Chart.Intitializer.Default.R.SeriesSample.Labels.Format;

                Ep.Visibles = Ep.Visibles !== void 0 ? Ep.Visibles : Ep.Data.Select(()=>true);


            }

            SeriesList.push(Ep);
        }
        return SeriesList;

    },

    InitR: function (R) {

        R.Name   = R.Name   !== void 0 ? R.Name   : '';
        R.Title  = R.Title  !== void 0 ? R.Title  : '';
        R.Type   = R.Type   !== void 0 ? R.Type.toLowerCase()  : 'line';
        R.Height = R.Height !== void 0 ? R.Height : 'auto';
        R.Width  = R.Width  !== void 0 ? R.Width  : 'auto';

        R.Responsible = R.Responsible  !== void 0 ? R.Responsible  : true;

        Lure._Core.Chart.Intitializer.RAnimation(R);
        Lure._Core.Chart.Intitializer.RLegend(R);
        //Lure._Core.Chart.Intitializer.RLabels(R);
        Lure._Core.Chart.Intitializer.RGrid(R);
        Lure._Core.Chart.Intitializer.RAxisX(R);
        Lure._Core.Chart.Intitializer.RAxisY(R);
        Lure._Core.Chart.Intitializer.RTooltip(R);
        Lure._Core.Chart.Intitializer.RSeriesOptions(R);

        R.DrawAfterInit = R.DrawAfterInit !== void 0 ? R.DrawAfterInit : true;

        this.Options = R;
        this.Options.Series = Lure._Core.Chart.Intitializer.GetSeries(R);
        //FIXME IS IT OK PLACE FOR SVG.HTML?
        this.Options.Svg = {
            Html: '',
            Height: 0,
        };
        this.Options.AxisX.Html      = '';
        this.Options.AxisY.HtmlLeft  = '';
        this.Options.AxisY.HtmlRight = '';
        this.Options.Grid.Html       = '';
        this.Options.Legend.Html     = '';
        this.Options.Tooltip.Html    = '';
        //this.Options.Tooltip.Tip     = {};
        this.isGraph = this.Options.Series.Where(s=>s.Type.toLowerCase() !== 'line' && s.Type.toLowerCase() !== 'bar').length === 0;

        this.Options._Series = {
            Line: {
                Count: 0,
                CountPrepared: 0
            },
            Bar: {
                Count: this.Options.Series.Where(s=>s.Type === 'bar').length,
                CountPrepared: 0
            },
            Pie: {
                Count: this.Options.Series.Where(s=>s.Type === 'bar').length,
                CountPrepared: 0
            },
            Ring: {
                Count: this.Options.Series.Where(s=>s.Type === 'ring').length,
                CountPrepared: 0
            }
        }


    }
};
Lure._Core.Chart.BChartContent = class{


    GetEpisodeWidthRange(Episode, Width){
        let XData = Episode.AxisX.Data;
        let Type = Lure.GetType(Episode.AxisX.Data[0]);

        let Start = 0;
        let End   = Width;

        if (Type === 'date'){
            XData = XData.Select(x=>x.valueOf());
        }


        if (Episode.AxisX.Start !== 'auto' && (Type === 'number' || Type === 'date') ){
            let S = Type !== 'date'  ? Episode.AxisX.Start : Episode.AxisX.Start.valueOf();
            let pos = XData.indexOf(S);
            if (pos > -1)
                Start = Width * pos / Episode.AxisX.Data.length
        }
        if (Episode.AxisX.End !== 'auto' && (Type === 'number' || Type === 'date')){
            let E = Type !== 'date' ? Episode.AxisX.Start : Episode.AxisX.End.valueOf();
            let pos = XData.indexOf(E);
            if (pos > -1)
                End = Width * pos / Episode.AxisX.Data.length;//Episode.Data.length;
        }
        let EpisodeWidth = End - Start;
        return {
            Start: Start,
            EpisodeWidth: EpisodeWidth
        };
    }
    GetValuesY(Episode, Scale, DefaultScale, Height) {
        let Ys = [];
        let MaxValue = DefaultScale.Values.Last();  //Math.max.apply(null, DefaultScale.Values);
        let MinValue = DefaultScale.Values.First(); //Math.min.apply(null, DefaultScale.Values);
        MaxValue = Scale === null ? MaxValue : Scale.Values.Last();
        MinValue = Scale === null ? MinValue : Scale.Values.First();
        for (let j= 0; j < Episode.Data.length; j++){
            Ys.push( Height - (  (Episode.Data[j] - MinValue) * Height/(MaxValue-MinValue) )  );
        }
        return Ys;
    }
    GetValuesX(Episode, Width) {
        if (Episode.Data.length <= 1)
            return [0];
            //return [EpisodeWidth/2];
        let w = this.GetEpisodeWidthRange(Episode, Width - 2*this.Options._Series.Padding);
        let EpisodeWidth = w.EpisodeWidth;
        let stepX = EpisodeWidth / (Episode.Data.length-1);


        return Episode.Data.Select((x, i)=> w.Start + i*stepX);
    }
    GetPoints(X, Y) {
        let Points = [];
        for (let i = 0; i < Y.length; i++){
            Points.push([X[i] + this.Options._Series.Padding, Y[i]]);
        }
        return Points;
    }





    GetContent(){
        let HTMLLegend = `<div class="legend"></div>`;
        //let isGraph = this instanceof Lure._Core.Chart.ChartContentGraph;
        return Lure.CreateElementFromString(`<div class="l-chart l-col">
                        <table class="l-chart-t">
                            <tr class="hook-top">
                                <td colspan="5" class="td-hook-top">
                                    <div class="chart-name"></div>
                                    ${this.Options.Legend.Visible && this.Options.Legend.Position==='top'? HTMLLegend:''}
                                </td>
                            </tr>
                            
                            <tr class="tr-hook-mid">
                                <td>${this.Options.Legend.Visible && this.Options.Legend.Position==='left'? HTMLLegend:''}</td> 
                                <td rowspan="1">
                                    <div class="hook-axis-y hook left"></div>
                                </td>
                                <td rowspan="1" class="hook-chart">
                                    <div class="chart-svg-wrapper"><svg class="chart-svg"></svg></div>
                                    <div class="chart-grid"></div>
                                    <div class="chart-tooltip"></div>
                                    <div class="v-stick"></div>
                                </td> 
                                <td rowspan="1">
                                    <div class="hook-axis-y hook right"></div>
                                </td> 
                                <td>${this.Options.Legend.Visible && this.Options.Legend.Position ==='right'? HTMLLegend:''}</td>
                            </tr>
                            
                            <tr class="tr-hook-axis-x">
                                <td colspan="1" class="td-hook-null"></td> 
                                <td colspan="1" class="td-hook-null"></td> 
                                <td colspan="1" class="hook-axis-x">
                                    <div class="axis-x"></div>
                                </td> 
                                <td colspan="1" class="td-hook-null"></td>
                                <td colspan="1" class="td-hook-null"></td>
                            </tr>
                            <tr class="tr-hook-bottom">
                                ${this.Options.Legend.Visible && this.Options.Legend.Position==='bottom'? HTMLLegend:''}
                            </tr>
                        </table>
                      </div>`);
    }
    GenContentProps(){}

    MakeLegend(){}

    OnLegendChange(e){
        let i = e.currentTarget.dataset['line'];
        let Episode = this.Options.Graph[i];
        Episode.Visible = e.currentTarget.checked;
        //console.log('changed', e.currentTarget, Episode);
        if (this.Options.Graph.Where(g=>g.Visible).length < 1){
            Episode.Visible = true;
            e.currentTarget.checked = true;
            return;
        }
        this.Refresh();
    }
    OnChartMouseMove(e){
        //console.log(`e.target.tagName ${e.target.tagName}`);
        if (e.target.tagName === 'path' || e.target.tagName === 'circle'){
            let i = e.target.dataset["line"];
            this.Options.Tooltip.Episode = this.Options.Graph[i];
        }
        if (!this.Options.Tooltip.Episode)
            return;

        let x = e.clientX - this.Options.Svg.Rect.left;
        let EpisodeNum = e.target.dataset['line'];
        let ValueNum = e.target.dataset['item'];
        let Tip = this.GetTip(x, EpisodeNum, ValueNum);
        this.Tooltip.Tip = Tip;

        //console.log(`e.pageX:${e.pageX}, e.clientX: ${e.clientX}`, e);
        this.StickV.style.left = Tip.x + 'px';
        this.Tooltip.Refresh();
    }
    OnChartMouseEnter(){
        this.Tooltip.Reset();
    }
    OnChartMouseLeave(){
        this.Tooltip.Close();

    }
    constructor(Chart){
        /* sys */
        this.ID = Lure.GetID();
        this.Chart = Chart;
        this.Options = Chart.Options;

        /* HTML */
        this.Content = this.GetContent();

        this.ChartName      = Lure.Select('.chart-name',        this.Content);
        this.HookChart      = Lure.Select('.hook-chart',        this.Content);
        this.ChartLegend    = Lure.Select('.legend',            this.Content);
        this.ChartSvg       = Lure.Select('.chart-svg',         this.Content);
        this.ChartTooltip   = Lure.Select('.chart-tooltip',     this.Content);

        this.GenContentProps();
        Chart.Target.appendChild(this.Content);

        /* EVENTS */
        Lure.AddEventListenerGlobal('change', '.legend-checkbox', this.OnLegendChange.bind(this), this.Content);
        this.Tooltip = {};
        if (this.Options.Tooltip.Visible){
            this.HookChart.addEventListener('mousemove',  this.OnChartMouseMove.bind(this));
            this.HookChart.addEventListener('mouseenter', this.OnChartMouseEnter.bind(this));
            this.HookChart.addEventListener('mouseleave', this.OnChartMouseLeave.bind(this));
            this.Tooltip = {
                Timer: null,
                Format: this.Options.Tooltip.Format,
                Hide: ()=>{
                    Lure.AsyncToggle(null, null, this.ChartTooltip, ()=>{},()=>{
                        this.ChartTooltip.style.display = 'none';
                    }, 'l-appear', 'l-disappear', 200, this.Tooltip.Timer)
                },
                Show: ()=>{
                    Lure.AsyncToggle(null, null, this.ChartTooltip, ()=>{
                        this.ChartTooltip.style.display = '';
                    },()=>{}, 'l-disappear', 'l-appear', 200, this.Tooltip.Timer)
                },
                Reset: () => {
                    if (this.Tooltip.Timer)
                        clearTimeout(this.Tooltip.Timer);
                },
                Close: () => {
                    clearTimeout(this.Tooltip.Timer);
                    this.Tooltip.Timer = setTimeout(()=>{
                        this.Tooltip.Hide();
                        this.Tooltip.Timer = null;
                        this.Options.Tooltip.Episode = null;
                    }, this.Options.Tooltip.Timeout);
                },
                Refresh: ()=> {
                    if (this.Tooltip.TipPrev === this.Tooltip.Tip)
                        return;
                    this.Options.Tooltip.TipPrev = this.Tooltip.Tip;
                    let Tip = this.Tooltip.Tip;

                    this.ChartTooltip.innerHTML = this.Tooltip.Format(Tip);

                    Tip.Width  = this.ChartTooltip.clientWidth;
                    Tip.Height = this.ChartTooltip.clientHeight;

                    Tip.Left = Tip.x - 30;
                    Tip.Top  = Tip.y - 20 - Tip.Height;

                    this.ChartTooltip.style.left = Tip.Left + 'px';
                    this.ChartTooltip.style.top  = Tip.Top + 'px';

                    if (Tip.Left + Tip.Width >= Tip.SvgWidth){
                        this.ChartTooltip.classList.add('reverse');
                        Tip.Left = Tip.x + 30 - Tip.Width;
                        this.ChartTooltip.style.left = Tip.Left + 'px';
                        this.ChartTooltip.style.top  = Tip.Top + 'px';
                    }else{
                        this.ChartTooltip.classList.remove('reverse');
                    }
                    this.Tooltip.Show();
                },
            };
        }



    }
};
/** @typedef {object} AxisXLabelItem
 * @property {Element} LabelItem
 * @property {Element} LabelItemText
 * */

Lure._Core.Chart.ChartContentGraph = class extends Lure._Core.Chart.BChartContent{

    GenContentProps(){
        this.ChartGrid      = Lure.Select('.chart-grid',        this.Content);
        this.AxisX          = Lure.Select('.axis-x',            this.Content);
        this.AxisYLeft      = Lure.Select('.hook-axis-y.left',  this.Content);
        this.AxisYRight     = Lure.Select('.hook-axis-y.right', this.Content);
        this.StickV         = Lure.Select('.v-stick',           this.Content);
    }

    GetPathLine(Points, Episode, line, Options={}) {
        const n = Points.length;

        let xs = [];        //x
        let ys = [];        //y
        let dys = [];       //dx
        let dxs = [];       //dy
        let ds = [];        //derivative
        let ms = [];        //desired slope (m) at each point using Fritsch-Carlson method
        for(let i = 0; i < n; i++) {
            xs[i] = Points[i][0];
            ys[i] = Points[i][1];
        }
        // Calculate deltas and derivative
        for(let i = 0; i < n - 1; i++) {
            dys[i] = ys[i + 1] - ys[i];
            dxs[i] = xs[i + 1] - xs[i];
            ds[i] = dys[i] / dxs[i];
        }
        // Determine desired slope (m) at each point using Fritsch-Carlson method
        // See: http://math.stackexchange.com/questions/45218/implementation-of-monotone-cubic-interpolation
        ms[0] = ds[0];
        ms[n - 1] = ds[n - 2];
        for(let i = 1; i < n - 1; i++) {
            if(ds[i] === 0 || ds[i - 1] === 0 || (ds[i - 1] > 0) !== (ds[i] > 0)) {
                ms[i] = 0;
            } else {
                ms[i] = 3 * (dxs[i - 1] + dxs[i]) / (
                    (2 * dxs[i] + dxs[i - 1]) / ds[i - 1] +
                    (dxs[i] + 2 * dxs[i - 1]) / ds[i]);
                if(!isFinite(ms[i])) {
                    ms[i] = 0;
                }
            }
        }
        let d = `M ${xs[0]},${ys[0]}`;
        let CSSAnimation = this.Options.Animation.Line;
        let CSSAnimationMark = this.Options.Animation.Marker;
        CSSAnimation = Options.Animation === false ? '':CSSAnimation;
        CSSAnimationMark = Options.Animation === false ? '':CSSAnimationMark;

       // CSSAnimation = Options.Animation === false ? '':CSSAnimation;
        let dots = '<g class="chart-markers">';
        for(let i = 0; i < n - 1; i++) {
            d += ` C ${xs[i] + dxs[i] / 3},${ys[i] + ms[i] * dxs[i] / 3} ${xs[i + 1] - dxs[i] / 3},${ys[i + 1] - ms[i + 1] * dxs[i] / 3} ${xs[i + 1]},${ys[i + 1]}`;
            if (Episode.Marker.Visible) {
                //dots += this.GetPathLineMarker(xs[i] , ys[i], line, i, Episode.Color, Episode.Marker.Radius );
                dots +=`<circle class="chart-marker ${CSSAnimationMark}" data-line="${line}" data-item="${i}" cx="${xs[i]}" cy="${ys[i]}" r="${Episode.Marker.Radius}" stroke="${Episode.Color}" stroke-width="2" fill="#fff" ></circle>`
            }
        }
        if (Episode.Marker.Visible)
            dots +=`<circle class="chart-marker" data-line="${line}" data-item="${n-1}" cx="${xs[n-1]}" cy="${ys[n-1]}" r="${Episode.Marker.Radius}" stroke="${Episode.Color}" stroke-width="2" fill="#fff" ></circle>`
            //dots += this.GetPathLineMarker(xs[n-1] , ys[n-1], line, n-1, Episode.Color, Episode.Marker.Radius );
        dots += '</g>';
        return `<g class="chart-episode"><path class="${CSSAnimation}" data-line="${line}" d="${d}" fill="none" stroke="${Episode.Color}" stroke-width="${Episode.Width}"></path> ${dots}</g>`;
    }
    GetPathLineMarker(x,y, i,j, color, width){
        return `<circle class="chart-marker" data-line="${i}" data-item="${j}" cx="${x}" cy="${y}" r="${width}" stroke="${color}" stroke-width="2" fill="#fff" ></circle>`
    }
    GetPathBar(Points, Episode, line, Options={}) {
        let BarCount = this.Options._Series.Bar.Count;
        let BarCountPrepared = this.Options._Series.Bar.CountPrepared;
        let deilmit = 1;
        if (!this.Options.SeriesOptions.BarStack)
            deilmit = BarCount * 0.8;
        //let wd = Episode.Width;//this.Width/this.Options.Labels.Data.length/2 / deilmit;        //Episode.Width;
        let wd = this.HookChart.clientWidth/this.Options.AxisX.Data.length/2 / deilmit;        //this.Options._Series.Bar.Width;//
        //let wd = Episode.Width;
        let height = this.HookChart.clientHeight;

        let margin = ((wd*1.2) * (BarCountPrepared)) - (  (wd*1.2) *BarCount /2 - (wd*1.2)/2) ;
        if (this.Options.SeriesOptions.BarStack)
            margin = 0;
        //console.log('margin',margin);
        //TODO BAR STACK
        // debugger;

        let CSSAnimation = this.Options.Animation.Bar;
        CSSAnimation = Options.Animation === false ? '':CSSAnimation;
        let bricks = `<g class="chart-episode" data-type="bar" data-line="${line}">`;
        let GradientId = '';
        if (this.Options.SeriesOptions.BarGradient){
            GradientId = `lc-gradient-${Lure.GetID()}`;
            bricks += `<linearGradient id="${GradientId}"  x1="0" y1="0%"><stop offset="0%" stop-color="rgba(0,0,0,0.2)"/><stop offset="33%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0.3)"/></linearGradient>`;
        }
        let dots = '';
        for (let i = 0; i < Points.length; i++){
            //let d =`M ${margin+Points[i][0]-wd/2} ${height} L ${(margin+Points[i][0]+wd/2)} ${height} ${(margin+Points[i][0]+wd/2)} ${Points[i][1]} ${margin+Points[i][0]-wd/2} ${Points[i][1]}Z`;
            // debugger;
            let ID = Lure.GetID();

            bricks += `<g class="lc-bar-elem"><rect class="chart-bar-elem ${CSSAnimation}" id="chart-b-${ID}" x="${margin+Points[i][0]-wd/2}" y="${Points[i][1]}" width="${wd}" height="${height-Points[i][1]}" fill="${Episode.Color}" data-line="${line}" data-item="${i}"></rect>`;
            if (this.Options.SeriesOptions.BarGradient)
            {
                bricks += `<rect class="lc-bar-elem-gradient ${CSSAnimation}" id="chart-bg-${ID}" x="${margin+Points[i][0]-wd/2}" y="${Points[i][1]}" width="${wd}" height="${height-Points[i][1]}" fill="url(#${GradientId})" data-line="${line}" data-item="${i}"></rect>`;
            }
            //bricks += `<animate id="first" href="#chart-b-${ID}"  attributeName="height" begin="0s" from="0" to="${height-Points[i][1]}" dur="1s"></animate>`;
            //bricks += `<animate  href="#chart-b-${ID}" fill="remove" attributeName="y" begin="0s" from="${height}" to="${Points[i][1]}" dur="400ms"></animate>`;
            //bricks += `<animate id="first${ID}" href="#chart-bg-${ID}" ill="freeze" attributeType="auto" attributeName="y" begin="0s" from="${height}" to="${Points[i][1]}" dur="400ms"></animate>`;
            bricks +='</g>';
        }
        bricks += dots+'</g>';
        this.Options._Series.Bar.CountPrepared++;
        return bricks;
    }
    GetPath(Type){
        switch (Type){
            case 'line':
                return this.GetPathLine.bind(this);
            case 'bar':
                return this.GetPathBar.bind(this);
            default:
                return this.GetPathLine.bind(this)
        }
    }
    /*content's*/
    GetSeries(){
        this.Options.Graph = this.Options.Series.Where(s=>Lure._Core.Chart.Intitializer.isGraph(s.Type));
    }
    ChartSvgInit(){
        this.ChartSvg.style.height = '1px';
        this.Options.Svg.Height = this.HookChart.clientHeight;
        this.ChartSvg.style.height = this.Options.Svg.Height + 'px';
        //this.AxisYLeft.style.height  = this.Options.Svg.Height+ 'px';
        //this.AxisYRight.style.height = this.Options.Svg.Height + 'px';

        //this.Options.Svg.Width = this.HookChart.clientWidth;
        //debugger
        this.Options._Series.Padding = 0;
        this.Options._Series.Bar.Count = this.Options.Series.Where(s=>s.Type==='bar').length;
        if (this.Options._Series.Bar.Count > 0){
            this.Options._Series.Bar.Delimit = 1;
            if (!this.Options.SeriesOptions.BarStack)
                this.Options._Series.Bar.Delimit = this.Options._Series.Bar.Count * 0.8;
            this.Options._Series.Bar.Width = this.HookChart.clientWidth/this.Options.AxisX.Data.length/2 / this.Options._Series.Bar.Delimit;
            if (this.Options._Series.Bar.Count === 1)
                this.Options._Series.Padding = this.Options._Series.Bar.Width /2;
            else
                this.Options._Series.Padding = (this.Options._Series.Bar.Width*1.2)/2 * (this.Options._Series.Bar.Count );
        }
        this.AxisX.style.paddingLeft  = this.Options._Series.Padding + 'px';
        this.AxisX.style.paddingRight = this.Options._Series.Padding + 'px';
        this.Options.Svg.Rect = this.HookChart.getBoundingClientRect();

        this.ChartGrid.classList.remove('no-right');
        if (this.Options.AxisY.HtmlRight !== '')
            this.ChartGrid.classList.add('no-right');

        if (this.Options.Name === ''){
            this.ChartName.style.display = 'none';
        }
        else {
            this.ChartName.style.display = '';
        }
        //this.Options.Tooltip.Episode = this.Options.Graph[0];
        //this.ChartSvg.style.height = this.HookChart.clientHeight+'px';
    }

    MakeLegend(){
        if (!this.Options.Legend.Visible)
            return;
        this.Options.Legend.Html = '';

        for (let i = 0; i < this.Options.Graph.length; i++){
            let Episode = this.Options.Graph[i];
            let Name  = Episode.Name;
            let Value = Episode.Data[i];
            let Color = Episode.Color;

            let ValueFormatted = Name;
            if (Episode.Format !== null)
                ValueFormatted = Episode.Format.call(Chart, Name, Value, Episode, i);

            let checked = this.Options.Series[i].Visible ? `checked="checked"` : '';
            this.Options.Legend.Html += `<div class="legend-item">
                <input class="legend-checkbox" type="checkbox" ${checked} id="legend-ch-${this.ID}-${i}" data-line="${i}" data-name="${Name}">
                <label class="legend-label" for="legend-ch-${this.ID}-${i}">
                    <div class="legend-icon" style="background-color: ${Color}"></div>
                    <div>${ValueFormatted}</div>
                </label>
              </div>`;
        }
        this.Options.Legend.Html = `<div class="legend-box">${this.Options.Legend.Html}</div>`;
    }

    MakeAxisX0(){
        //console.log('MakeAxisX', stack);
        let LabelList = this.Options.AxisX.Data;
        let Len = LabelList.length;
        let AxisHtml = '';
        let GridLineHtml = '';
        let FullTextLabels = '';
        let MaxLengthLabel = '';
        let LabelCount = 0;

        this._Rendered.AxisX = [];
        this._Rendered.Grid = [];

        if (this.Options.AxisX.Linear){
            for (let i = 0; i < Len; i++) {
                if (
                    i % this.Options.AxisX.Skip === 0
                    || this.Options.AxisX.Skip === null
                    || this.Options.AxisX.Skip === 'auto'
                ){
                    let ValueFormatted = (this.Options.AxisX.Format !== null ? this.Options.AxisX.Format.call(this, LabelList[i]) : LabelList[i]).toString();
                    /** @type {AxisXLabelItem} */
                    let AxisXLabelItem = {
                        LabelItem: Lure.CreateElementFromString('<div class="axis-x-label"></div>'),
                        LabelItemText: Lure.CreateElementFromString(`<span class="axis-x-label-text">${ValueFormatted}</span>`),
                    };
                    if (ValueFormatted === ''){
                        AxisXLabelItem.LabelItem.classList.add('label-empty');
                    }
                    AxisXLabelItem.LabelItem.appendChild(AxisXLabelItem.LabelItemText);
                    this._Rendered.AxisX.push(AxisXLabelItem);
                    if (i > 0)
                        this._Rendered.Grid.push(Lure.CreateElementFromString(`<div class="chart-grid-cell"></div>`));
                    LabelCount++;
                }
            }
        }
        else
        {
            //inlinear AxisX scale
        }

        this.AxisX.style.setProperty('--axis-x-label-rotation', '0deg');
        this.AxisX.style.setProperty('--axis-x-label-translateX', '0px');
        this.AxisX.style.setProperty('--axis-x-label-translateY', '0px');
        this.AxisX.style.setProperty('--axis-x-label-height', 'auto');


        let st = window.getComputedStyle(this.AxisX);
        let wt = Lure.GetTextWidth(FullTextLabels, st.fontFamily, st.fontSize)*1.05;
        let MaxPossibleLabelWidth = this.AxisX.clientWidth/LabelCount;
        //let WidestLabelWidth = Lure.GetTextWidth(MaxLengthLabel, st.fontFamily, st.fontSize);

        let WidestLabelWidth = 0;
        for (let it of this._Rendered.AxisX){
            this.AxisX.appendChild(it.LabelItem);
            WidestLabelWidth = WidestLabelWidth < it.LabelItemText.clientWidth ? it.LabelItemText.clientWidth: WidestLabelWidth
        }

        let AngleDeg = 7;
        let AngleRad = AngleDeg * Math.PI / 180;
        if (this.Options.AxisX.Visible && WidestLabelWidth > MaxPossibleLabelWidth){
            //let MinW = this.AxisX.clientWidth / Len;
            let d = (wt - this.AxisX.clientWidth)/LabelCount;
            let AngleCos = MaxPossibleLabelWidth / WidestLabelWidth;

            AngleRad = Math.acos(AngleCos);
            AngleRad = AngleRad * 10/9; // up 80deg to 90+
            AngleRad = AngleRad > Math.PI/2 ? Math.PI/2: AngleRad; //set 90deg max

            AngleDeg = AngleRad*180/Math.PI;

            // let h = parseInt(st.height);
            // if (h === 0)
            //     h = 27;
 
            //console.log(`deg -> ${deg}, a-> ${(Math.sin(rad))*(MaxLen)}, b-> ${Math.sin(rad)*h}, MaxLen-> ${MaxLen}`);

            let sin = Math.sin(AngleRad);
            let cos = Math.cos(AngleRad);

            let Y = (Math.sin(AngleRad))*(WidestLabelWidth/2);
            //let Y = (Math.sin(deg*Math.PI/360))*(MaxLen + h);
            let X = d/2; //Math.sin(rad)*(MaxLen + h) / 2 ;
            let wh = Y ;
            //console.log(`wt:${wt}/${this.AxisX.clientWidth}, deg: ${AngleDeg}, d:${d},  wh: ${wh}, Y:${Y}, X:${X}`);
            //debugger
            this.AxisX.style.setProperty('--axis-x-label-rotation',   `-${AngleDeg}deg`);
            this.AxisX.style.setProperty('--axis-x-label-translateX', `${X}px`);
            this.AxisX.style.setProperty('--axis-x-label-translateY', `${Y}px`);
            this.AxisX.style.setProperty('--axis-x-label-height',     `${wh}px`);



        }
        let sin = Math.sin(AngleRad);
        let cos = Math.cos(AngleRad);
        //console.log(`cos: ${cos.toFixed(3)}, sin: ${sin.toFixed(3)}, 1-sin: ${(1-sin).toFixed(3)}, 1-cos: ${(1-cos).toFixed(3)},  AngleRad: ${AngleRad}, AngleDeg: ${AngleDeg}, MaxPossibleLabelWidth/2: ${MaxPossibleLabelWidth/2}`);
        //console.log(stack, WidthTextList);


        this.Options.Grid.HtmlLine = GridLineHtml;

        for (let item of this._Rendered.AxisX){
            let val = - item.LabelItemText.clientWidth * cos / 2;
            AxisHtml = AxisHtml.replace("%MarginText%",  val);
        }


        //const SkipCoeff = Math.ceil(wt*Math.abs( Math.cos(AngleRad) )/this.AxisX.clientWidth);
        const SkipCoeff = Math.ceil(parseFloat(st.lineHeight) / MaxPossibleLabelWidth);
        if (this.Options.AxisX.Skip === 'auto' && SkipCoeff > 1 && stack < 2){
            return this.MakeAxisX(SkipCoeff, stack);
        }
    }
    MakeAxisX(AutoSkipCoeff=0, stack=0){
        stack++;
        let LabelList = this.Options.AxisX.Data;
        let Len = LabelList.length;
        let AxisHtml = '';
        let GridLineHtml = '';
        let FullTextLabels = '';
        let MaxLengthLabel = '';
        let LabelCount = 0;

        let WidthTextList = []; //save widths of labels for set  them after rotation calc;
        if (this.Options.AxisX.Linear) {
            for (let i = 0; i < Len; i++) {
                //if (number-to-skip || no-skip)
                if ((i % this.Options.AxisX.Skip === 0) || (this.Options.AxisX.Skip === null || (this.Options.AxisX.Skip === 'auto' && AutoSkipCoeff === 0)) || (this.Options.AxisX.Skip === 'auto' && AutoSkipCoeff > 0 && i % AutoSkipCoeff === 0)) {
                    let ValueFormatted = (this.Options.AxisX.Format !== null ? this.Options.AxisX.Format.call(this, LabelList[i]) : LabelList[i]).toString();
                    //let w = Weights[i]*LabelCount/Len;
                    let LabelText = ValueFormatted;
                    let LabelElem = Lure.CreateElementFromString(ValueFormatted);
                    if (LabelElem !== void 0){
                        LabelText = LabelElem.innerText;
                    }
                    WidthTextList.push(Lure.GetTextWidth(LabelText));

                    AxisHtml += `<div class="axis-x-label ${ValueFormatted.toString().length > 0 ? '' : 'label-empty'}"><span class="axis-x-label-text" style="left: %MarginText%px">${ValueFormatted}</span></div>`;
                    FullTextLabels += " "+ValueFormatted;
                    LabelCount++;
                    if (MaxLengthLabel.length < LabelText.length){
                        MaxLengthLabel = LabelText;
                    }
                    if (i > 0)
                        GridLineHtml += `<div class="chart-grid-cell"></div>`;
                }
            }
        } else
            {
            let Weight = 0;
            let Ws = 0;
            let Weights = [];

            let LList = LabelList
                .Where((l, i) => {
                    //if (function || number-to-skip || no-skip)
                    let Cond = (!this.Options.AxisX.Skip.call(this.Chart, l))
                        || (!i % this.Options.AxisX.Skip === 0)
                        || (this.Options.AxisX.Skip === null)
                        || (this.Options.AxisX.Skip === 'auto' && AutoSkipCoeff > 0 && i % AutoSkipCoeff === 0);
                    if (!Cond) {
                        Weight++;
                    } else {
                        if (Weight > 0) {
                            Weights.push(Weight);
                            Ws += Weight;
                        }
                        Weight = 1;
                    }
                    return Cond;
                });
            let LabelCount = LList.length;
            //TODO CHECK THESE DAMN
            Weights.push(Weight-1);
            for (let i = 0; i < LList.length; i++) {
                let ValueFormatted = this.Options.AxisX.Format !== null ? this.Options.AxisX.Format.call(this.Chart, LList[i]) : LList[i];
                let w = Weights[i] * 1 / LabelCount;
                AxisHtml += `<div class="axis-x-label no-linear ${ValueFormatted.toString().length > 0 ? '' : 'label-empty'}" style="flex: ${w}"><span class="axis-x-label-text">${ValueFormatted}</span></div>`;
                GridLineHtml += `<div class="chart-grid-cell" style="flex: ${w}"></div>`;
            }
        }
        //p = window.performance.now() - p;
        //console.log(`[p.MakeAxisX] ${Math.round(p)}ms`, p);

        //let t = performance.now();
        this.AxisX.style.setProperty('--axis-x-label-rotation', '0deg');
        this.AxisX.style.setProperty('--axis-x-label-translateX', '0px');
        this.AxisX.style.setProperty('--axis-x-label-translateY', '0px');
        this.AxisX.style.setProperty('--axis-x-label-height', 'auto');


        let st = window.getComputedStyle(this.AxisX);
        let wt = Lure.GetTextWidth(FullTextLabels, st.fontFamily, st.fontSize)*1.05;

        let MaxPossibleLabelWidth = this.AxisX.clientWidth/LabelCount;
        let WidestLabelWidth = Lure.GetTextWidth(MaxLengthLabel, st.fontFamily, st.fontSize);


        let AngleDeg = 7;
        let AngleRad = AngleDeg * Math.PI / 180;
        if (this.Options.AxisX.Visible && WidestLabelWidth > MaxPossibleLabelWidth){
            //let MinW = this.AxisX.clientWidth / Len;
            let d = (wt - this.AxisX.clientWidth)/LabelCount;
            let AngleCos = MaxPossibleLabelWidth / WidestLabelWidth;

            AngleRad = Math.acos(AngleCos);
            AngleRad = AngleRad * 10/9; // up 80deg to 90+
            AngleRad = AngleRad > Math.PI/2 ? Math.PI/2: AngleRad; //set 90deg max

            AngleDeg = AngleRad*180/Math.PI;

            // let h = parseInt(st.height);
            // if (h === 0)
            //     h = 27;

            //console.log(`deg -> ${deg}, a-> ${(Math.sin(rad))*(MaxLen)}, b-> ${Math.sin(rad)*h}, MaxLen-> ${MaxLen}`);
            let sin = Math.sin(AngleRad);
            let cos = Math.cos(AngleRad);

            let Y = (Math.sin(AngleRad))*(WidestLabelWidth/2);
            //let Y = (Math.sin(deg*Math.PI/360))*(MaxLen + h);
            let X = -d/2; //Math.sin(rad)*(MaxLen + h) / 2 ;
            let wh = Y ;
            //console.log(`wt:${wt}/${this.AxisX.clientWidth}, deg: ${AngleDeg}, d:${d},  wh: ${wh}, Y:${Y}, X:${X}`);
            //debugger
            this.AxisX.style.setProperty('--axis-x-label-rotation', `-${AngleDeg}deg`);
            this.AxisX.style.setProperty('--axis-x-label-translateX', `${X}px`);
            this.AxisX.style.setProperty('--axis-x-label-translateY', `${Y}px`);
            this.AxisX.style.setProperty('--axis-x-label-height', `${wh}px`);
        }
        let sin = Math.sin(AngleRad);
        let cos = Math.cos(AngleRad);
        //console.log(`cos: ${cos.toFixed(3)}, sin: ${sin.toFixed(3)}, 1-sin: ${(1-sin).toFixed(3)}, 1-cos: ${(1-cos).toFixed(3)},  AngleRad: ${AngleRad}, AngleDeg: ${AngleDeg}, MaxPossibleLabelWidth/2: ${MaxPossibleLabelWidth/2}`);
        //console.log(stack, WidthTextList);

        for (let wid of WidthTextList){
            let val = -wid * cos / 2;
            AxisHtml = AxisHtml.replace("%MarginText%",  val);
        }
        //console.info(performance.now() - t);
        this.Options.AxisX.Html    = AxisHtml;
        this.Options.Grid.HtmlLine = GridLineHtml;
        //const SkipCoeff = Math.ceil(wt*Math.abs( Math.cos(AngleRad) )/this.AxisX.clientWidth);
        const SkipCoeff = Math.ceil(parseFloat(st.lineHeight) / MaxPossibleLabelWidth);
        if (this.Options.AxisX.Skip === 'auto' && SkipCoeff > 1 && stack < 2){
            return this.MakeAxisX(SkipCoeff, stack);
        }


    }
    MakeAxisY(){
        let i = 0;
        if (!this.Options.AxisY.Visible)
        {
            this.Options.AxisY.Html = '';
            i = 1;
            if (this.Options.Graph.Where(x=>x.AxisY).length < 1)
                return;
        }
        let Scales = this.GetScaleY(this.HookChart.clientHeight);
        //console.log('Scales', Scales);
        let AxisYLeft = '';
        let AxisYRight = '';
        this.Options.AxisY.HtmlLeft = '';
        this.Options.AxisY.HtmlRight = '';
        //TODO render by html tree, no by string!
        for (i ; i < Scales.length; i++){
            let Scale = Scales[i];

            let caption = `<div class="y axis-y-caption">
    <div class="axis-y-caption-value">${i > 0 ? this.Options.Graph[Scale.SIndex].Title : this.Options.Title}</div>
</div>`;
            let a = '';
            for (let j = 0; j < Scale.Values.length; j++){
                a += `<div class="axis-y-label"><span class="axis-y-label-text">${Scale.Values[j]}</span></div>`;
            }
            let Axis = `<div class="axis-y" ${(i>0)? ('style="color: '+this.Options.Graph[Scale.SIndex].Color+'; font-weight: bold;"'):''} data-line="${i}">
    ${caption}
    <div class="axis-y-labels">${a}</div>
</div>`;
            if (Scale.SIndex < 0 && this.Options.AxisY.Position === 'left')
                AxisYLeft += Axis;
            else if (Scale.SIndex < 0 && this.Options.AxisY.Position === 'right')
                AxisYRight += Axis;
            else if (Scale.SIndex > -1 && this.Options.Graph[Scale.SIndex].AxisY.Position !== 'right')
                AxisYLeft += Axis;
            else if (Scale.SIndex > -1 && this.Options.Graph[Scale.SIndex].AxisY.Position === 'right')
                AxisYRight += Axis;
        }
        this.Options.AxisY.HtmlLeft  = AxisYLeft;
        this.Options.AxisY.HtmlRight = AxisYRight;
    }

    GetScaleY(Height){
        //console.log('GetScaleY.Height', Height);
        let Series = this.Options.Graph;
        let DefaultScale = {
            Min:  this.Options.AxisY.Min  !== 'auto' ? this.Options.AxisY.Min  : Number.MAX_VALUE, //Series[0].Data[0],
            Max:  this.Options.AxisY.Max  !== 'auto' ? this.Options.AxisY.Max  : -Number.MAX_VALUE,  //Series[0].Data[0],
            Step: this.Options.AxisY.Step !== 'auto' ? this.Options.AxisY.Step : 'auto',

            _Min:  this.Options.AxisY.Min,
            _Max:  this.Options.AxisY.Max,
            _Step: this.Options.AxisY.Step,
            SIndex: -1,
            //Position: this.Options.AxisY.Position,

            // Title: this.Options.Title,
            // Name: this.Options.Name,
        };

        let Scales = [DefaultScale];
        //get min and max values
        for (let i = 0; i < Series.length; i++){

            let S = Series[i];
            if (!S.Visible)
                continue;
            let SData = Series[i].Data;
            let Scale = {
                Min: SData[0],
                Max: SData[0],
                Step: 'auto',
                SIndex: -1,
            };
            if (S.AxisY.Visible){
                Scale.SIndex = i;
                Scale.Min  = S.AxisY.Min  !== 'auto' ? S.AxisY.Min  : Scale.Min;
                Scale.Max  = S.AxisY.Max  !== 'auto' ? S.AxisY.Max  : Scale.Max;
                Scale.Step = S.AxisY.Step !== 'auto' ? S.AxisY.Step : Scale.Step;
                Scale._Min  = S.AxisY.Min;
                Scale._Max  = S.AxisY.Max;
                Scale._Step = S.AxisY.Step;

                Scales.push(Scale);
            }

            for (let j = 0; j < SData.length; j++){
                let SValue = SData[j];
                //DefaultScale
                if (!S.AxisY.Visible && DefaultScale._Min === 'auto' && SValue < DefaultScale.Min )
                    DefaultScale.Min = SValue;
                if (!S.AxisY.Visible && DefaultScale._Max === 'auto' && SValue > DefaultScale.Max )
                    DefaultScale.Max = SValue;

                //Series scale
                if (S.AxisY && S.AxisY.Min === 'auto' && SValue < Scale.Min)
                    Scale.Min = SValue;
                if (S.AxisY && S.AxisY.Max === 'auto' && SValue > Scale.Max)
                    Scale.Max = SValue;
            }
        }


        //calc scales
        const MagicConst = 20;   //TODO line-height or not to do
        for (let i = 0; i < Scales.length; i++){
            let Scale = Scales[i];
            let Step = Scale.Step;
            if (Scale.Min === 0 && Scale.Max === 0){
                Scale.Max = 1;
            }

            let OrderMax = Lure.GetNumberOrder(Scale.Max);
            if (Step === 'auto'){
                let dy = Scale.Max - Scale.Min;
                let Rounder = 5 * Math.pow(10, OrderMax-2);
                Step = Lure.RoundBy( dy * MagicConst/Height, Rounder);
            }
            if (Scale._Min === 'auto' && OrderMax > -1 && Scale.Min % 5 > 0){
                let OrderMin = Lure.GetNumberOrder(Scale.Max);
                let ToFixed = OrderMin < 0 ? -OrderMin : 0;
                Scale.Min = Lure.RoundBy(Scale.Min, Step) - Step;
                Scale.Min = parseFloat(Scale.Min.toFixed(2+ToFixed).replace('.00'+'0'.repeat(ToFixed), '')); //fucking js floats
            }
            let ToFixed = OrderMax < 0 ? -OrderMax : 0;
            let ScaleValues = [];
            let StageValue = Scale.Min;
            let lim = 0;
            //if (strict max || auto max)
            if (Scale.Min === Scale.Max){
                Step = 1;
            }

            while (Step !== 0 && ((StageValue <= Scale.Max && Scale._Max === 'auto') || StageValue < Scale.Max && Scale._Max !== 'auto') && lim < 10000){
                lim++;
                ScaleValues.push(StageValue);
                StageValue += Step;
                StageValue = parseFloat(StageValue.toFixed(2+ToFixed).replace('.00'+'0'.repeat(ToFixed), '')); //fucking js floats
            }
            if (lim >= 1000)
                console.warn('Chart.GetScaleYError', this);

            ScaleValues.push(StageValue);
            Scale.Values = ScaleValues;
        }
        this.Options.Scales = Scales;
        return Scales;
    }

    MakeGrid(){
        this.Options.Grid.Html = '';
        if (!this.Options.Grid.Visible)
            return;

        if (this.Options._Series.Padding > 0){
            this.Options.Grid.HtmlLine = `<div class="chart-grid-cell" style="min-width: ${this.Options._Series.Padding}px; flex: 0;"></div>` + this.Options.Grid.HtmlLine;
            this.Options.Grid.HtmlLine += `<div class="chart-grid-cell" style="min-width: ${this.Options._Series.Padding}px; flex: 0;"></div>`;
        }
        let SizeY = this.Options.Scales[0].Values.length-1;
        let Grid = '';
        for (let i = 0; i < SizeY; i++){
            Grid += `<div class="chart-grid-line" >${this.Options.Grid.HtmlLine}</div>`;
        }
        this.Options.Grid.Html = Grid;
        this.ChartGrid.innerHTML = this.Options.Grid.Html;
    }
    MakeSvg(Options){
        this.Options.Svg.Html = '';
        this.Options.Svg.Width = this.HookChart.clientWidth;
        this.Options._Series.Line.CountPrepared = 0;
        this.Options._Series.Bar.CountPrepared = 0;
        this.Options._Series.Pie.CountPrepared = 0;
        for (let i = 0; i < this.Options.Graph.length; i++){
            let Episode = this.Options.Graph[i];
            if (!Episode.Visible)
                continue;
            Episode.Prepared = {};
            let Scale = this.Options.Scales.Where(x=>x.SIndex === i).FirstOrDefault();
            let Ys = this.GetValuesY(Episode, Scale, this.Options.Scales[0], this.Options.Svg.Height);
            let Xs = this.GetValuesX(Episode, this.Options.Svg.Width);
            Episode.Points = this.GetPoints(Xs, Ys);
            //console.log(`PrepareSeries`,Ys, Xs);
            this.Options.Svg.Html += this.GetPath(Episode.Type)(Episode.Points, Episode, i, Options);
        }
        this.ChartSvg.innerHTML = this.Options.Svg.Html;
    }

    /**
     *
     * @param ValueX
     * @param EpisodeNum
     * @param ValueNum
     * @return {LureChartTip}
     */
    GetTip(ValueX, EpisodeNum, ValueNum){
        let Episode = this.Options.Tooltip.Episode;
        let Points = Episode.Points;
        let Index = Math.round(ValueX/Points.Last()[0] * (Points.length-1));
        if (Index > Points.length-1)
            Index = Points.length-1;
        if (Index < 1)
            Index = 0;

        let TipPrev = this.Options.Tooltip.TipPrev;

        let Tip =  {
            Name: Episode.Name,
            Color: Episode.Color,
            ValueX: Episode.AxisX.Data[Index],
            ValueY: Episode.Data[Index],
            Value: Episode.Data[Index],
            Episode: Episode,
            x: Points[Index][0],
            y: Points[Index][1],
            SvgWidth: this.HookChart.clientWidth,
            SvgHeight: this.HookChart.clientHeight,
            EpisodeIndex: Episode.Line,
            ValueIndex: Index,
        };
        if (TipPrev && TipPrev.x === Tip.x && TipPrev.y === Tip.y)
            return TipPrev;
        return Tip;
    }
    FillLegend(){
        if (this.Options.Legend.Visible)
            this.ChartLegend.innerHTML = this.Options.Legend.Html;
    }
    FillAxisX(){
        if (this.Options.AxisX.Visible)
            this.AxisX.innerHTML = this.Options.AxisX.Html;
    }
    FillAxisY(){
        if (this.Options.AxisY.Visible){
            this.AxisYLeft.innerHTML      = this.Options.AxisY.HtmlLeft;
            this.AxisYRight.innerHTML     = this.Options.AxisY.HtmlRight;
        }
    }
    Fill(){
        this.ChartName.innerHTML      = this.Options.Name;
        this.FillLegend();
        this.FillAxisX();
        this.FillAxisY();
    }

    Refresh(Options){
        this.MakeAxisX();
        this.MakeAxisY();
        this.MakeGrid();
        this.AxisYLeft.innerHTML = this.Options.AxisY.HtmlLeft;
        this.AxisYRight.innerHTML = this.Options.AxisY.HtmlRight;
        this.MakeSvg(Options);
    }
    Redraw(Options){
        this.GetSeries();    //get graph series
        this.MakeLegend();

        this.MakeAxisX(0, 2);
        this.MakeAxisY();

        //fix crawl width
        if (this.Options.Legend.Position === 'right' || this.Options.Legend.Position === 'left')
            this.FillLegend();
        this.FillAxisY();
        this.MakeAxisX();
        //---

        this.Fill();         //this.Proto.Refresh();
        this.ChartSvgInit();

        this.MakeSvg(Options);
        this.MakeGrid();
    }

    OnLegendChange(e){
        let i = e.currentTarget.dataset['line'];
        let Episode = this.Options.Graph[i];
        Episode.Visible = e.currentTarget.checked;
        //console.log('changed', e.currentTarget, Episode);
        if (this.Options.Graph.Where(g=>g.Visible).length < 1){
            Episode.Visible = true;
            e.currentTarget.checked = true;
            return;
        }
        this.Refresh({Animation: false});
    }
    OnChartMouseMove(e){
        //console.log(`e.target.tagName ${e.target.tagName}`);
        if (e.target.tagName === 'rect' || e.target.tagName === 'path' || e.target.tagName === 'circle'){
            let i = e.target.dataset["line"];
            this.Options.Tooltip.Episode = this.Options.Graph[i];
        }
        if (!this.Options.Tooltip.Episode)
            return;
        this.Options.Svg.Rect = this.HookChart.getBoundingClientRect();
        let x = e.clientX - this.Options.Svg.Rect.left;
        let EpisodeNum = e.target.dataset['line'];
        let ValueNum = e.target.dataset['item'];
        let Tip = this.GetTip(x, EpisodeNum, ValueNum);
        this.Tooltip.Tip = Tip;

        //console.log(`e.pageX:${e.pageX}, e.clientX: ${e.clientX}`, e);
        this.StickV.style.left = Tip.x + 'px';
        this.Tooltip.Refresh();
    }

    constructor(Chart){
        super(Chart);

        this._Rendered = {
            /** @type {AxisXLabelItem[]} */
            AxisX: [],
            Grid: [],
        };
        this._FirstRedraw = true;
        this.Tooltip.Format = this.Tooltip.Format  ? this.Tooltip.Format : Lure._Core.Chart.Intitializer.Default.R.Tooltip.FormatGraph;
    }
};




Lure._Core.Chart.ChartContentDraw = class extends Lure._Core.Chart.BChartContent{
    PolarToCartesius(centerX, centerY, radius, angleInDegrees) {
        let angleInRadians = (angleInDegrees-0) * Math.PI / 180;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
    GetPathPie(Options={}){
        //let Options = this.Options;
        //debugger
        let sectors = '';
        let Width = this.HookChart.clientWidth;
        let Height = this.HookChart.clientHeight;
        if (this.Options.Legend.Position === 'right' || this.Options.Legend.Position === 'left'){
            // Width = Width - this.Block.Legend.clientWidth;
        }
        //let d = Height < Width? Height*0.9:Width*0.9;
        let d = Height < Width? Height :Width ;
        d = d - 2; //chrome cuts svg by ~1px
        let PrevRadius = -1;
        let PrevWidth = -1;


        let CSSAnimationPie = this.Options.Animation.Pie;
        CSSAnimationPie = Options.Animation === false ? '' :CSSAnimationPie;
        let AnimationDuration = Lure.GetDurationAnimation(CSSAnimationPie);
        for (let i = 0; i < this.Options.Draws.length; i++){
            if (!this.Options.Draws[i].Visible)
                continue;
            let Episode = this.Options.Draws[i];
            let sum = 0;
            let AngleStart = Episode.AngleStart; //-45;
            let r = d/2 * (this.Options.Draws.length-i)/this.Options.Draws.length;
            let wd = 2*r;
            if (Episode.Type === 'pie' && i > 0){
                r = PrevRadius - PrevWidth - Episode.Margin/2 - 0.2;
                if (r < 0){
                    r = PrevRadius - i/this.Options.Draws.length*PrevRadius;
                }
            }
            if (Episode.Type === 'ring'){
                wd = Episode.Width;
                //r = r*2;// - wd/2;
                if (i > 0){
                    r = PrevRadius - (PrevWidth- 0.2) - Episode.Margin; //-0.2 for remove gap between rings
                }
            }
            PrevRadius = r;
            PrevWidth = Episode.Type === "pie" ? Episode.Width : wd;


            let Sectors = [];
            let SectorsCount = 0;
            Episode.Sum = 0;
            for (let j = 0; j < Episode.Data.length; j++){
                Episode.Sum += Episode.Data[j];
                if (!Episode.Visibles[j])
                {
                    Sectors.push(null);
                    continue;
                }
                SectorsCount++;
                Sectors.push(Episode.Data[j]);
                sum += Episode.Data[j];
            }
            //draw something if data empty
            if (SectorsCount < 1)
                Sectors = Episode.Data.Select(()=>1);
            SectorsCount = Sectors.length;
            let SectorVisibleCount = Episode.Visibles.Where(x=>x).length;
            for (let j = 0; j < Sectors.length; j++){
                if(Sectors[j] === null)
                    continue;
                let angle = Sectors[j]/sum * 360;
                if (sum === 0){
                    angle = 360/ SectorVisibleCount;
                }
                if (angle === 360)
                {
                    angle = 359.99; //collapsing 360deg = 0deg
                    AngleStart = 0;
                }
                let style= '';
                if (CSSAnimationPie){
                    style = `opacity: 0;transform: scale(0.01,0.01) ;  animation-delay: ${j*AnimationDuration/SectorsCount/2}ms`;
                }
                sectors += `<g>`;
                if (Episode.Type !== 'pie')
                {
                    //sectors += `<path class="${CSSAnimationPie}" style="${style}" d="${this.GetArc(Width/2, Height/2, r, AngleStart, AngleStart + angle)}" fill="none" stroke="${Episode.Colors[j]}" stroke-width="${wd}" stroke-opacity="1" data-type="${Episode.Type}" data-line="${i}" data-sector="${j}"></path>`;
                    //  if (this.Options.Tooltip.Visible)
                    //      sectors += `<path class="chart-hover ${CSSAnimationPie}" style="${style}" data-type="pie" data-line="${i}" data-item="${j}" d="${this.GetArc(Width/2, Height/2, r, AngleStart, AngleStart+angle)}" fill="none" stroke="#fff" stroke-width="${wd}" stroke-opacity="0" data-line="${i}" data-sector="${j}"></path>`;
                    sectors += `<path class="${CSSAnimationPie}" style="${style}" d="${this.GetRing(Width/2, Height/2, r, AngleStart, AngleStart + angle, wd)}" fill="${Episode.Colors[j]}" stroke="noe" stroke-width="0" fill-opacity="1" data-type="${Episode.Type}" data-line="${i}" data-sector="${j}"></path>`;
                    if (this.Options.Tooltip.Visible)
                        sectors += `<path class="chart-hover ${CSSAnimationPie}" style="${style}" data-type="pie" data-line="${i}" data-item="${j}" d="${this.GetRing(Width/2, Height/2, r, AngleStart, AngleStart+angle, wd)}" fill="#fff" stroke="none" stroke-width="0" fill-opacity="0" data-line="${i}" data-sector="${j}"></path>`;
                }
                if (Episode.Type === 'pie')
                {
                    sectors += `<path class="${CSSAnimationPie}" style="${style}" d="${this.GetSector(Width/2, Height/2, r, AngleStart, AngleStart + angle)}" fill="${Episode.Colors[j]}" stroke="none" data-type="${Episode.Type}" data-line="${i}" data-sector="${j}"></path>`;
                    if (this.Options.Tooltip.Visible)
                        sectors += `<path class="chart-hover ${CSSAnimationPie}" style="${style}" data-type="pie" data-line="${i}" data-item="${j}" d="${this.GetSector(Width/2, Height/2, r, AngleStart, AngleStart+angle)}" fill="#fff" stroke="none"  stroke-width="0" fill-opacity="0" data-line="${i}" data-sector="${j}"></path>`;
                }

                sectors += `</g>`;
                AngleStart += angle;
            }
        }
        //debugger;
        return sectors;
    }
    GetArc(x, y, radius, startAngle, endAngle){
        //debugger;
        let start = this.PolarToCartesius(x, y, radius, endAngle);
        let end = this.PolarToCartesius(x, y, radius, startAngle);

        let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    }
    GetSector(x, y, radius, startAngle, endAngle){
        //debugger;
        let start = this.PolarToCartesius(x, y, radius, endAngle);
        let end = this.PolarToCartesius(x, y, radius, startAngle);

        let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        //return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "L", x, y,
            "Z"
        ].join(" ");
    };
    GetRing(x, y, radius, startAngle, endAngle, width){
        //debugger;
        let start = this.PolarToCartesius(x, y, radius, endAngle);
        let end = this.PolarToCartesius(x, y, radius, startAngle);

        let start1 = this.PolarToCartesius(x, y, radius-width, endAngle);
        let end1 = this.PolarToCartesius(x, y, radius-width, startAngle);

        let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        //return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "L", end1.x, end1.y,
            "M", end1.x, end1.y,
            "A", radius-width, radius-width, 0, largeArcFlag, 1, start1.x, start1.y,
            "L", start.x, start.y
        ].join(" ");
    }

    GetContent(){
        let HTMLLegend = `<div class="legend"></div>`;
        return Lure.CreateElementFromString(`<div class="l-chart l-col">
                        <table class="l-chart-t">
                            <tr class="tr-hook-top">
                                <td colspan="5" class="hook-top">
                                    <div class="chart-name"></div>
                                    ${this.Options.Legend.Visible && this.Options.Legend.Position==='top'? HTMLLegend:''}
                                </td>
                            </tr>
                            
                            <tr class="tr-hook-mid">
                                <td>${this.Options.Legend.Visible && this.Options.Legend.Position==='left'? HTMLLegend:''}</td> 
                                <td rowspan="1">
                                    <div class="hook-axis-y hook left"></div>
                                </td>
                                <td rowspan="1" class="hook-chart">
                                    <div class="chart-svg-wrapper"><svg class="chart-svg"></svg></div>
                                    <div class="chart-tooltip"></div>
                                </td> 
                                <td rowspan="1">
                                    <div class="hook-axis-y hook right"></div>
                                </td> 
                                <td>${this.Options.Legend.Visible && this.Options.Legend.Position ==='right'? HTMLLegend:''}</td>
                            </tr>
                            
                            <tr class="tr-hook-bottom">
                                ${this.Options.Legend.Visible && this.Options.Legend.Position==='bottom'? HTMLLegend:''}
                            </tr>
                        </table>
                      </div>`);
    }
    GenContentProps(){}


    /*content's*/
    GetSeries(){
        this.Options.Draws = this.Options.Series.Where(s=>Lure._Core.Chart.Intitializer.isDraw(s.Type));
    }
    ChartSvgInit() {
        this.Options.Svg.Rect = this.HookChart.getBoundingClientRect();
        if (this.Options.Name === ''){
            this.ChartName.style.display = 'none';
        }
        else {
            this.ChartName.style.display = '';
        }
        //this.ChartSvg.style.height = this.HookChart.clientHeight+'px';
    };
    MakeLegend() {
        if (!this.Options.Legend.Visible)
            return;
        this.Options.Legend.Html = '';

        for (let i = 0; i < this.Options.Draws.length; i++){
            let Episode = this.Options.Draws[i];

            let l = '';
            for (let j = 0; j < Episode.Labels.Data.length; j++){
                let Name = Episode.Labels.Data[j];
                let Value = Episode.Data[j];
                let ValueFormatted = Name;
                if (Episode.Labels.Format !== null)
                    ValueFormatted = Episode.Labels.Format.call(Chart, Name, Value, Episode, j);
                let Color = Episode.Colors[j] ? Episode.Colors[j] : `#${Lure.GetRandom(100000, 999999)}`;

                let checked = this.Options.Series[i].Visibles[j] ? `checked="checked"` : '';
                l += `<div class="legend-item">
                                  <input class="legend-checkbox" type="checkbox" ${checked} id="legend-ch-${this.ID}-${i}-${j}" data-line="${i}" data-sector="${j}">
                                  <label class="legend-label" for="legend-ch-${this.ID}-${i}-${j}">
                                     <div class="legend-icon" style="background-color: ${Color}"></div>
                                     <div>${ValueFormatted}</div>
                                  </label>
                                </div>`
            }
            this.Options.Legend.Html += `<div class="legend-box">${l}</div>`;
        }
    }
    MakeSvg(Options) {
        this.Options._Series.Pie.CountPrepared = 0;
        this.Options.Svg.Html = this.GetPathPie(Options);
        this.ChartSvg.innerHTML = this.Options.Svg.Html;
    };

    Fill(){
        this.ChartName.innerHTML   = this.Options.Name;
        if (this.Options.Legend.Visible)
            this.ChartLegend.innerHTML = this.Options.Legend.Html;
    }
    Refresh(Options){
        this.MakeSvg(Options);
    }
    Redraw(Options){
        this.GetSeries();
        this.MakeLegend();
        this.Fill();         //this.Proto.Refresh();
        this.ChartSvgInit();
        this.MakeSvg(Options);
    }


    OnLegendChange(e){
        let i = e.currentTarget.dataset['line'];
        let j = e.currentTarget.dataset['sector'];
        let Episode = this.Options.Draws[i];
        Episode.Visibles[j] = e.currentTarget.checked;
        if (Episode.Visibles.Where(x=>x).length < 1){
            Episode.Visibles[j] = true;
            e.currentTarget.checked = true;
            return;
        }
        this.Refresh({Animation: false});
    }
    OnChartMouseMove(e){
        //console.log(`e.target.tagName ${e.target.tagName}`);
        if (e.target.tagName.toLowerCase() !== 'path')
            return false;
        let i = e.target.dataset["line"];
        let j = e.target.dataset["sector"];
        this.Options.Tooltip.Episode = this.Options.Draws[i];
        this.Options.Svg.Rect = this.HookChart.getBoundingClientRect();
        if (!this.Options.Tooltip.Episode)
            return;
        let x = e.clientX - this.Options.Svg.Rect.left;
        let y = e.clientY - this.Options.Svg.Rect.top;

        let EpisodeNum = e.target.dataset['line'];
        let ValueNum = e.target.dataset['item'];

        this.Tooltip.Tip =  {
            Name:  this.Options.Tooltip.Episode.Labels.Data[j],
            Label: this.Options.Tooltip.Episode.Labels.Data[j],
            Color: this.Options.Tooltip.Episode.Colors[j],
            ValueX: this.Options.Tooltip.Episode.Labels.Data[j],
            ValueY: this.Options.Tooltip.Episode.Data[j],
            Value:  this.Options.Tooltip.Episode.Data[j],
            Episode: this.Options.Tooltip.Episode,
            x: x,
            y: y,
            SvgWidth: this.HookChart.clientWidth,
            SvgHeight: this.HookChart.clientHeight,
            EpisodeNum,
            ValueNum,
        };
        //console.log(`e.pageX:${e.pageX}, e.clientX: ${e.clientX}`, e);
        this.Tooltip.Refresh();
    }



    constructor(Chart){
        super(Chart);
        this.Tooltip.Format = this.Tooltip.Format  ? this.Tooltip.Format : Lure._Core.Chart.Intitializer.Default.R.Tooltip.FormatDraws;
    }
};
Lure.Chart = class {
    Redraw(Options){
        //let r = window.performance.now();
        if (this._ContentManager.Content.clientHeight){
            this._locked = true;
            this._ContentManager.Redraw(Options);
            setTimeout(()=>{
                this._locked = false;
                //this._t = window.performance.now() - this._t;
                //r = window.performance.now() - r;
                //console.log(`[Chart.Performance] ${Math.round(r)}ms (init:${Math.round(this._t)}ms)`)
            })
        }
    }
    Refresh(Options){
        if (!this._ContentManager.Options.Graph && !this._ContentManager.Options.Draws)
            return this._ContentManager.Redraw(Options);
        this._locked = true;
        this._ContentManager.Refresh(Options);
        setTimeout(()=>{
            this._locked = false;
        })
        //
        // this._ContentManager.Refresh();
        //
        // setTimeout(()=>{
        //     this._t = window.performance.now() - this._t;
        //     r = window.performance.now() - r;
        //     console.log(`[Chart.Performance] ${Math.round(r)}ms (init:${Math.round(this._t)}ms)`)
        // }, 0)
    }
    // get isGraph(){
    //     return Lure._Core.Chart.Intitializer.Type.Graph.indexOf(this.Options.Type) > -1
    // }
    SerieSwitch(SeriesNumber, SectorNumber){
        let Series = this.Options.Series[SeriesNumber];
        let LegendID = `legend-ch-${this._ContentManager.ID}-${SeriesNumber}`;
        let isChecked;
        if (Series.Type === 'pie' || Series.Type === 'ring'){
            LegendID = `legend-ch-${this._ContentManager.ID}-${SeriesNumber}-${SectorNumber}`;
            isChecked = !this.Options.Series[SeriesNumber].Visibles[SectorNumber];
            this.Options.Series[SeriesNumber].Visibles[SectorNumber] = isChecked;
        }
        else{
            isChecked = !this.Options.Series[SeriesNumber].Visible;
            this.Options.Series[SeriesNumber].Visible = isChecked;
        }
        let Checkbox = document.getElementById(LegendID);
        if (Checkbox)
            Checkbox.checked = isChecked;
        this.Refresh({Animation:false});
    }
    get Series(){
        return this.Options.Series;
    }
    set Series(se){
        this.Options.Series = se;
        Lure._Core.Chart.Intitializer.GetSeries(this.Options);
    }
    /**
     * @param {LureChartConstructor} R
     */
    constructor(R){
        this._t = window.performance.now();
        if (R.Disabled)
            return;

        this._locked = false;
        this.Target = Lure.Select(R.Target);
        Lure._Core.Chart.Intitializer.InitR.call(this, R);

        // if (this.Options.Height === 'auto' && this.Target.clientHeight === 0)
        //     this.Target.style.height = Lure._Core.Chart.Intitializer.Default.R.Height + 'px';

        if (this.isGraph)
            this._ContentManager = new Lure._Core.Chart.ChartContentGraph(this);
        else
            this._ContentManager = new Lure._Core.Chart.ChartContentDraw(this);


        if (R.Responsible){
            //wait 4 render
            setTimeout(()=>{
                this.Listener = new Lure.Listener({
                    Target: this._ContentManager.Content,
                    Freq: 50,
                    Delay: 50,
                    OnEvent: ()=>{
                        if (this.Listener.Height > 0 && !this._locked)
                            this.Redraw({Animation: false});
                    }
                });
                this.Listener.Run();
            })
        }
        if (R.DrawAfterInit)
        {
            this.Redraw();
            this.Redraw(); //TODO fix this fuck (cuz wrong svg height compute)
        }
    }
};








//# sourceMappingURL=lure.full.js.map
