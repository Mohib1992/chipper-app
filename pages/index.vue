<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const post = usePost()
await post.fetchPosts()
</script>

<template>
  <PostForm v-if="!user.isGuest" />
  <div class="grid gap-16">
    <PostItem v-for="item in post.posts" :key="item.id" :post="item" />
  </div>
</template>
