// takes the logged in user & personnel store
// returns true if user is part of personnel, false otherwise
// (if they're a random)

export default function isPersonnel(user, personnel) {
  let isPersonnel = false;
  const me = personnel.filter(person => {
    return person.email == user;
  });
  if (me.length > 0) {
    isPersonnel = true;
  }
  return isPersonnel;
}
