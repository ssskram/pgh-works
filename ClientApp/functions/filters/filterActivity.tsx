
// activity filter

export default function filterActivity (activity, filters) {
    const filtered = activity.filter(ac => {
        if (filters.phase) {
            // return all activity from phase
            return false
        }   
        if (filters.project) {
            // return all activity from project
            return false
        }   
        if (filters.user) {
            // return all activity from user
            return false
        }
        if (filters.date) {
            // return all activity on date
            return false
        }
        return true
    })
    return filtered
}