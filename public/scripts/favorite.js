

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.favorite-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const formData = new FormData(form)
            const action = form.getAttribute('action')
            const method = form.getAttribute('method')

            try {
                const response = await fetch(action, {
                    method: method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })

                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }

                
                const button = form.querySelector('button')
                if (button.classList.contains('favorited')) {
                    button.classList.remove('favorited')
                    button.textContent = 'Favorite'
                } else {
                    button.classList.add('favorited')
                    button.textContent = 'Favorited'
                }
            } catch (error) {
                console.error('Error:', error)
            }
        })
    })
})
