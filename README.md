# vue-delivery-datepicker
A delivery date picker component of Vue 2.x

### Deom
[Demo](https://oonne.github.io/vue-delivery-datepicker/)


### How to start
* install dependencies
> npm install

* run server
> npm run test

* browse 'localhost:3000'


### Description

``` javascript
<DatePicker v-on:picked="picked" />
```

### Props
* moment: - timestamp - Now's the time, default return new Date().getTime(),

* minDate: - int - The minimum delay days of delivery, default 1,

* maxDate: - int - The maximum delay days of delivery, default 10,

* restDays: - array - The dates cannot be shipped, default [], example: ['2017-06-30', '2017-07-01'].


