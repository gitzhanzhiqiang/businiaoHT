<template>
    <div class="ggg_user">
        <el-upload :accept="accept" action="" :class="{'upload-demo': isXlsx, 'imgLoadButtonCenter': !isXlsx}" :list-type="picture_card" v-loading="loading" :file-list="fileList" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus" v-if="!isXlsx"></i>
            <el-button size="small" type="primary" v-else>导入Excel</el-button>
        </el-upload>
    </div>
</template>
<script>
import co from "co";
import OSS from "ali-oss";
export default {
    data() {
        return {
            loading: false,
            fileList: [],
            baseUrl: 'https://ygg168.oss-cn-shanghai.aliyuncs.com/',
            // ossImgUrl: '?x-oss-process=style/jm'
            ossImgUrl: '',
            picture_card: 'picture-card',
            accept: '',
            file: ' // 存储excel'
        }
    },
    props: {
        isOne: Boolean,
        imgShow: String,
        dialogVisible: Boolean,
        isXlsx: Boolean
    },
    watch: {
        //第一次进入，监控不了dialogVisible变化所以写在created钩子里解决
        dialogVisible: function(newValue, oldValue) {
            if (newValue) {
                if (this.imgShow) {
                    this.fileList = [
                        { name: '', url: this.imgShow }
                    ]
                } else {
                    this.fileList = [];
                }

            }
        }
    },
    computed: {
    },
    created() {
        //当excel时。type
        if (this.isXlsx) {
            this.accept = '.xlsx';
            this.picture_card = '';
        }
        //初始化第一次用到要不显示不了默认图片
        if (this.imgShow) {
            this.fileList = [
                { name: this.imgShow, url: this.imgShow + this.ossImgUrl }
            ]
        } else {
            this.fileList = [];
        }
    },
    mounted() {
    },
    methods: {
        //删除
        handleRemove(file, fileList) {
            // //当excel时
            // if (this.isXlsx) {
            //     // this.$emit('handleRemove', this.file);
            // }
            //当上传的时候，删除的钩子也是走的，但是file.name是上传的图片name,而不是处理过的图片名字（所以使用时可判断name相等，删除）
            console.log(file)
            if (file) {
                this.$emit('handleRemove', file.url);
            }
        },
        //上传之前格式大小校检
        beforeAvatarUpload(file) {
            this.loading = true;
            //当excel时
            if (this.isXlsx) {
                let name = '';
                if (file.name.length > 20) {
                    name = file.name.substring(0, 10) + '...' + file.name.substring(file.name.length * 1 - 7, file.name.length * 1)
                } else {
                    name = file.name;
                }
                this.fileList = [
                    {
                        name: name,
                        url: ''
                    }
                ]
                let obj = {
                    file: file,
                    name: name
                }
                //
                setTimeout(() => {
                    this.$emit('successLoad', obj);
                    this.loading = false;
                })
                return false;
            }
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
            let that = this;
            let name = 'debt/' + this.getNowDate() + '/' + this.timestamp() + parseInt(Math.random() * 10000) + '.' + fileName[fileName.length - 1];
            this.$emit('successLoad',  that.baseUrl + name);
            co(function* () {
                let img = yield client.multipartUpload(name, file);
                // 只上传一个
                if (that.isOne) {
                    that.fileList = [
                        { name: name, url: that.baseUrl + name + that.ossImgUrl }
                    ]
                } else {
                    that.fileList.push(
                        {
                            name: name,
                            url: that.baseUrl + name + that.ossImgUrl
                        }
                    );
                }
                that.loading = false;
            }).catch(function(err) {
                console.log(err);
                that.loading = false;
            });
            return false;
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
    },
    filters: {
    }
}
</script>
<style lang="less">
.ggg_user {
    .upload-demo {
        .el-upload-list__item-name [class^=el-icon] {
            height: auto!important;
        }
    }
    .imgLoadButtonCenter {
        .el-upload--picture-card {
            padding-top: 60px;
        }
    }
}
</style>


