// 防抖函数
// 1. 随便找一个防抖函数
// API说明
/**
 * 形参1 func -> 函数
 * 形参2 wait->时间
 * return 函数
 */

// 频繁触发的函数
// function a(){

// }
// const b = debounce(function(num1,num2){},800)
// b()

// 函数:具有独立作用的一段代码
// 作用sum : 求和
const sum = (a, b) => {
    return a + b
}

// 一个函数的形参或者返回值也是函数
// b作用:求三个数的和
const b = (fn1, num3) => {
    const c = fn1(10, 20) + num3
    return c
}
b(sum, 30)

const ddd = (a, v, c) => {
    return a + v + c
}

// 函数的形参可以是函数->复用已有函数->高级函数

export const debounce = function(func, wait) {
    let timeout
    return function() {
        let context = this
        let args = arguments

        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(() => {
            func.apply(context, args)
        }, wait)
    }
}