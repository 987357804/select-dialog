<template>
    <div class="index">
        <el-select v-model="monitor_type" size="small" @change="handleMonitorChange">
            <el-option 
                v-for="item in typeList" 
                :key="item.id"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <el-button class="select-button" @click="deviceShow = true" v-if="monitor_type === 0">选择设备</el-button>
        <el-button class="select-button" @click="diaTaskShow = true" v-if="monitor_type === 1">选择任务</el-button>

        <el-table :data="deviceSelection" v-if="monitor_type === 0">
            <el-table-column
                v-for="(item,index) in deviceProps"
                :key="index"
                :prop="item.prop"
                :label="item.label"
            ></el-table-column>
            <el-table-column>
                <template slot-scope="{$index}">
                    <el-button type="text" @click="removeItem($index)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-table :data="diaTaskSelection" v-if="monitor_type === 1">
            <el-table-column
                v-for="(item,index) in diaTaskProps"
                :key="index"
                :prop="item.prop"
                :label="item.label"
            ></el-table-column>
            <el-table-column>
                <template slot-scope="{$index}">
                    <el-button type="text" @click="removeItem($index)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 设备选择 -->
        <select-dialog
            title="选择设备"
            ref="deviceDialog"
            v-model="deviceSelection"
            :visible="deviceShow"
            :tableProps="deviceProps"
            :searchParams='deviceParams'
            @close="deviceShow = false"
            :api="deviceInfoList"
        >
            <template #search>
                <el-input @keyup.13.native="searchDevice" v-model="deviceParams.key_word" placeholder="请输入名称/SN号/IP地址查询">
                    <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="searchDevice"></i>
                </el-input>
            </template>
        </select-dialog>

        <!-- 任务选择 -->
        <select-dialog
            title="选择任务"
            ref="diaTaskDialog"
            v-model="diaTaskSelection"
            :visible="diaTaskShow"
            :tableProps="diaTaskProps"
            :searchParams='diaTaskParams'
            @close="diaTaskShow = false"
            :api="dialTaskList"
            is-single
            value-key="task_id"
        >
            <template #search>
                <el-input @keyup.13.native="searchDiaTask" v-model="diaTaskParams.task_name" placeholder="请输入任务名称">
                    <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="searchDiaTask"></i>
                </el-input>
            </template>
        </select-dialog>
    </div>
</template>

<script>
import selectDialog from '../../components/selectDialog';
import { deviceInfoList, dialTaskList } from '../../api/selectDialog';

export default {
    name:'index',
    components: {
        selectDialog,
    },
    data() {
        return {
            monitor_type: 0,
            // 监测类型下拉框数据
            typeList:[
                {value: 0, label: "自主监测告警"},
                {value: 1, label: "拨测告警"},
                {value: 2, label: "日志监测告警"},
                {value: 3, label: "外围系统告警"},
            ],

            // 选择设备
            deviceShow: false,
            deviceProps: [
                { prop: 'name_cn', label: '设备名称', attr: { 'show-overflow-tooltip':true } },
                { prop: 'sn', label: 'SN号' },
                { prop: 'ipv4', label: 'IP地址' },
                { prop: 'physics_name', label: '所在机房' },
                { prop: 'type', label: '设备类型', attr: {'formatter': ({type}) => this.fmt_device_type(type)} },
            ],
            deviceSelection: [],
            deviceParams: {
                key_word:'',
                type:"server",
                user_id: "6",
            },
            deviceInfoList,

            // 选择任务
            diaTaskShow:false,
            diaTaskProps: [
                { prop: 'task_name', label: '任务名称' },
                { prop: 'task_id', label: '任务编号' },
                { prop: 'total', label: '拨测接口数' },
                { prop: 'starter', label: '已开启报警接口' },
            ],
            diaTaskSelection: [],
            dialTaskList,
            diaTaskParams: { task_name: '' }
        }
    },
    mounted () {
    },
    methods: {
        handleMonitorChange(value) {

        },
        searchDevice(){
            this.$refs.deviceDialog.search();
        },
        searchDiaTask(){
            this.$refs.deviceDialog.search();
        },
        removeItem(index) {
            if (this.monitor_type === 0) {
                this.deviceSelection.splice(index,1);
            } else if (this.monitor_type === 1) {
                this.diaTaskSelection.splice(index,1);
            }
        },
        fmt_device_type(str) {
            let ret = '';
            if (str == "server") {
                ret = '服务器';
            } else if (str == "switcher") {
                ret = '交换机';
            } else if (str == "firewall") {
                ret = '防火墙';
            } else if (str == "load_bal") {
                ret = '负载均衡';
            } else if (str == "router") {
                ret = '路由器';
            } else if (str == "wdm") {
                ret = '波分';
            } else if (str == "encoder") {
                ret = '编码器';
            } else if (str == "transcode") {
                ret = '转码器';
            } else if (str == "satellite") {
                ret = '卫星接收器';
            } else if (str == "ipswcher") {
                ret = 'IP切换器';
            } else if (str == "ipdelayer") {
                ret = 'IP延时器';
            } else if (str == "nonedit") {
                ret = '非编机';
            } else if (str == "kvm") {
                ret = 'KVM';
            } else if (str == "potn") {
                ret = 'POTN/OTN设备';
            } else if (str == "datacontroller") {
                ret = '文件存储控制器';
            } else if (str == "datadiskbox") {
                ret = '文件存储硬盘框';
            } else if (str == "vm") {
                ret = '虚拟机';
            }
            return ret;
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
