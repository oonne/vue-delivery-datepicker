<template>
	<div>
		<h4>Delivery date picker</h4>
		<div style="width: 400px;">
			<datepicker v-on:picked="picked"></datepicker>
		</div>
	</div>
</template>
<script>
	import datepicker from './datepicker.vue'
	export default {
		data() {
			return {}
		},
		methods: {
			picked(y, m, d) {
				console.log(`Delivery date: ${y}-${m}-${d}`)
			}
		},
		components: {
			datepicker
		}
	}
</script>