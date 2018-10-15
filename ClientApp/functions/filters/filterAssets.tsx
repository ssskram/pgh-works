
// asset filter

export default function filterAssets (assets, filters) {
    const filtered = assets.filter(asset => {
        if (filters.assetName) {
            if (!asset.assetName.toLowerCase().includes(filters.assetName.toLowerCase())) {
                return false
            }
        }   
        if (filters.assetType) {
            if (!asset.assetType.includes(filters.assetType)) {
                return false
            }
        }
        return true
    })
    return filtered
}