<template>
    <div class="datepicker">
        <input @click.stop="show=!show" :value="current | dateFormat" type="text" readonly>
        
        <div v-if="show" class="datepicker-wrap">
            <div class="datepicker-header" @click.stop="">
                <span @click.stop="switchMonth(-1)" class="datepicker-header-btn datepicker-header-btn-pre">&lt;</span>
                <span class="datepicker-header-month">
                    {{select.year}} - {{select.month}}
                </span>
                <span @click.stop="switchMonth(1)" class="datepicker-header-btn datepicker-header-btn-next">&gt;</span>
            </div>
            <div class="datepicker-content">
                <table>
                    <thead>
                        <th>Sun.</th>
                        <th>Mon.</th>
                        <th>Tues.</th>
                        <th>Wed.</th>
                        <th>Thur.</th>
                        <th>Fri.</th>
                        <th>Sat.</th>
                    </thead>
                    <tbody>
                        <tr v-for="week of list">
                            <td v-for="weekday of week" @click="pick(weekday)" :class="{'disable': weekday.disable, 'active': !weekday.disable && weekday.text == current.date&& select.month == current.month && select.year == current.year}">
                                {{weekday.text}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'date-picker',
    props: {
        moment: {
            type: Number,
            default() {
                return new Date().getTime()
            }
        },
        minDate: {
            type: Number,
            default: 1
        },
        maxDate: {
            type: Number,
            default: 10
        },
        restDays: {
            type: Array,
            default() {
                return []
            }
        },
    },
    data() {
        return {
            show: false,    
            current: '',    
            select: {       
                year: '',
                month: '',
                date: '',
                day: ''
            },
            currentMonthFirstDay: null, 
            currentMonthEndDate: null,  
            currentMonthEndDay: null,   
            lastMonthEndDate: null,     
            list: [],   
        }
    },
    computed: {
        startDay: function() {
            let startDay = new Date(this.moment);
            startDay.setDate(startDay.getDate()-1+this.minDate);
            return startDay;
        },
        endDay: function() {
            let endDay = new Date(this.moment);
            endDay.setDate(endDay.getDate()+this.maxDate+this.restDays.length);
            return endDay;
        }
    },
    watch: {
        select: {
            handler: function(newVal) {
                let pre;
                if (newVal.month == 1) {
                    pre = new Date(newVal.year - 1, 12, 0);
                } else {
                    pre = new Date(newVal.year, newVal.month - 1, 0);
                }
                this.lastMonthEndDate = pre.getDate();
                this.list = this.getDateList();    
            },
            deep: true
        },
        current: function() {
            this.show = false;
        },
    },
    created: function() {
        let vm = this;
        let initDate = new Date(this.moment+86400000*this.minDate);
        function _restDate(){
            let rest = false;
            for (let restDay of vm.restDays) {
                restDay = restDay.split('-');
                if(initDate.getFullYear()==restDay[0] && initDate.getMonth()==restDay[1]-1 && initDate.getDate()==restDay[2]){
                    initDate = new Date(initDate.getTime()+86400000);
                    rest = true;
                }
            }; 
            if (rest) _restDate();
        }
        _restDate();
        vm.transform(initDate.getTime());

        vm.complete();
    },
    filters: {
        dateFormat: function(val) {
             if (!val) return '';
             return `${val.year}-${val.month}-${val.date}`.replace(/\d+/g, (a) => {
                 return (a.length === 4) ? a : ((a.length === 2) ? a : ('0' + a))
             })
        }
    },
    methods: {
        transform: function(time) {
            const date = new Date(time);
            this.select.year = date.getFullYear();
            this.select.month = date.getMonth() + 1;
            this.select.date = date.getDate();
            this.select.day = date.getDay();
            this.currentMonthFirstDay = new Date(this.select.year, this.select.month - 1, 1, 0).getDay();
            this.currentMonthEndDate = new Date(this.select.year, this.select.month, 0).getDate();
            this.currentMonthEndDay = new Date(this.select.year, this.select.month, 0).getDay();
        },
        getDateList: function() {
            let dateList = [];
            // Last Month
            let temp = this.lastMonthEndDate - (this.currentMonthFirstDay - 1);
            for (temp; temp <= this.lastMonthEndDate; temp++) {
                dateList.push({
                    text: temp,
                    disable: true
                })
            }
            // This Month
            let y = this.select.year;
            let m = this.select.month;
            if (m >= 1 && m <= 9)  m = "0" + m;
            for (temp = 1; temp <= this.currentMonthEndDate; temp++) {            
                let disable = true;
                // delivery day
                let d = temp;
                if (d >= 1 && d <= 9)  d = "0" + d;
                let thisDate = new Date(y,m-1,d);
                if (thisDate>this.startDay && thisDate<this.endDay) disable = false;
                // rest day
                let thisDay = y + '-' + m + '-' + d;
                for (let restDay of this.restDays) {
                    if (thisDay == restDay) disable = true;
                }

                dateList.push({
                    text: temp,
                    disable: disable
                });
            }
            // Next Month
            const leftDays = this.currentMonthEndDate - (7 - this.currentMonthFirstDay)
            const nextDays = 7 - (leftDays % 7);
            for (temp = 1; temp <= nextDays; temp++) {
                dateList.push({
                    text: temp,
                    disable: true
                })
            }

            return this.sliceWeekArr(dateList);
        },
        sliceWeekArr: function(array) {
            var result = [];
            for (var x = 0; x < Math.ceil(array.length / 7); x++) {
                var start = x * 7;
                var end = start + 7;
                result.push(array.slice(start, end));
            }
            return result;
        },
        switchMonth: function(n) {
            let year = this.select.year
            if (n===-1) {
                const pre = this.select.month === 1 ? 12 : this.select.month - 1
                if (pre === 12) {
                    this.transform(new Date(year - 1, pre - 1, this.select.date))
                } else {
                    this.transform(new Date(year, pre - 1, this.select.date))
                }
            } else {
                const next = this.select.month === 12 ? 1 : this.select.month + 1
                if (next === 1) {
                    this.transform(new Date(year + 1, next - 1, this.select.date))
                } else {
                    this.transform(new Date(year, next - 1, this.select.date))
                }
            }
        },
        pick: function(day) {
            if (!day.disable) {
                this.transform(new Date(this.select.year, this.select.month - 1, parseInt(day.text)));
                this.complete();
            }
        },
        complete: function() {
            this.$emit('picked', this.select.year, this.select.month, this.select.date)
            this.current = {
                year: this.select.year,
                month: this.select.month,
                date: this.select.date
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .datepicker {

        .datepicker-wrap {
            width: 500px;
            padding-bottom: 20px;
            z-index: 46;
            background-color: #fff;

            .datepicker-header {
                padding: 0px 15px;
                font-size: 16px;
                text-align: center;
                line-height: 44px;
                border-bottom: 1px solid #ff0;

                .datepicker-header-btn-pre {
                    float: left;
                }
                .datepicker-header-btn-next {
                    float: right;
                }
                .datepicker-header-month {
                    color: #333;
                    font-weight: 700;
                }
            }
            .datepicker-content {
                position: relative;

                table {
                    width: 100%;
                    border-collapse: collapse;

                    thead {
                        line-height: 30px;
                        font-size: 12px;
                        color: #333;
                    }
                    tbody {
                        tr {
                            line-height: 28px;
                            td {
                                font-size: 12px;
                                text-align: center;
                                &.active, &.active:hover {
                                    color: #fff;
                                    background: #ff0;
                                }
                                &.disable {
                                    color: #999;
                                }
                            }
                            td:hover {
                                background: #eee;
                            }
                        }
                    }
                }
            }
        }
    }
</style>