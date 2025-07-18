<template>
    <div v-if="visible" class="modal-overlay" @click.self="null">
        <div class="modal-content">
            <p class="modal-message">{{ message }}</p>
            <button @click="handleConfirm">확인</button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

const visible = ref(false)
const message = ref('')
let resolver = null

function open(msg) {
    message.value = msg
    visible.value = true
    return new Promise((resolve) => {
        resolver = resolve
    })
}

function handleConfirm() {
    visible.value = false
    message.value = ''
    if (resolver) {
        resolver()
        resolver = null
    }
}

defineExpose({ open })
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    max-width: 300px;
    width: 100%;
}

button {
    margin-top: 12px;
    padding: 8px 16px;
    background: #3aaed8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background: #1e8bc3;
}

.modal-message {
    white-space: pre-line;
}
</style>