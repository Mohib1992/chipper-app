<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'
const emit = defineEmits(['toggleFollow'])
const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    required: true
  }
})

const toggleFollow = () => {
  props.post.user.isFollowed = !props.post.user.isFollowed
  emit('toggleFollow', props.post.user)
}
</script>

<template>
  <div class="grid gap-3">
    <h4 class="font-bold text-lg">
      {{ post.title }}
    </h4>
    <div class="flex justify-between bg-gray-100 p-4 rounded-lg">
      <div>
        by <strong>{{ post.user.name }}</strong>
      </div>
      <button v-if="user.id !== post.user.id" @click="toggleFollow" class="font-medium bg-blue-200 text-sm px-2 rounded-full">
        {{ post.user.isFollowed ? 'Unfollow' : 'Follow' }}
      </button>
    </div>
    <p>
      {{ post.body }}
    </p>
    <button class="bg-red-200 text-red-500 flex items-center justify-center gap-2 p-4 rounded-lg">
      <HeartIcon class="h-6 stroke-current" />
      <span class="font-bold">
        Add to my favorites
      </span>
    </button>
  </div>
</template>