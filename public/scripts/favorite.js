document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const carId = event.target.closest('.favorite-form').dataset.id;

            try {
                const response = await fetch(`/cars/${carId}/favorite`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                
                event.target.textContent = data.isFavorited ? 'Unfavorite' : 'Favorite';
                event.target.classList.toggle('favorited', data.isFavorited);
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to update favorite status. Please try again.');
            }
        });
    });
});