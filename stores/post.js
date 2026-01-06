import { defineStore, acceptHMRUpdate } from 'pinia'

export const usePost = defineStore('post', () => {
    const { $api } = useNuxtApp()
    const { fetchFavorites, isFollowed} = useFavorite()
    const posts = ref([])
    const loading = ref(false)
    const errors = ref({})

    const form = reactive({
        title: '',
        body: ''
    })

    onMounted(() => {
        fetchFavorites()
    })

    function clearForm() {
        form.title = ''
        form.body = ''
        errors.value = {}
    }

    async function fetchPosts() {
        loading.value = true
        try {
            const response = await $api.get('posts')
            posts.value = response.data.map(post => {
                post.user.isFollowed = isFollowed(post.user.id)
                return post
            })
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    async function createPost() {
        loading.value = true
        errors.value = {}

        try {
            const response = await $api.post('posts', {
                title: form.title,
                body: form.body
            })
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