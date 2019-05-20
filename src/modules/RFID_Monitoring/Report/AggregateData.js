//Timescale for one day representation
const timeScale = (container) => {
    for (let i = 0; i <= 23; i++) {
        container.push(`${i}:00`);
    }
    return container;
};

/**
 *
 * @param {Lure.Date} startDate
 * @param {Lure.Date} endDate
 * @returns {number} `day` or `month`
 */
const getPeriodForView = (startDate, endDate) => {
    if (startDate === endDate) return {period: `inDay`};
    let daysPassed = Math.ceil((endDate - startDate) / 86400000);
    if (daysPassed < 45) {
        return {period: `day`, daysPassed};
    }
    return {period: `month`, daysPassed};
};

/**
 * @param {array} data
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {array}
 */

const GetAggregateDataForStatistics = (data, startDate, endDate) => {
    let aggregatedData = [];
    let axisX_Labels = [];
    const { period, daysPassed } = getPeriodForView(startDate, endDate);
    switch (period) {
        case `inDay`:
            data.map(el => {
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
                if (data.find(el => el.HourValue === i)) {
                    const currentData = data.find(el => el.HourValue === i);
                    aggregatedData.push(currentData);
                }
                else {
                    aggregatedData.push({Status: `inactive`, label: `Не активно`, color: `#4D4D4D`});
                }
            }
            aggregatedData = aggregatedData.reduce((acc, item) => {
                acc.push(item.Read_Count ? item.Read_Count : 0);
                return acc;
            }, []);
            axisX_Labels = timeScale(axisX_Labels);
            return { aggregatedData, axisX_Labels };
        case `day`:
            let date = startDate;
            const groupDataByDate = data.GroupBy(item => item.DateValue);
            for (let i = 0; i <= daysPassed; i++) {
                axisX_Labels.push(Lure.Date(date).Format(`DD.MM.YYYY`));
                if (groupDataByDate.find(el => Lure.Date(el.Key).Int === date)) {
                    const currentData = groupDataByDate.find(el => Lure.Date(el.Key).Int === date);
                    aggregatedData.push(currentData.reduce((acc, item) => acc + item.Read_Count, 0));
                }
                else {
                    aggregatedData.push(0);
                }
                date += 86400000;
            }
            return { aggregatedData, axisX_Labels };
        case `month`:
            const months = [`Январь`, `Февраль`, `Март`, `Апрель`, `Май`, `Июнь`, `Июль`, `Август`, `Сентябрь`, `Октябрь`, `Ноябрь`, `Декабрь`];
            const groupDataByYear = data.GroupBy(item => Lure.Date(item.DateValue).Year);
            for (let i = Lure.Date(startDate).Year; i <= Lure.Date(endDate).Year; i ++) {
                if (i === Lure.Date(startDate).Year) {
                    for (let j = Lure.Date(startDate).Month; j <= 11; j++) {
                        axisX_Labels.push({month: months[j], year: i});
                    }
                }
                else if (i === Lure.Date(endDate).Year) {
                    for (let k = 0; k <= Lure.Date(endDate).Month; k++) {
                        axisX_Labels.push({month: months[k], year: i});
                    }
                }
                else {
                    months.map(month => axisX_Labels.push({month, year: i}));
                }
            }
            for (let i = 0; i < axisX_Labels.length; i ++) {
                if (groupDataByYear.find(el => el.Key === axisX_Labels[i].year)) {
                    const currentData = groupDataByYear.find(el => el.Key === axisX_Labels[i].year)
                        .filter(el => Lure.Date(el.DateValue).Month === months.indexOf(axisX_Labels[i].month));
                    aggregatedData.push(currentData.reduce((acc, item) => acc + item.Read_Count, 0));
                }
                else {
                    aggregatedData.push(0);
                }
            }
            axisX_Labels = axisX_Labels.map(({ month, year }) => `${month}, ${year}`);
            return { aggregatedData, axisX_Labels };
        case `year`:
        //TODO aggregate data for year (if will need)
    }
};

/**
 * @param {array} data
 * @return {object} key: array
 */

const GetAggregateDataForMonitor = data => {
    const programSuccessStatus = data.reduce((acc, item) => {
        if (item.Online_Count > 58) {
            return {...acc, OK: acc.OK + 1};
        }
        if (item.Online_Count > 29 && item.Online_Count <= 58) {
            return {...acc, attention: acc.attention + 1};
        }
        else {
            return {...acc, critical: acc.critical + 1};
        }
    }, { OK: 0, attention: 0, critical: 0 });
    const dataSuccessStatus = data.reduce((acc, item) => {
        const { OK_Count, Err_Count } = item;
        if (OK_Count === 0 && Err_Count === 0) {
            return {...acc, noData: acc.noData + 1};
        }
        if (OK_Count > 0 && Err_Count === 0) {
            return {...acc, OK: acc.OK + 1};
        }
        if (OK_Count > Err_Count) {
            return {...acc, attention: acc.attention + 1};
        }
        else {
            return {...acc, critical: acc.critical + 1}
        }
    }, { noData: 0, OK: 0, attention: 0, critical: 0 });
    return {
        programStatus: [programSuccessStatus.OK, programSuccessStatus.attention, programSuccessStatus.critical],
        deviceStatus: [dataSuccessStatus.noData, dataSuccessStatus.OK, dataSuccessStatus.attention, dataSuccessStatus.critical]
    };
};

//
// Function for aggregate data from server by chosen period
//

/**
 *
 * @param {array} data
 * @param {Lure.Date} startDate
 * @param {Lure.Date} endDate
 * @returns {call} Chart.SetData, Monitoring.SetData methods
 */

const getAggregateCommonData = (data, startDate, endDate) => {
    return {
        aggregatedDataForStatistics: GetAggregateDataForStatistics(data, startDate, endDate),
        aggregatedDataForMonitor: GetAggregateDataForMonitor(data)
    };
};

module.exports = getAggregateCommonData;