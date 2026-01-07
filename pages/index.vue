<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const post = usePost()
const favorite = useFavorite()
const { reloadTimer, startInterval, interval } = useSyncPosts(30)
post.fetchPosts()

function handleToggleFollow(user) {
  favorite.toggleFollow(user)
}

function handleToggleFavorite(post) {
  favorite.toggleFavorite(post)
}

onMounted(() => {
    startInterval()
})

onBeforeUnmount(() => {
    clearInterval(interval)
})
</script>

<template>
  <div class="mb-4 text-right text-sm text-gray-500">
    Checking for new posts in: <span class="font-mono">{{ reloadTimer }}s</span>
  </div>
  <PostForm v-if="!user.isGuest" />
  <div v-if="post.hasNewPosts()" class="grid mb-6">
    <button @click="post.synchPosts()" class="bg-blue-600 text-white px-8 py-4 rounded-lg disabled:opacity-50">Load New
      Posts ({{ post.newPostsCount }})</button>
  </div>
  <div class="grid gap-16">
    <PostItem v-for="item in post.posts" :key="item.id" :user="user.data" :post="item"
      @toggleFollow="handleToggleFollow" @toggleFavorite="handleToggleFavorite" />
  </div>
</template>
