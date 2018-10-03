
export default function canEdit(project, personnel, user) {
    const me = personnel.find(person => {
        return person.email == user
    })
    let canEdit = false
    if (project.projectManager.includes(me.title)) {
        canEdit = true
    }
    if (project.projectMembers.includes(me.title)) {
        canEdit = true
    }
    if (canEdit == false) {
        return false
    }
    return canEdit
}

