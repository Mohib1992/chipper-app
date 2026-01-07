import { defineStore, acceptHMRUpdate } from 'pinia'

export const usePost = defineStore('post', () => {
    const { $api } = useNuxtApp()
    const config = useRuntimeConfig()
    const { fetchFavorites, isFollowed, isPostFavorite } = useFavorite()
    const posts = ref([])
    const loading = ref(false)
    const errors = ref({})
    const newPostsCount = ref(0)
    const unSyncedPosts = ref([])

    const form = reactive({
        title: '',
        body: '',
        images: null
    })

    onMounted(() => {
        fetchFavorites()
    })

    function clearForm() {
        form.title = ''
        form.body = ''
        form.images = null
        errors.value = {}
    }

    async function checkNewPosts() {
        const response = await $api.get('posts')
        unSyncedPosts.value = response.data.filter(p => {
            return !posts.value.some(post => post.id === p.id)
        })
        newPostsCount.value = unSyncedPosts.value.length
    }

    async function synchPosts() {
        unSyncedPosts.value.forEach(post => {
            post.user.isFollowed = isFollowed(post.user.id)
            post.isFavorite = isPostFavorite(post.id)
            post.images = post.images.map(image => fixImageUrl(image))
        })
        posts.value = [...unSyncedPosts.value, ...posts.value]
        unSyncedPosts.value = []
        newPostsCount.value = 0
    }

    function hasNewPosts() {
        return newPostsCount.value > 0
    }

    async function fetchPosts() {
        loading.value = true
        try {
            const response = await $api.get('posts')
            posts.value = response.data.map(post => {
                post.user.isFollowed = isFollowed(post.user.id)
                post.isFavorite = isPostFavorite(post.id)
                post.images = post.images.map(image => fixImageUrl(image))
                return post
            })
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    function fixImageUrl(image) {
        const url = typeof image === 'string' ? image : (image?.url || '')
        return url.replace('http://localhost', config.public.API_URL.replace('/api', ''))
    }

    async function createPost() {
        loading.value = true
        errors.value = {}

        try {
            const formData = new FormData()
            formData.append('title', form.title)
            formData.append('body', form.body)
            if (form.images) {
                formData.append('images[]', form.images)
            }

            const response = await $api.post('posts', formData)
            response.data.images = response.data.images.map(image => fixImageUrl(image))
            posts.value.unshift(response.data)

            clearForm()
        } catch (e) {
            if (e.response?._data?.errors) {
                errors.value = e.response._data.errors
            }
        } finally {
            loading.value = false
        }
    }

    return {
        newPostsCount,
        hasNewPosts,
        checkNewPosts,
        synchPosts,
        posts,
        loading,
        form,
        errors,
        fetchPosts,
        createPost,
        clearForm
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePost, import.meta.hot))
}