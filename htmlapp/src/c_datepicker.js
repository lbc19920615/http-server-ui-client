class DatePicker {
    constructor(container) {
        this.container = container;
        this.currentDate = new Date();
        this.selectedDate = null;
        this.init();
    }

    init() {
        this.render();
    }

    /**
     *
     * @param date
     */
    load(date) {
        this.currentDate = date;
        this.selectedDate =    this.currentDate
        this.render();
    }

    render() {
        // 创建头部
        const header = document.createElement('div');
        header.className = 'header';

        // 上个月按钮
        const prevBtn = document.createElement('button');
        prevBtn.className = 'nav-btn';
        prevBtn.innerHTML = '&lt;';
        prevBtn.addEventListener('click', () => this.changeMonth(-1));

        // 下个月按钮
        const nextBtn = document.createElement('button');
        nextBtn.className = 'nav-btn';
        nextBtn.innerHTML = '&gt;';
        nextBtn.addEventListener('click', () => this.changeMonth(1));

        // 月份显示
        const monthDisplay = document.createElement('div');
        monthDisplay.textContent = this.getMonthYearString();

        // 星期标题
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekHeader = document.createElement('div');
        weekHeader.className = 'calendar';
        weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day-header';
            dayElement.textContent = day;
            weekHeader.appendChild(dayElement);
        });

        // 日期网格
        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar';
        this.createDays(calendarGrid);

        // 组装组件
        header.appendChild(prevBtn);
        header.appendChild(monthDisplay);
        header.appendChild(nextBtn);

        this.container.innerHTML = '';
        this.container.appendChild(header);
        this.container.appendChild(weekHeader);
        this.container.appendChild(calendarGrid);
    }

    createDays(container) {
        const firstDay = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            1
        );

        const lastDay = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1,
            0
        );

        // 计算需要显示的上个月天数
        const startDay = firstDay.getDay();
        const prevMonthDays = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            0
        ).getDate();

        // 生成日期格子
        let dayCount = 0;

        // 添加上个月的日期
        for (let i = startDay - 1; i >= 0; i--) {
            const day = this.createDayElement(prevMonthDays - i, true);
            container.appendChild(day);
            dayCount++;
        }

        // 添加本月日期
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = this.createDayElement(i, false);
            container.appendChild(day);
            dayCount++;
        }

        // 添加下个月的日期
        let nextMonthDay = 1;
        while (dayCount < 42) {
            const day = this.createDayElement(nextMonthDay, true);
            container.appendChild(day);
            nextMonthDay++;
            dayCount++;
        }
    }

    createDayElement(day, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;

        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        } else {
            // 检查是否是今天
            const today = new Date();
            if (
                day === today.getDate() &&
                this.currentDate.getMonth() === today.getMonth() &&
                this.currentDate.getFullYear() === today.getFullYear()
            ) {
                dayElement.classList.add('current-day');
            }

            // 检查是否是选中日期
            if (
                this.selectedDate &&
                day === this.selectedDate.getDate() &&
                this.currentDate.getMonth() === this.selectedDate.getMonth() &&
                this.currentDate.getFullYear() === this.selectedDate.getFullYear()
            ) {
                dayElement.classList.add('selected');
            }

            dayElement.addEventListener('click', () => this.selectDate(day));
        }

        return dayElement;
    }

    selectDate(day) {
        let arr = [
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            day
        ]
        this.selectedDate = new Date(
            ...arr
        );
        console.log('Selected date:', this.selectedDate.toLocaleDateString());
        this.render();
        if (this.onSelected) {
            this.onSelected(arr)
        }
    }

    changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.render();
    }

    getMonthYearString() {
        return `${this.currentDate.getFullYear()}年 ${this.currentDate.toLocaleString('zh-CN', { month: 'long' })}`;
    }



}

import {BaseEle, css} from "./core.js"

class ZDatePicker extends BaseEle {
    constructor() {
        super();
        let self = this;
        this.attachShadow({mode: 'open'});
        this.setCSS(css`
        .datepicker {
            font-family: Arial, sans-serif;
            width: max-content;
            border: 1px solid #ccc;
            padding: 16px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            background-color: #fff;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .nav-btn {
            cursor: pointer;
            padding: 5px 10px;
            border: none;
            background: #f0f0f0;
            border-radius: 3px;
        }

        .nav-btn:hover {
            background: #e0e0e0;
        }

        .calendar {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
        }

        .day-header {
            text-align: center;
            font-weight: bold;
            padding: 5px;
            color: #666;
        }

        .day {
            text-align: center;
            padding: 3px 6px;
            cursor: pointer;
            border-radius: 3px;
        }

        .day:not(.selected):hover {
            background: #f0f0f0;
        }

        .other-month {
            color: #ccc;
        }

        .selected {
            background: #007bff;
            color: white;
        }

        .current-day {
            background: #e6f3ff;
        }
        `)
        this.shadowRoot.innerHTML = '<div id="datepicker" class="datepicker"></div>';
        this.picker = new DatePicker(this.shadowRoot.querySelector('#datepicker'));
        this.picker.onSelected = function (selectedDateArr) {
            let arr = selectedDateArr.map(item => {
                return item;
            })
            arr[1] = arr[1] + 1;
            arr[0] = arr[0].toString().padStart(2, '0');
            arr[1] = arr[1].toString().padStart(2, '0');
            let str = arr.join('-');
            console.log(selectedDateArr, str);
            self.value = str;
            self.dispatchEvent(new Event('change'));
        }
    }

    attrChanged(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
        this.value = newValue;
        let arr = newValue.split('-');
        let newdate = new Date(parseInt(arr[0]), parseInt(arr[1]) - 1, parseInt(arr[2]))
        console.log(arr, newdate);
        this.picker.load(newdate)
    }
}

ZDatePicker.defsel('z-date-picker',{
    attrs: {
        value: '',
    }
});