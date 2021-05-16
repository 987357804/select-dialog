import request from '../request'

// 设备列表
export function deviceInfoList(data) {
    return request({
        url:'deviceInfoList',
        method:'post',
        data,
    })
}

// 拨测任务列表
export function dialTaskList(data) {
    return request({
        url:'dialTaskList',
        method:'post',
        data,
    })
}

// 拨测任务列表
export function getDiaInterfaceList(data) {
    return request({
        url:'getDiaInterfaceList',
        method:'post',
        data//: JSON.stringify(data),
    })
}