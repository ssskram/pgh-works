
// provided the project, list of personnel, and logged in user,
// this returns whether user has write access to project & phases

export default function canEdit(project, personnel, user) {
    let canEdit = false
    const me = personnel.filter(person => {
        return person.email == user
    })
    if (me.length > 0) {
        if (project) {
            if (project.projectManager.includes(me.title)) {
                canEdit = true
            }
            if (project.projectMembers.includes(me.title)) {
                canEdit = true
            }
            if (canEdit == false) {
                return false
            }
        }
    }
    return canEdit
}

