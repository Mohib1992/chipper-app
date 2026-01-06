<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const post = usePost()
const { toggleFollow, toggleFavorite } = useFavorite()
post.fetchPosts()

function handleToggleFollow(user) {
    toggleFollow(user)
}

function handleToggleFavorite(post) {
    toggleFavorite(post)
}

</script>

<template>
  <PostForm v-if="!user.isGuest" />
  <div class="grid gap-16">
    <PostItem v-for="item in post.posts" 
              :key="item.id" 
              :user="user.data" 
              :post="item" 
              @toggleFollow="handleToggleFollow" 
              @toggleFavorite="handleToggleFavorite" />
  </div>
</template>
