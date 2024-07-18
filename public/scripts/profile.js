// public/scripts/profile.js

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!confirm('Are you sure you want to delete this post?')) {
                e.preventDefault()
            }
        })
    })

    document.querySelectorAll('.unfavorite-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            if (!confirm('Are you sure you want to remove this car from favorites?')) {
                e.preventDefault()
            }
        })
    })
})
