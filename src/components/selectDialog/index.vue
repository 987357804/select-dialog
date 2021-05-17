<template>
    <div class="select-dialog" >
        <el-dialog class="my-dialog" @open="initDialog" :title="title" top="5vh" :visible.sync="visible" :before-close="closeDialog">
            <!-- 头部内容 start -->
            <div class="header-box">
                <slot name="search"></slot>
            </div>
            <!-- 头部内容 end -->

            <!-- 弹窗列表内容 start -->
            <el-table 
                ref="selectTable"
                :data="tableData"
                row-key="code"
                @selection-change="selectionList = $event"
            >
                <el-table-column width="55" v-if="isSingle">
                    <template slot-scope="{row}">
                        <el-radio v-model="radioValue" @change="selectionList = [$event]" :label="row"></el-radio>
                    </template>
                </el-table-column>
                <el-table-column type="selection" reserve-selection width="55" v-else></el-table-column>
                <el-table-column
                    v-for="(item,index) in tableProps"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    v-bind="item.attr"
                ></el-table-column>
            </el-table>
            <!-- 弹窗列表内容 end -->

            <el-pagination
                class="dialog-pagination"
                layout="prev,pager,next"
                :current-page="tableConfig.page"
                :page-size="tableConfig.rows"
                :total="tableTotal"
                @current-change="pageChange"
            ></el-pagination>

            <!-- 底部内容 start -->
            <span slot="footer" class="dialog-footer">
                <span class="length-tips">已选 {{selectionList.length}} 个</span>
                <el-button size="small" @click="closeDialog">取 消</el-button>
                <el-button size="small" type="primary" @click="submitData">确 定</el-button>
            </span>
            <!-- 底部内容 end -->
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        title: { type: String, default: '选择' },
        value: { type: Array, default: [] },
        visible: { type: Boolean, default: false },
        searchParams: { type: Object, default: {} },
        api: { type: Function },
        isSingle: { type: Boolean, default: false },
        valueKey: { type: String, default: "code" },

        tableProps: { type: Array, default: [] },
    },
    // 定义组件的v-model
    model: {
        prop: 'value',
        event: 'change',
    },
    data() {
        return {
            // 单选值
            radioValue: {},

            // 列表展示数据
            tableData: [],
            tableConfig: {
                page: 1,
                rows: 5,
            },
            tableTotal: 0,

            // 用户选中的数据
            selectionList: [], 
        }
    },
    methods: {

        // 初始化弹窗 —— 弹窗打开时触发
        initDialog() {
            if (this.isSingle) {
                this.selectionList = this.value.map(item => ({ ...item, code: item[this.valueKey] }))
            } else {
                this.value.forEach(item => {
                    const newObj = {...item, code: item[this.valueKey]};
                    this.$refs.selectTable.toggleRowSelection(newObj)
                });
            }
            this.getData();
        },

        // 监听分页切换
        pageChange(page) {
            this.tableConfig.page = page;
            this.getData();
        },

        // 初始化勾选 —— 数据回显效果
        initSeletion() {
            this.value.forEach(item => {
                const isHas = this.tableData.find(sItem => item.code === sItem.code);
                if (isHas) {
                    this.radioValue = isHas;
                }
            })
        },

        // 确认选中数据
        submitData() {
            this.$emit('change', [...this.selectionList]);
            this.closeDialog();
        },

        // 关闭弹窗
        closeDialog() {
            this.tableConfig.page = 1;
            this.$refs.selectTable.clearSelection();
            this.$emit('close',false);
        },

        search() {
            this.tableConfig.page = 1;
            this.getData();
        },

        // 获取设备列表
        async getData() {
            const params = {
                ...this.searchParams,
                ...this.tableConfig,
            }
            try {
                const res = await this.api(params);
                // warning: 需要根据数据结构作修改
                const data = res.list || res.data;
                this.tableData = data.map(item => {
                    let newItem = {...item, code: item[this.valueKey]}
                    return newItem
                })
                this.tableTotal = res.count;
                if (this.isSingle) {
                    this.initSeletion();
                }
            } catch (error) {
                console.log('error: ', error);
            }
        },
    }
}
</script>

<style scoped>
.my-dialog >>> .el-dialog__body{
    padding: 30px 20px 0;
}
.my-dialog .dialog-pagination{
    margin-top: 20px;
    text-align: right;
}
.dialog-footer .length-tips{
    margin-right: 10px;
}
.my-dialog >>> .el-radio__label{
    display: none;
}
</style>
