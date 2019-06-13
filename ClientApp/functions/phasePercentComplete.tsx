// provided all relevant subphases and milestones,
// calculates percent complete of phase, and percent remaining

export default function phasePercentComplete(milestones, subphases) {
  let totalTaskValue = 0;
  let completedTaskValue = 0;
  milestones.forEach(function(milestone) {
    totalTaskValue = totalTaskValue + 100;
    if (milestone.percentComplete == 100) {
      completedTaskValue = completedTaskValue + 100;
    }
  });
  subphases.forEach(function(subphase) {
    totalTaskValue = totalTaskValue + 100;
    completedTaskValue = completedTaskValue + subphase.percentComplete;
  });
  let percentComplete = (completedTaskValue / totalTaskValue) * 100;
  return percentComplete;
}
