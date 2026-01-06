import { defineStore, acceptHMRUpdate } from 'pinia'

export const useFavorite = defineStore('favorite', () => {
    const { $api } = useNuxtApp()
    const favorites = ref([])

    const isFollowed = (userId) => {
        return favorites.value.users.some(user => user.id === userId)
    }

    const isPostFavorite = (postId) => {
        return favorites.value.posts.some(post => post.id === postId)
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

    async function toggleFavorite(post) {
        const postId = post.id
        const favorited = isPostFavorite(postId)

        try {
            if (favorited) {
                await $api.delete(`posts/${postId}/favorite`)
                favorites.value.posts = favorites.value.posts.filter(p => p.id !== postId)
            } else {
                await $api.post(`posts/${postId}/favorite`)
                favorites.value.posts.push(post)
            }
        } catch (e) {
            console.error(e)
        }
    }

    return {
        favorites,
        fetchFavorites,
        toggleFollow,
        toggleFavorite,
        isFollowed,
        isPostFavorite,
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFavorite, import.meta.hot))
}