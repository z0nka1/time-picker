/**
 * 时间选择组件
 * Created by z0nka1 on 2018/05/26
 */
import {AfterViewInit, Component, forwardRef, Input, OnInit, Renderer} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
@Component({
    selector: 'time-picker',
    templateUrl: 'time-picker.component.html',
    styleUrls: ['time-picker.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TimePicker),
            multi: true
        }
    ]
})
export class TimePicker implements ControlValueAccessor, OnInit, AfterViewInit{
    @Input() inputWidth = 100; // 输入框宽度
    @Input() inputHeight = 30; // 输入框高度
    _value: string;
    showBox = false; // 控制选择面板显示与否，true为显示
    hours = []; // 小时数组
    minutes = []; // 分钟数组
    hourIsSelect = false; // 打开选择面板后，标记小时是否被点击
    minIsSelect = false; // 打开选择面板后，标记分钟是否被点击

    selectedHour; // 当前小时
    selectedMinute; // 当前分钟

    bodyClickListener: any;

    constructor(
        public renderer: Renderer
    ){}

    ngOnInit(){
        for(let i = 0; i < 24; i++){
            let h;
            if(i < 10){
                h = '0' + i;
            }else{
                h = '' + i;
            }
            this.hours.push(h);
        }
        for(let j = 0; j < 60; j++){
            let m;
            if(j < 10){
                m = '0' + j;
            }else{
                m = '' + j;
            }
            this.minutes.push(m);
        }
    }

    ngAfterViewInit(){
        this.bodyClickListener = this.renderer.listenGlobal('body','click', () => { this.hide() });
    }

    onChange = (time: string) => {};
    onTouched = () => {};

    get value(): string{
        return this._value;
    }

    set value(val: string){
        if(val !== this._value){
            this._value = val;
            this.onChange(val);
        }
    }

    writeValue(val: string): void{
        if(val !== this._value){
            this._value = val;
        }
        if(this._value){
            let time = this._value.split(':');
            this.selectedHour = time[0];
            this.selectedMinute = time[1];
        }
    }

    registerOnChange(fn: (time: string) => void): void{
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void{
        this.onTouched = fn;
    }

    /**
     * 隐藏选择面板
     */
    hide(){
        this.showBox = false;
        this.hourIsSelect = false;
        this.minIsSelect = false;
    }

    /**
     * 显示选择面板
     */
    show(){
        this.showBox = true;
    }

    /**
     * 输入框获得焦点
     * @param event
     */
    onInputFocus(event){
        event.stopPropagation();
        this.show();
    }

    /**
     * 输入框失去焦点
     */
    onInputBlur(){
        this.onTouched();
    }

    /**
     * 输入框点击
     * @param event
     */
    onInputClick(event){
        event.stopPropagation();
    }

    /**
     * 选择小时
     * @param h
     * @param event
     */
    onHourClick(h, event){
        event.stopPropagation();

        this.selectedHour = h;
        this.value = this.selectedHour + ':' + (this.selectedMinute ? this.selectedMinute : '00');

        this.hourIsSelect = true;
        if(this.hourIsSelect && this.minIsSelect){
            this.hide();
        }
    }

    /**
     * 选择分钟
     * @param min
     * @param event
     */
    onMinuteClick(min, event){
        event.stopPropagation();

        this.selectedMinute = min;
        this.value = (this.selectedHour ? this.selectedHour : '00') + ':' + this.selectedMinute;

        this.minIsSelect = true;
        if(this.hourIsSelect && this.minIsSelect){
            this.hide();
        }
    }
}
