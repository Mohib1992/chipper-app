<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const post = usePost()
const { toggleFollow } = useFavorite()
post.fetchPosts()

function handleToggleFollow(user) {
    toggleFollow(user)
}

</script>

<template>
  <PostForm v-if="!user.isGuest" />
  <div class="grid gap-16">
    <PostItem v-for="item in post.posts" :key="item.id" :user="user.data" :post="item" @toggleFollow="handleToggleFollow" />
  </div>
</template>
