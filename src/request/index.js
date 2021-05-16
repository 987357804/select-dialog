import Axios from 'axios';

// const baseURL = 'http://47.113.124.44:20042/portal2/rest/'

// 新建实例
const service = Axios.create({
    baseURL,
    timeout: 5000,
})

// 配置拦截期deviceInfoList
service.interceptors.request.use()

service.interceptors.response.use(
    response => {
        const res = response.data;
        if(res.ret_code === 0) {
            return res
        }
    },
    error => {
    }
)

export default service