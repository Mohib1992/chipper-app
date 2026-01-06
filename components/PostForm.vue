<script setup>
const post = usePost()
</script>

<template>
  <form class="grid gap-4 mb-16" @submit.prevent="post.createPost()">
    <div>
      <input v-model="post.form.title" placeholder="Post title" :class="{ 'border-red-500': post.errors.title }"
        class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base">
      <span v-if="post.errors.title" class="text-red-500 text-sm">
        {{ post.errors.title[0] }}
      </span>
    </div>
    <div>
      <textarea v-model="post.form.body" placeholder="What is happening?!"
        :class="{ 'border-red-500': post.errors.body }"
        class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"></textarea>
      <span v-if="post.errors.body" class="text-red-500 text-sm">
        {{ post.errors.body[0] }}
      </span>
    </div>
    <button :disabled="post.loading" class="bg-blue-600 text-white px-8 py-4 rounded-lg disabled:opacity-50">
      {{ post.loading ? 'Posting...' : 'Post' }}
    </button>
  </form>
</template>