
// provided the asset/tag type, will return a 
// src string for relevant icon image

export default function returnAssetIcon(type) {
    let src = ''
    if (type == "Steps") {
        src = './images/assetTypes/steps.png'
    }
    if (type == "Facility") {
        src = './images/assetTypes/facilities.png'
    }
    if (type == "Project") {
        src = './images/assetTypes/projects.png'
    }
    if (type == "Retaining Wall") {
        src = './images/assetTypes/wall.png'
    }
    if (type == "Pool") {
        src = './images/assetTypes/pools.png'
    }
    if (type == "Playground") {
        src = './images/assetTypes/playground.png'
    }
    if (type == "Intersection") {
        src = './images/assetTypes/signal.png'
    }
    if (type == "Bridge") {
        src = './images/assetTypes/bridges.png'
    }
    if (type == "Court") {
        src = './images/assetTypes/courts.png'
    }
    if (type == "Playing Field") {
        src = './images/assetTypes/baseball.png'
    }
    if (type == "Park") {
        src = './images/assetTypes/parks.png'
    }
    if (type == "Street") {
        src = './images/assetTypes/street.png'
    }
    return src
}
