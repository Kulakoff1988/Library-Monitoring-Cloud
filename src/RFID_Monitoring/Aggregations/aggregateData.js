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
        return {period: `day`, dayPassed: daysPassed};
    }
    return {period: `month`, dayPassed: daysPassed};
};

//
// Function for aggregate data from server by chosen period
//

/**
 *
 * @param {array} data
 * @param {Lure.Date} startDate
 * @param {Lure.Date} endDate
 * @returns {call} Chart.SetData method
 */

const aggregateData = (data, startDate, endDate) => {
    const aggregatedData = [];
    const axisXData = [];
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
            Monitoring.SetData(aggregatedData);
            Chart.SetData(aggregatedData, timeScale(axisXData));
            break;
        case `day`:
            let date = startDate;
            const groupDataByDate = data.GroupBy(item => item.DateValue);
            for (let i = 0; i <= daysPassed; i ++) {
                axisXData.push(Lure.Date(date).Format(`DD.MM.YYYY`));
                if (groupDataByDate.find(el => Lure.Date(el.Key).Int === date)) {
                    const currentData = groupDataByDate.find(el => Lure.Date(el.Key).Int === date);
                    aggregatedData.push(currentData.reduce((acc, item) => acc + item.Read_Count, 0));
                }
                else {
                    aggregatedData.push(0);
                }
                date += 86400000;
            }
            Chart.SetData(aggregatedData, axisXData);
            break;
        case `month`:
            //TODO aggregate data for month
        case `year`:
            //TODO aggregate data for year
    }
};

module.exports = aggregateData;