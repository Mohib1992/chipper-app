import { defineStore, acceptHMRUpdate } from 'pinia'

export const useFavorite = defineStore('favorite', () => {
    const { $api } = useNuxtApp()
    const favorites = ref([])

    const isFollowed = (userId) => {
        return favorites.value.users.some(user => user.id === userId)
    }

    async function fetchFavorites() {
        try {
            const response = await $api.get('favorites')
            favorites.value = response.data
        } catch (e) {
            console.error(e)
        }
    }

    async function toggleFollow(user) {
        const userId = user.id
        const following = isFollowed(userId)

        try {
            if (following) {
                await $api.delete(`users/${userId}/favorite`)
                favorites.value.users = favorites.value.users.filter(u => u.id !== userId)
            } else {
                await $api.post(`users/${userId}/favorite`)
                favorites.value.users.push(user)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return {
        favorites,
        fetchFavorites,
        toggleFollow,
        isFollowed,
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFavorite, import.meta.hot))
}