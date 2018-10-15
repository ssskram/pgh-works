
// fund/program filter

import * as moment from 'moment'

export default function filterFunds(funds, filters) {
    const filtered = funds.filter(fund => {
        if (filters.fundName) {
            if (!fund.fundName.includes(filters.fundName)) {
                return false
            }
        }
        if (filters.fundYear) {
            if (!fund.fundYear.includes(filters.fundYear)) {
                return false
            }
        }
        if (filters.fundType) {
            if (!fund.fundType.includes(filters.fundType)) {
                return false
            }
        }
        if (filters.startDate && filters.endDate) {
            if (fund.expirationDate) {
                const start = moment(filters.startDate)
                const end = moment(filters.endDate)
                const exp = moment(fund.expirationDate)
                const expIsBetween  = exp.isBetween(start, end)
                if (expIsBetween == false) {
                    return false
                }
            }
        }
        return true
    })
    return filtered
}