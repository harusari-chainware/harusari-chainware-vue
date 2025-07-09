<template>
    <div class="filter-group">
        <label class="filter-label">{{ label }}</label>
        <input
                ref="input"
                class="filter-date"
                type="text"
                placeholder="날짜 범위 선택"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import '@/assets/css/flatpickr-custom.css'
import { Korean } from 'flatpickr/dist/l10n/ko.js'

const props = defineProps({
    label: String,
    modelValue: Object // { start: '', end: '' }
})
const emit = defineEmits(['update:modelValue'])

const input = ref(null)
let fpInstance = null

// 한국시간 (KST)으로 날짜 변환 함수
const convertToKST = (date) => {
    const kstDate = new Date(date);
    const options = { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' };
    return kstDate.toLocaleDateString('ko-KR', options).replace(/\./g, '').replace(/\s/g, '-');
};

onMounted(() => {
    // flatpickr 초기화
    fpInstance = flatpickr(input.value, {
        mode: 'range',
        dateFormat: 'Y-m-d',
        defaultDate: [props.modelValue?.start, props.modelValue?.end],
        locale: Korean,  // 한국어 로케일 설정
        onChange: (selectedDates) => {
            // 날짜 범위 선택 시
            if (selectedDates.length === 1) {
                // 첫 번째 날짜만 선택되었을 때 종료 날짜 비우기
                emit('update:modelValue', {
                    start: selectedDates[0] ? convertToKST(selectedDates[0]) : '',
                    end: ''  // 종료 날짜를 비움
                })
            } else if (selectedDates.length === 2) {
                // 날짜가 2개 모두 선택되었을 때
                // 종료 날짜가 시작 날짜보다 앞선 경우 시작 날짜와 종료 날짜를 스왑
                let [start, end] = selectedDates
                if (start > end) {
                    // 시작 날짜가 종료 날짜보다 클 경우, 두 날짜를 스왑
                    [start, end] = [end, start]
                }
                emit('update:modelValue', {
                    start: start ? convertToKST(start) : '',
                    end: end ? convertToKST(end) : ''
                })
            }
        }
    })
})

watch(() => props.modelValue, (newVal) => {
    const { start, end } = newVal || {}
    if (fpInstance) {
        // flatpickr의 selectedDates를 Vue 데이터와 동기화
        const currentDates = fpInstance.selectedDates.map(d => convertToKST(d))
        if (start !== currentDates[0] || end !== currentDates[1]) {
            fpInstance.setDate([start, end], false)  // 선택된 날짜를 Vue 데이터로 업데이트
        }
    }
})
</script>

<style scoped>
@import '@/assets/css/filter-common.css';
</style>