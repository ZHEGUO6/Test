<!--提供全局的消息-->
<script setup lang="ts">
import { useMessage } from 'naive-ui'

const message = useMessage()
window.$rawMessage = message
</script>

<template></template>
