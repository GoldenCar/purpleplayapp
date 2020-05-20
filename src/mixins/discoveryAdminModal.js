export default {
    methods: {
        showPasswordPrompt() {
            this.$q.dialog({
                title: 'Enter the password',
                message: 'Only for admin users',
                prompt: {
                    model: '',
                    type: 'text' // optional
                },
                cancel: true,
                color: 'secondary'
            }).then(data => {
                localStorage.setItem('admin-password', data);
            }).catch(() => {
                // cancel click handler
            })
        },
    }
}