<template>
    <div class="app-container calendar-list-container ggg_user">
        <div class="filter-container" style="max-width: 1000px;">
            <el-form :rules="rules" :model="form" ref="form" label-width="155" @keyup.enter.native="submitFrom('form')">
                <el-form-item label="方式" prop="status">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option label="手动" value="0"></el-option>
                        <el-option label="自动" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <el-form-item label="发送到" prop="phone" v-if="form.status == 0">
                        <el-input v-model="form.phone" maxlength="11" placeholder="请输入电话号码"></el-input>
                    </el-form-item>
                    <el-form-item label="上传Excel文档" prop="file" v-else>
                        <el-row :gutter="20">
                            <el-col :span="3">
                                <el-button type="button" size="small" @click="download" style="margin-bottom:10px;">
                                    下载模板
                                </el-button>
                            </el-col>
                            <el-col :span="12">
                                <upLoadimg :isXlsx="true" v-on:successLoad="(value)=> successLoad(value, 'form', 'file')" v-on:handleRemove="(value)=> handleRemove(value, 'form', 'file')"></upLoadimg>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </div>
                <el-form-item label="推送内容" prop="content">
                    <el-input type="textarea" :rows="8" placeholder="请输入" v-model="form.content"></el-input>
                </el-form-item>

                <el-form-item style="text-align: center;">
                    <el-button type="primary" size="medium" @click="submitFrom('form')" :loading="loading">发送
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import ajax from '@utils/config';
import { parseTime } from '@src/filters';
import { storage } from '@constants/dataStorage';
import { downloadExecl } from '@src/common/downloadExecl';
import upLoadimg from '@src/components/upLoadimg1';
import { validate } from '@src/utils/validation';

export default {
    components: {
        upLoadimg
    },
    data() {
        var phone = (rule, value, callback) => {
            if (!validate.validatPhone(value)) {
                callback(new Error('手机号码格式不正确'));
                return false;
            }
            callback();
        };
        return {
            loading: false,
            storage: storage,
            form: {
                status: '0',//1自动 or  0手动
                phone: '',
                content: '',
                file: '',
                type: '1',//

            },
            rules: {
                phone: [
                    { required: true, message: '请输入', trigger: 'blur' },
                    { validator: phone, trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                file: [
                    { required: true, message: '请输入', trigger: 'change' },
                ],
            }
        }
    },
    computed: {},
    created() {
    },
    mounted() {

    },
    methods: {
        download() {
            downloadExecl({ url: 'message/exportPhoneExcelTemp', input: '', method: 'get' })
        },
        //上传成功
        successLoad(obj, firstName, twoName) {
            this[firstName][twoName] = obj.file;
            // this.rowData.name = obj.name;
        },
        //删除
        handleRemove(url, firstName, twoName) {
            if (url == this[firstName][twoName]) {
                this[firstName][twoName] = '';
            }
        },

        submitFrom(formName) {
            let url = 'message/send', contentType;
            if (this.form.status == 1) {
                url = 'message/excel/send';
                contentType = 'multipart/form-data';
            }

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    ajax({
                        url: url,
                        optionParams: this.form,
                        contentType: contentType
                    }).post()
                        .then(response => {
                            if (response.code === 200) {
                                this.alertFrom = response.data ? response.data : {};
                                this.$message.success(response.message);
                                this.$refs[formName].resetFields();
                                this.loading = false;
                            } else {
                                this.$message({
                                    message: response.message,
                                    type: 'warning'
                                });
                                this.loading = false;
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            this.loading = false;
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }

    },
    filters: {}
}
</script>
<style lang="less" scoped>

</style>
