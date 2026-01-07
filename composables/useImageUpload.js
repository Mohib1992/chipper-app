export const useImageUpload = () => {
    const isCompressing = ref(false)

    const compressImage = async (file, options = {}) => {
        const {
            maxWidth = 1200,
            maxHeight = 1200,
            quality = 0.8
        } = options

        if (!file || !file.type.startsWith('image/')) {
            return file
        }

        isCompressing.value = true

        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (event) => {
                const img = new Image()
                img.src = event.target.result
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    let width = img.width
                    let height = img.height

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width
                            width = maxWidth
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height
                            height = maxHeight
                        }
                    }

                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0, width, height)

                    canvas.toBlob((blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        })
                        isCompressing.value = false
                        resolve(compressedFile)
                    }, file.type, quality)
                }
                img.onerror = (e) => {
                    isCompressing.value = false
                    reject(e)
                }
            }
            reader.onerror = (e) => {
                isCompressing.value = false
                reject(e)
            }
        })
    }

    return {
        compressImage,
        isCompressing
    }
}
