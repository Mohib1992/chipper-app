<script setup>
const post = usePost()
const { compressImage, isCompressing } = useImageUpload()
const { showErrorModal } = useHelpers()
const maxImageSize = 2080
const fileInput = ref(null)
const previewUrl = ref(null)

async function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) {
    post.form.images = null
    previewUrl.value = null
    return
  }

  if (file.size > maxImageSize) {
    showErrorModal('Error','Image size should be less than 2MB')
    fileInput.value.value = ''
    return
  }

  if (!file.type.startsWith('image/')) {
    showErrorModal('Error','Please select an image file')
    fileInput.value.value = ''
    return
  }

  const compressedFile = await compressImage(file)
  post.form.images = compressedFile

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  previewUrl.value = URL.createObjectURL(compressedFile)
}

async function handleSubmit() {
  await post.createPost()
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}
</script>

<template>
  <form class="grid gap-4 mb-16" @submit.prevent="handleSubmit">
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
    <div>
      <input type="file" accept="image/*" @change="handleFileChange" ref="fileInput"
        :class="{ 'border-red-500': post.errors.images }"
        class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base">
      <span v-if="post.errors.images" class="text-red-500 text-sm">
        {{ post.errors.images[0] }}
      </span>
    </div>
    <div v-if="previewUrl" class="relative">
      <img :src="previewUrl" alt="Post preview" class="rounded-lg w-full max-h-64 object-cover">
      <button @click="previewUrl = null; post.form.images = null; fileInput.value = ''" type="button"
        class="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <button :disabled="post.loading || isCompressing"
      class="bg-blue-600 text-white px-8 py-4 rounded-lg disabled:opacity-50">
      {{ post.loading ? 'Posting...' : (isCompressing ? 'Compressing...' : 'Post') }}
    </button>
  </form>
</template>