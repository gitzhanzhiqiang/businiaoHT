<template lang="html">
    <div class="filter-container" v-loading="loading">
        <div class="wangEditor-box"><div class="wangeditor" :id="editorName"></div></div>
        <div id="#div1"></div>   
    </div>
    
</template>

<script>

import WangEditor from 'wangeditor'
import { baseURL } from '@utils/baseURL';
import co from "co";
import OSS from "ali-oss";
import {
    Message
} from 'element-ui';



export default {
    data() {
        return {
            content: '',
            editor: '',
            loading: false
        }
    },
    props: {
        value: String,
        editorName: String, //富文本id文字
        isAlert: Boolean //是否是弹窗内的复文本
    },
    created() {
    },
    mounted() {
        this.createEditor();
        //第一次进入的时候弹框(解决弹窗内的复文本第一次出现没有值得情况)
        if (this.isAlert) {
            this.editor.txt.html(this.value ? this.value : '');
        }
    },
    watch: {
        value: function(newValue, oldValue) {
            this.editor.txt.html(newValue); //设置复文本值
            if (newValue === oldValue) return;
            this.editor.txt.html(newValue ? newValue : ''); //设置复文本值 当值为undefind时， 复文本值不更新
        }
    },
    methods: {
        createEditor() {
            this.editor = new WangEditor('#' + this.editorName);

            // this.editor.customConfig.menus = ['head', 'bold', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor', 'link', 'list', 'justify', 'quote', 'emoticon', 'image', 'table', 'video', 'code', 'undo', 'redo']

            this.editor.customConfig.uploadImgServer = 'http://192.168.1.72:8080/a/business/upload/gen';
            this.editor.customConfig.uploadFileName = 'file';
            this.editor.customConfig.zIndex = 1000;
            // 上传图片的错误提示默认使用alert弹出，你也可以自定义用户体验更好的提示方式(// 因为是ocss上传，在提示这边直接拦截)
            this.editor.customConfig.customAlert = function(info) {
                // info 是需要提示的内容
                // alert('自定义提示r443543：' + info)
            }
            this.editor.customConfig.uploadImgParams = {
                // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
                // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
                token: '1ad9821e1c8047d691af9bb79fb5527f'
            }
            //   this.editor.customConfig.uploadImgMaxLength = 1;
            // 自定义上传（oss上传）
            this.editor.customConfig.customUploadImg = (files, insert) => {
                this.loading = true;
                files.map((item) => {
                    let file = item;
                    let fileName = file.name.split('.');
                    const isLt2M = file.size / 1024 / 1024 < 10;
                    if (file.type != 'image/jpeg' && file.type != 'image/png') {
                        this.$message.error('上传的图片只能是 JPG、PNG 格式!');
                        this.loading = false;
                        return false;
                    }
                    if (!isLt2M) {
                        this.$message.error('上传的图片大小超过 10MB 的将不在上传队列！');
                        this.loading = false;
                        return false;
                    }
                    const client = new OSS({
                        region: "oss-cn-shanghai",
                        accessKeyId: "LTAIR632dUFd2DhQ",
                        accessKeySecret: "vBysGq1EM3Ti3vjmY5dyJmtKaACoDn",
                        bucket: "ygg168"
                    });
                    // 上传
                    let name = 'shd/infoimg/' + this.getNowDate() + '/' + this.timestamp() + parseInt(Math.random() * 10000) + '.' + fileName[fileName.length - 1];
                    let that = this;
                    co(function* () {
                        let img = yield client.multipartUpload(name, file);
                        // 只上传一个
                        insert('https://img.zhaogu168.com/' + name);
                        that.loading = false;
                    }).catch(function(err) {
                        console.log(err);
                        that.loading = false;
                    });
                })
            }
            // 
            // this.editor.customConfig.uploadImgHooks = {
            //   before: function(xhr, editor, files) {
            //     console.log(this)
            //     // 图片上传之前触发
            //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
            //     if (true) {
            //       return false;
            //     }
            //   },
            //   fail: function(xhr, editor, result) {
            //     // 图片上传并返回结果，但图片插入错误时触发
            //     // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            //     console.log(editor);
            //   },
            //   // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
            //   // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
            //   customInsert: function(insertImg, result, editor) {
            //     // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            //     // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
            //     console.log(result);
            //     console.log(editor);
            //     if (result.code == "200") {
            //       insertImg('http://192.168.1.72:8080/a/business/upload/gen' + result.data.path)
            //     } else {
            //       Message({
            //         message: result.message,
            //         type: 'error',
            //         duration: 5 * 1000
            //       });
            //     }
            //     // result 必须是一个 JSON 格式字符串！！！否则报错
            //   }
            // }
            //设置值和返回页面
            this.editor.customConfig.onchange = (html) => {
                this.content = html;
                this.$emit("listenWEditorChange", html);
            }
            this.editor.create()
        },
        defaultValue(value) {
            this.$nextTick(() => {
                this.editor.txt.html(value);
            })
        },
        getNowDate() {
            let d = new Date()
            let yue = '';
            let ri = '';
            if ((d.getMonth() + 1) < 10) {
                yue = ('0' + (d.getMonth() + 1))
            } else {
                yue = (d.getMonth() + 1)
            }
            if ((d.getDate()) < 10) {
                ri = ('0' + (d.getDate()))
            } else {
                ri = (d.getDate())
            }

            let dateTmp = (d.getFullYear()) + yue + ri
            return dateTmp;
        },
        timestamp() {
            let time = new Date();
            let y = time.getFullYear();
            let m = time.getMonth() + 1;
            let d = time.getDate();
            let h = time.getHours();
            let mm = time.getMinutes();
            let s = time.getSeconds();
            return '' + y + this.add0(m) + this.add0(d) + this.add0(h) + this.add0(mm) + this.add0(s);
        },
        add0(m) {
            return m < 10 ? '0' + m : m;
        },
    }
}
</script>

<style lang="less" scoped>
.wangEditor-box {
    position: relative;
    z-index: 1;
}
</style>
