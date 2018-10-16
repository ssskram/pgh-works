
// provided the asset/tag type, will return a 
// src string for relevant icon image

const steps = require('./../images/assetTypes/steps.png')
const facilities = require('./../images/assetTypes/facilities.png')
const projects = require('./../images/assetTypes/projects.png')
const wall = require('./../images/assetTypes/wall.png')
const pools = require('./../images/assetTypes/pools.png')
const playground = require('./../images/assetTypes/playground.png')
const signal = require('./../images/assetTypes/signal.png')
const bridge = require('./../images/assetTypes/bridges.png')
const court = require('./../images/assetTypes/courts.png')
const baseball = require('./../images/assetTypes/baseball.png')
const park = require('./../images/assetTypes/parks.png')
const street = require('./../images/assetTypes/street.png')

export default function returnAssetIcon(type) {
    let src = ''
    if (type == "Steps") {
        src = steps as string
    }
    if (type == "Facility") {
        src = facilities as string
    }
    if (type == "Project") {
        src = projects as string
    }
    if (type == "Retaining Wall") {
        src = wall as string
    }
    if (type == "Pool") {
        src = pools as string
    }
    if (type == "Playground") {
        src = playground as string
    }
    if (type == "Intersection") {
        src = signal as string
    }
    if (type == "Bridge") {
        src = bridge as string
    }
    if (type == "Court") {
        src = court as string
    }
    if (type == "Playing Field") {
        src = baseball as string
    }
    if (type == "Park") {
        src = park as string
    }
    if (type == "Street") {
        src = street as string
    }
    return src
}
