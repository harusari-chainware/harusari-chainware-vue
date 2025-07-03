import { sidebarMap } from '@/constants/sidebarMap'

// 모든 소분류에 대해 권한 없는 사용자는 중분류 안보이도록
export function getFilteredSidebarMap(userRole) {
    const filteredMap = {}

    for (const [groupName, subGroups] of Object.entries(sidebarMap)) {
        // 중분류 필터링
        const filteredSubGroups = subGroups
            .map(subGroup => {
                const filteredItems = subGroup.items.filter(item =>
                    item.roles.includes(userRole)
                )

                return filteredItems.length > 0
                    ? { ...subGroup, items: filteredItems }
                    : null
            })
            .filter(Boolean)

        if (filteredSubGroups.length > 0) {
            filteredMap[groupName] = filteredSubGroups
        }
    }

    return filteredMap
}
