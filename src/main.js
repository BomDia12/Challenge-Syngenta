/**
 * @param {string} input the input with the client type and the dates of the stay
 * @returns {object} object with the type of client (`string`) and 
 * an array with all the dates of the stay
 */
function descontructInput (input) {
    let [type, bruteDates] = input.split(": ")
    let dates = bruteDates.split(", ")

    return {type, dates}
}

/**
 * @param {string} date the date string with the weekday inbetween paranthesis
 * @returns {string} the weekday of the selected date
 */
function getWeekdayFromDate (date) {
    return date.substring(
        date.indexOf('(') + 1, // the one is included for the `(` isn't included in the result
        date.indexOf(')')
    )
}

/**
 * @param {string} weekday the day of the week
 * @returns `bool` whether or not the day is a weekend
 */
function isWeekend (weekday) {
    if (weekday === 'sat' || weekday === 'sun') {
        return true
    }

    return false
}

/**
 * @param {string} input the input with the client type and the dates of the stay
 * @returns {object} object with the type of client (`string`) and an array of whether
 * each day of the stay is a weekend or not
 */
function processData (input) {
    let {type, dates} = descontructInput(input);
    const weekends = dates.map(date => getWeekdayFromDate(date)).map(weekday => isWeekend(weekday))
    return {type, weekends}
}

/**
 * @param {string} type the type of client, either Rewards or Regular
 * @param {bool} weekend boolean on wheter or not it's a weekend
 * @param {integer} regularWeekday price of the hotel for a regular customer on a weekday
 * @param {integer} regularWeekend price of the hotel for a regular customer on a weekend
 * @param {integer} rewardsWeekday price of the hotel for a rewards customer on a weekday
 * @param {integer} rewardsWeekend price of the hotel for a rewards customer on a weekend
 * @returns {integer} the price the customer will pay on that day
 */
function calculateDailyPrice (
    type,
    weekend,
    regularWeekday,
    regularWeekend,
    rewardsWeekday,
    rewardsWeekend,
) {
    if (type === 'Rewards') {
        if (weekend === true) {
            return rewardsWeekend
        }

        return rewardsWeekday
    }

    if (weekend === true) {
        return regularWeekend
    }

    return regularWeekday
}

/**
 * @param {string} type the type of client, either Rewards or Regular
 * @param {array} weekends array of booleans on wheter or not it's a weekend
 * @param {integer} regularWeekday price of the hotel for a regular customer on a weekday
 * @param {integer} regularWeekend price of the hotel for a regular customer on a weekend
 * @param {integer} rewardsWeekday price of the hotel for a rewards customer on a weekday
 * @param {integer} rewardsWeekend price of the hotel for a rewards customer on a weekend
 * @returns {integer} the price the customer will pay on the whole trip
 */
function calculateFullPrices (
    type,
    weekends,
    regularWeekday,
    regularWeekend,
    rewardsWeekday,
    rewardsWeekend,
) {
    let prices = weekends.map(
        weekend => calculateDailyPrice(
            type,
            weekend,
            regularWeekday,
            regularWeekend,
            rewardsWeekday,
            rewardsWeekend,
        )
    )
    // Sum of all the prices in the array
    return prices.reduce((partialSum, price) => partialSum + price, 0)
}

/**
 * @param {string} type the type of the client, should be either Regular or Reward
 * @param {array} weekends array of booleans on wheter or not it's a weekend
 * @returns the price of staying in Lakewood for this client
 */
function lakewoodPrice (type, weekends) {
    return calculateFullPrices (
        type,
        weekends,
        110,
        90,
        80,
        80,
    )
}

/**
 * @param {string} type the type of the client, should be either Regular or Reward
 * @param {array} weekends array of booleans on wheter or not it's a weekend
 * @returns the price of staying in Bridgewood for this client
 */
 function bridgewoodPrice (type, weekends) {
    return calculateFullPrices (
        type,
        weekends,
        160,
        60,
        110,
        50,
    )
}

/**
 * @param {string} type the type of the client, should be either Regular or Reward
 * @param {array} weekends array of booleans on wheter or not it's a weekend
 * @returns the price of staying in Ridgewood for this client
 */
 function ridgewoodPrice (type, weekends) {
    return calculateFullPrices (
        type,
        weekends,
        220,
        150,
        100,
        40,
    )
}

/**
 * @param {string} input string with the type of the client followed by the dates of their stay
 * @returns {string} the name of the hotel with the chepest prices and, in case of a tie, the highest rating
 */
function getCheapestHotel (input) { //DO NOT change the function's name.
    const {type, weekends} = processData(input);

    const lakewood = lakewoodPrice(type, weekends)
    const bridgewood = bridgewoodPrice(type, weekends)
    const ridgewood = ridgewoodPrice(type, weekends)

    if (ridgewood <= lakewood && ridgewood <= bridgewood) {
        return 'Ridgewood'
    }

    if ( bridgewood <= lakewood) {
        return 'Bridgewood'
    }

    return 'Lakewood'
}

exports.getCheapestHotel = getCheapestHotel
