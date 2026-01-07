
export default function useSyncPosts({ timer = 30 }) {
    const post = usePost()
    const reloadTimer = ref(timer)
    let interval

    function startInterval() {
        interval = setInterval(() => {
            reloadTimer.value--
            if (reloadTimer.value === 0) {
                post.checkNewPosts()
                reloadTimer.value = timer
            }
        }, 1000)
    }

    onBeforeUnmount(() => {
        clearInterval(interval)
    })

    return {
        interval,
        reloadTimer,
        startInterval
    }
}   