
export default function getMyProjects (allProjects, personnel, user) {
    const me = personnel.find(person => {
        return person.email == user
    })
    const myProjects = allProjects.filter (project => {
        let isMine = false
        if (project.projectManager.includes(me.title)) {
            isMine = true
        } 
        if (project.projectMembers.includes(me.title)) {
            isMine = true
        }
        if (isMine == false) {
            return false
        } else return true
    })
    return myProjects
}