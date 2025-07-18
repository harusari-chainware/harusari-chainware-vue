<template>
    <div class="warehouse-box">
        <h2>창고 정보</h2>

        <div class="form-group">
            <label for="warehouseName">창고 이름</label>
            <input
                    type="text"
                    id="warehouseName"
                    v-model="form.warehouseName"
                    placeholder="창고 이름 입력"
            />
        </div>

        <div class="form-group">
            <label for="zipcode">우편번호</label>
            <div class="zipcode-group">
                <input
                        type="text"
                        id="zipcode"
                        v-model="form.zipcode"
                        placeholder="우편번호"
                        readonly
                />
                <button type="button" class="address-button" @click="execDaumPostcode">
                    주소 검색
                </button>
            </div>
        </div>

        <div class="form-group">
            <label for="addressRoad">도로명 주소</label>
            <input
                    type="text"
                    id="addressRoad"
                    v-model="form.addressRoad"
                    placeholder="도로명 주소 입력"
                    readonly
            />
        </div>

        <div class="form-group">
            <label for="addressDetail">상세 주소</label>
            <input
                    type="text"
                    id="addressDetail"
                    v-model="form.addressDetail"
                    placeholder="상세 주소 입력"
            />
        </div>
    </div>
    <ConfirmModal ref="alertModal" />
</template>

<script setup>
import {defineProps, nextTick, ref} from 'vue';
import ConfirmModal from "@/features/member/mypage/components/ConfirmModal.vue";

const props = defineProps({
    form: Object,
});

const alertModal = ref(null);

function execDaumPostcode() {
    if (!window.daum || !window.daum.Postcode) {
        alertModal.value.open('주소 검색 서비스를 불러오지 못했습니다. 네트워크 상태를 확인하거나 새로고침해 주세요.');
        return;
    }

    new window.daum.Postcode({
        oncomplete: function (data) {
            props.form.zipcode = data.zonecode;
            props.form.addressRoad = data.roadAddress || data.jibunAddress;
            nextTick(() => document.getElementById('addressDetail')?.focus());
        },
    }).open();
}
</script>

<style scoped>
.warehouse-box {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    width: 100%;
    max-width: 530px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.form-group {
    margin-bottom: 10px;
}

h2 {
    text-align: center;
    margin-bottom: 10px;
    font-weight: 700;
    color: #2e384d;
}

label {
    font-size: 0.9rem;
    margin-bottom: 4px;
    display: block;
    font-weight: 600;
    color: #333;
}

input {
    width: 100%;
    padding: 10px 12px;
    font-size: 0.9rem;
    border: 1px solid #ccd1d7;
    border-radius: 6px;
}

input:focus {
    border-color: #3aaed8;
    outline: none;
}

.zipcode-group {
    display: flex;
    gap: 6px;
}

.zipcode-group input {
    flex: 1;
}

.address-button {
    padding: 0 10px;
    background: #3aaed8;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
}

.address-button:hover {
    background: #1e8bc3;
}
</style>
